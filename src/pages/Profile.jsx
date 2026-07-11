import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaCalendar, FaShoppingBag, FaCamera, 
  FaEdit, FaSave, FaEye, FaEyeSlash, FaTimes, FaSpinner, FaMapMarkerAlt, FaPhone,
  FaDownload
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const fileInputRef = useRef(null);

  // Form States
  const [formData, setFormData] = useState({
    full_name: '',
    profile_image_url: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
    phone: '',
    address: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchOrders();
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        profile_image_url: user.profile_image_url || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const data = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Upload Profile Image =====
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setUploading(true);
      const response = await api.post('/admin/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, profile_image_url: response.url }));
      toast.success('រូបភាពបានផ្ទុកឡើង!');
    } catch (error) {
      toast.error('បរាជ័យក្នុងការផ្ទុករូបភាព');
    } finally {
      setUploading(false);
    }
  };

  // ===== Update Profile =====
  const handleUpdateProfile = async () => {
    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      toast.error('ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នា');
      return;
    }

    try {
      const updateData = {
        full_name: formData.full_name,
        profile_image_url: formData.profile_image_url,
        phone: formData.phone,
        address: formData.address
      };
      if (formData.new_password) {
        updateData.password = formData.new_password;
      }

      const updatedUser = await api.put('/auth/me', updateData);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      toast.success('ប្រវត្តិរូបបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!');
      window.location.reload();
    } catch (error) {
      toast.error(error?.detail || 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូប');
    }
  };

  // ===== Download All Order History (HTML to PDF) =====
  const handleDownloadAllHistory = async () => {
    if (orders.length === 0) {
      toast.error('គ្មានការបញ្ជាទិញដើម្បីទាញយក');
      return;
    }

    setDownloadingAll(true);
    
    // 1. បង្កើត HTML បណ្ដោះអាសន្នសម្រាប់ PDF
    const tableRows = orders.map((order, index) => `
      <tr>
        <td style="text-align:center; padding:8px; border-bottom:1px solid #ddd;">${index + 1}</td>
        <td style="padding:8px; border-bottom:1px solid #ddd;">${order.order_number}</td>
        <td style="padding:8px; border-bottom:1px solid #ddd;">${new Date(order.created_at).toLocaleDateString('km-KH')}</td>
        <td style="padding:8px; border-bottom:1px solid #ddd; color:#4f46e5; font-weight:bold;">$${order.total_amount.toFixed(2)}</td>
        <td style="padding:8px; border-bottom:1px solid #ddd;">${order.status.toUpperCase()}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: 'Noto Sans Khmer', sans-serif; padding: 40px; background: white; max-width: 800px; margin: auto;">
        <h1 style="text-align: center; color: #4f46e5; font-size: 28px; margin-bottom: 20px;">ប្រវត្តិការបញ្ជាទិញ</h1>
        <div style="margin-bottom: 20px; font-size: 14px;">
          <p><strong>ឈ្មោះអតិថិជន:</strong> ${user?.full_name || 'អ្នកប្រើប្រាស់'}</p>
          <p><strong>អ៊ីមែល:</strong> ${user?.email}</p>
          <p><strong>កាលបរិច្ឆេទ:</strong> ${new Date().toLocaleDateString('km-KH')}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #4f46e5; color: white;">
              <th style="padding: 12px; text-align: center;">#</th>
              <th style="padding: 12px; text-align: left;">លេខបញ្ជាទិញ</th>
              <th style="padding: 12px; text-align: left;">កាលបរិច្ឆេទ</th>
              <th style="padding: 12px; text-align: right;">សរុប</th>
              <th style="padding: 12px; text-align: left;">ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <p style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">អរគុណសម្រាប់ការជឿជាក់លើយើង!</p>
      </div>
    `;

    // 2. បង្កើត container បណ្ដោះអាសន្នក្នុង DOM
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    try {
      // 3. ប្រើ html2canvas ដើម្បីថតរូបភាព
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // 4. បម្លែងទៅជា PDF
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('ប្រវត្តិការបញ្ជាទិញ.pdf');
      toast.success('ប្រវត្តិការបញ្ជាទិញបានទាញយកដោយជោគជ័យ!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('បរាជ័យក្នុងការទាញយក PDF');
    } finally {
      document.body.removeChild(container);
      setDownloadingAll(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-50/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-5xl text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ===== Profile Sidebar ===== */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 overflow-hidden"
            >
              {/* Glass Blobs */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-300/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-2 border-white/50 shadow-xl bg-white/30 backdrop-blur-sm">
                    {formData.profile_image_url ? (
                      <img 
                        src={formData.profile_image_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="text-5xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-white/30 backdrop-blur-md border border-white/50 text-gray-600 p-2.5 rounded-full hover:bg-white/50 transition-all duration-300 shadow-lg"
                        disabled={uploading}
                      >
                        {uploading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <FaCamera className="text-sm" />
                        )}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                {/* Name */}
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="text-center text-2xl font-bold text-gray-700 bg-transparent border-b-2 border-gray-300/50 focus:border-indigo-400 outline-none w-full mb-1 transition-colors duration-300 placeholder-gray-400"
                    placeholder="ឈ្មោះពេញ"
                  />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-700 mb-1">{user?.full_name || 'អ្នកប្រើប្រាស់'}</h3>
                )}
                <p className="text-gray-500 text-sm mb-6">@{user?.username}</p>

                {/* Contact Info (Glass Style) */}
                <div className="space-y-3 text-left bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/30">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <FaEnvelope className="text-gray-500 flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <FaCalendar className="text-gray-500 flex-shrink-0" />
                    <span>ជាសមាជិកតាំងពី {new Date(user?.created_at).toLocaleDateString()}</span>
                  </div>
                  {isEditing && (
                    <>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <FaPhone className="text-gray-500 flex-shrink-0" />
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="លេខទូរស័ព្ទ"
                          className="bg-transparent border-b border-gray-300/50 focus:border-indigo-400 outline-none flex-1 transition-colors duration-300 placeholder-gray-400"
                        />
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-gray-500 flex-shrink-0" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="អាសយដ្ឋាន"
                          className="bg-transparent border-b border-gray-300/50 focus:border-indigo-400 outline-none flex-1 transition-colors duration-300 placeholder-gray-400"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons (Pure Glass) */}
                <div className="space-y-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-white/20 backdrop-blur-md border border-white/40 text-gray-700 py-3 rounded-xl font-medium hover:bg-white/40 transition-all duration-300"
                    >
                      <FaEdit className="mr-2 inline text-indigo-400" /> កែសម្រួលប្រវត្តិរូប
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleUpdateProfile}
                        className="w-full bg-white/20 backdrop-blur-md border border-white/40 text-gray-700 py-3 rounded-xl font-medium hover:bg-white/40 transition-all duration-300"
                      >
                        <FaSave className="mr-2 inline text-indigo-400" /> រក្សាទុក
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            full_name: user?.full_name || '',
                            profile_image_url: user?.profile_image_url || '',
                            current_password: '',
                            new_password: '',
                            confirm_password: '',
                            phone: user?.phone || '',
                            address: user?.address || ''
                          });
                        }}
                        className="w-full bg-white/20 backdrop-blur-md border border-white/40 text-gray-700 py-3 rounded-xl font-medium hover:bg-white/40 transition-all duration-300"
                      >
                        <FaTimes className="mr-2 inline" /> បោះបង់
                      </button>
                    </div>
                  )}
                  <button
                    onClick={logout}
                    className="w-full bg-red-400/20 backdrop-blur-md border border-red-400/40 text-red-500 py-3 rounded-xl font-medium hover:bg-red-400/40 transition-all duration-300"
                  >
                    ចាកចេញ
                  </button>
                </div>

                {/* Password Section (Edit Mode) */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 border-t border-white/30 pt-4 space-y-2"
                    >
                      <p className="text-xs font-semibold text-gray-500 text-center">ផ្លាស់ប្តូរពាក្យសម្ងាត់ (ស្រេចចិត្ត)</p>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder="ពាក្យសម្ងាត់បច្ចុប្បន្ន"
                          value={formData.current_password}
                          onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                          className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 pr-10 text-sm outline-none focus:border-gray-400 transition-colors duration-300 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="ពាក្យសម្ងាត់ថ្មី"
                          value={formData.new_password}
                          onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                          className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 pr-10 text-sm outline-none focus:border-gray-400 transition-colors duration-300 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                          value={formData.confirm_password}
                          onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                          className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 pr-10 text-sm outline-none focus:border-gray-400 transition-colors duration-300 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ===== Order History ===== */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-700 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/40 rounded-xl flex items-center justify-center text-gray-600 shadow-lg">
                    <FaShoppingBag />
                  </div>
                  <span>ប្រវត្តិការបញ្ជាទិញ</span>
                </h2>
                {orders.length > 0 && (
                  <button
                    onClick={handleDownloadAllHistory}
                    disabled={downloadingAll}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-xl text-gray-700 text-sm hover:bg-white/40 transition-all duration-300"
                  >
                    {downloadingAll ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaDownload /> <span>ទាញយកប្រវត្តិទាំងអស់</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                  <FaShoppingBag className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</p>
                  <p className="text-gray-400 text-sm">ចាប់ផ្តើមទិញទំនិញដើម្បីមើលប្រវត្តិនៅទីនេះ!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-4 hover:bg-white/40 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="font-mono bg-gray-200/20 px-2 py-0.5 rounded text-xs text-gray-600">#{order.order_number}</span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.created_at).toLocaleDateString('km-KH', { 
                              year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-indigo-500">
                            ${order.total_amount.toFixed(2)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;