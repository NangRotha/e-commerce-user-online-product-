import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaDownload, FaArrowLeft } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const data = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('រកមិនឃើញការបញ្ជាទិញ');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // ===== Generate and Download Invoice =====
  const handleDownloadInvoice = async () => {
    if (!order) return;
    setDownloading(true);
    
    // 1. រៀបចំទិន្នន័យ
    const address = order.shipping_address || {};
    const fullName = address.fullName || order.customer_name || 'ភ្ញៀវ';
    const businessName = 'Rotha Shop';
    const currentDate = new Date().toLocaleDateString('km-KH');
    const orderDate = new Date(order.created_at).toLocaleDateString('km-KH');

    // 2. បង្កើត HTML សម្រាប់ Invoice (បានប្តូរ Font ទៅ Khmer OS)
    const itemsHtml = order.items.map((item, index) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: left; font-size: 14px; color: #374151;">
          <div style="font-weight: 500;">${item.product_name || 'ផលិតផល'}</div>
          <div style="font-size: 12px; color: #9ca3af;">លេខកូដ: ${item.product_id}</div>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #374151;">$${item.unit_price.toFixed(2)}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #374151;">${item.quantity}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #374151; font-weight: 500;">$${item.total_price.toFixed(2)}</td>
      </tr>
    `).join('');

    const discountRate = order.coupon_code ? 0.2 : 0;
    const discountAmount = order.total_amount * discountRate;
    const subTotal = order.total_amount + discountAmount;

    // ===== បន្ទាត់សំខាន់: ប្តូរទៅប្រើ Khmer OS / Khmer UI =====
    const htmlContent = `
      <div id="invoice-container" style="font-family: 'Khmer OS', 'Khmer UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: #ffffff; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        
        <!-- ===== Header ===== -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
          <div style="max-width: 50%;">
            <h2 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: 700;">${businessName}</h2>
            <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">អាសយដ្ឋានការិយាល័យ</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">ផ្លូវលេខ ១២៣, សង្កាត់ទី ៤</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">ទីក្រុងភ្នំពេញ, កម្ពុជា</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">លេខទូរស័ព្ទ: +855 12 345 678</p>
          </div>
          <div style="text-align: right;">
            <h1 style="margin: 0; color: #4f46e5; font-size: 32px; letter-spacing: 1px; font-weight: 800;">វិក្កយបត្រ</h1>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">កាលបរិច្ឆេទចេញវិក្កយបត្រ: ${currentDate}</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">លេខវិក្កយបត្រ: ${order.order_number}</p>
          </div>
        </div>

        <!-- ===== Bill To / Ship To ===== -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb;">
          <div>
            <p style="margin: 0 0 8px 0; color: #4f46e5; font-weight: 600; font-size: 15px;">អតិថិជន:</p>
            <p style="margin: 2px 0; color: #374151; font-weight: 500;">${fullName}</p>
            ${address.address ? `<p style="margin: 2px 0; color: #6b7280;">${address.address}</p>` : ''}
            <p style="margin: 2px 0; color: #6b7280;">${address.city || ''} ${address.state || ''} ${address.zipCode || ''}</p>
            ${address.phone ? `<p style="margin: 2px 0; color: #6b7280;">${address.phone}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <p style="margin: 0 0 8px 0; color: #4f46e5; font-weight: 600; font-size: 15px;">កាលបរិច្ឆេទបញ្ជាទិញ:</p>
            <p style="margin: 2px 0; color: #6b7280;">${orderDate}</p>
            <p style="margin: 2px 0; color: #6b7280;">ស្ថានភាព: <span style="color: #f59e0b; font-weight: 500;">${order.status.toUpperCase()}</span></p>
            <p style="margin: 2px 0; color: #6b7280;">ការទូទាត់: <span style="color: #10b981; font-weight: 500;">${order.payment_status.toUpperCase()}</span></p>
          </div>
        </div>

        <!-- ===== Table ===== -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #4f46e5;">
              <th style="padding: 14px; text-align: left; color: white; font-size: 14px; font-weight: 600; width: 45%;">ការពិពណ៌នាទំនិញ</th>
              <th style="padding: 14px; text-align: right; color: white; font-size: 14px; font-weight: 600; width: 20%;">តម្លៃឯកតា</th>
              <th style="padding: 14px; text-align: center; color: white; font-size: 14px; font-weight: 600; width: 15%;">ចំនួន</th>
              <th style="padding: 14px; text-align: right; color: white; font-size: 14px; font-weight: 600; width: 20%;">សរុប</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- ===== Summary & Totals ===== -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151;">
              <span>សរុបរង:</span>
              <span>$${subTotal.toFixed(2)}</span>
            </div>
            ${discountRate > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #ef4444;">
                <span>បញ្ចុះតម្លៃ (${Math.round(discountRate * 100)}%):</span>
                <span>-$${discountAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 4px; background: #4f46e5; color: white; border-radius: 6px; padding: 12px 16px;">
              <span style="font-weight: 700; font-size: 16px;">ចំនួនទឹកប្រាក់ត្រូវបង់:</span>
              <span style="font-weight: 800; font-size: 18px;">$${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- ===== Footer ===== -->
        <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
          <p style="color: #4f46e5; font-size: 16px; font-weight: 600; margin-bottom: 10px;">សូមអរគុណចំពោះការទិញរបស់អ្នក!</p>
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280;">
            <div>
              <p style="margin: 2px 0; font-weight: 500;">សំណួរ?</p>
              <p style="margin: 2px 0;">អ៊ីមែល: contact@rothashop.com</p>
              <p style="margin: 2px 0;">ទូរស័ព្ទ: +855 12 345 678</p>
            </div>
            <div>
              <p style="margin: 2px 0; font-weight: 500;">ព័ត៌មានទូទាត់:</p>
              <p style="margin: 2px 0;">ធនាគារ: ធនាគារជាតិ</p>
              <p style="margin: 2px 0;">លេខគណនី: 1234-567-890</p>
            </div>
            <div>
              <p style="margin: 2px 0; font-weight: 500;">លក្ខខណ្ឌ:</p>
              <p style="margin: 2px 0;">សូមបង់ប្រាក់ក្នុងរយៈពេល ១៥ ថ្ងៃ</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // 3. បង្កើត container បណ្ដោះអាសន្នក្នុង DOM
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.background = '#ffffff';
    document.body.appendChild(container);

    try {
      // 4. ថតរូបភាពជាមួយ html2canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // 5. បម្លែងទៅជា PDF
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

      doc.save(`Invoice-${order.order_number}.pdf`);
      toast.success('វិក្កយបត្របានទាញយកដោយជោគជ័យ!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('បរាជ័យក្នុងការទាញយកវិក្កយបត្រ');
    } finally {
      document.body.removeChild(container);
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">រកមិនឃើញការបញ្ជាទិញ</h2>
          <Link to="/" className="mt-4 btn-primary inline-block">
            ត្រឡប់ទៅទំព័រដើម
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 to-purple-50/30 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 md:p-12"
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-400/20 backdrop-blur-md border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-5xl text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              ការបញ្ជាទិញបានជោគជ័យ!
            </h1>
            <p className="text-gray-600 mt-2">
              សូមអរគុណចំពោះការទិញរបស់អ្នក។ ការបញ្ជាទិញរបស់អ្នកត្រូវបានបញ្ជាក់។
            </p>
            <p className="text-sm text-indigo-500 font-medium mt-1">
              លេខបញ្ជាទិញ #: {order.order_number}
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">សេចក្តីសង្ខេបនៃការបញ្ជាទិញ</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ស្ថានភាព</span>
                <span className="font-medium text-indigo-500">{order.status.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ការទូទាត់</span>
                <span className="font-medium text-green-500">{order.payment_status.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">កាលបរិច្ឆេទ</span>
                <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="border-t border-white/30 mt-4 pt-4">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm py-2 border-b border-white/20 last:border-0">
                    <div>
                      <p className="font-medium text-gray-700">{item.product_name || 'ផលិតផល'}</p>
                      <p className="text-xs text-gray-500">ចំនួន: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-700">${item.total_price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/30 mt-4 pt-4">
              <div className="flex justify-between text-base font-bold">
                <span className="text-gray-800">សរុប</span>
                <span className="text-indigo-500">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownloadInvoice}
              disabled={downloading}
              className="flex-1 bg-white/20 backdrop-blur-md border border-white/40 text-gray-700 py-4 rounded-xl font-medium hover:bg-white/40 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {downloading ? (
                <div className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <FaDownload /> <span>ទាញយកវិក្កយបត្រ</span>
                </>
              )}
            </button>
            
            <Link
              to="/shop"
              className="flex-1 bg-white/20 backdrop-blur-md border border-white/40 text-gray-700 py-4 rounded-xl font-medium hover:bg-white/40 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <FaArrowLeft /> <span>បន្តការទិញ</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;