import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'

  useEffect(() => {
    const id = searchParams.get('id');
    const hash = searchParams.get('hash');

    if (!id || !hash) {
      setStatus('error');
      return;
    }

    const verifyEmail = () => {
      // Gọi trực tiếp đến URL backend để backend xử lý và redirect lại
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      window.location.href = `${backendUrl}/auth/email/verify/${id}/${hash}`;
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
        {status === 'verifying' && (
          <>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Đang xác thực Email...</h2>
            <p className="mt-2 text-sm text-gray-600">Vui lòng chờ trong giây lát.</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Xác thực thành công!</h2>
            <p className="mt-2 text-sm text-gray-600">Email của bạn đã được xác nhận. Đang chuyển hướng đến trang đăng nhập...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Xác thực thất bại</h2>
            <p className="mt-2 text-sm text-gray-600">Đường link xác thực không hợp lệ hoặc đã hết hạn.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Quay lại đăng nhập
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
