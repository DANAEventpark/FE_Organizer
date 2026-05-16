import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { registerApi } from '../api/auth';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!form.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Name (Organization Name) validation
    if (!form.name) {
      newErrors.name = 'Vui lòng nhập tên tổ chức';
    } else if (form.name.length < 2) {
      newErrors.name = 'Tên tối thiểu 2 ký tự';
    }

    // Phone validation
    if (!form.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (form.password.length < 8) {
      newErrors.password = 'Mật khẩu tối thiểu 8 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);
    try {
      await registerApi({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.password,
        role: 'organizer', // hardcode organizer
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* LEFT COLUMN - FORM (50% on desktop) */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center px-6 py-10 sm:px-16 lg:px-24 bg-white order-2 lg:order-1">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <span className="text-[#2E6E7E] font-semibold text-xl">Event</span>
            <span className="text-[#C0442B] font-semibold text-xl">Spark</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Tạo tài khoản</h1>
            <p className="text-sm text-gray-600 mt-2">
              Đăng ký với tư cách <span className="text-[#2E6E7E] font-medium">nhà tổ chức</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Tham gia cộng đồng EventSpark ngay hôm nay</p>
          </div>

          {apiError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
              {apiError}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-300 text-green-700 text-sm rounded-lg">
              Đăng ký thành công! Đang chuyển hướng...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                placeholder="ten@gmail.com"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-[#2E6E7E] focus:border-transparent outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-100'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Tên tổ chức Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên tổ chức</label>
              <input
                name="name"
                type="text"
                placeholder="Tên doanh nghiệp / Tổ chức"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-[#2E6E7E] focus:border-transparent outline-none transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-100'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Số điện thoại Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
              <input
                name="phone"
                type="tel"
                placeholder="09xxxxxxxx"
                value={form.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-[#2E6E7E] focus:border-transparent outline-none transition-all ${
                  errors.phone ? 'border-red-500' : 'border-gray-100'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Mật khẩu Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-[#2E6E7E] focus:border-transparent outline-none transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C0442B]"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C0442B] hover:bg-red-700 text-white font-medium py-3 rounded-xl mt-6 transition-all disabled:opacity-70 flex items-center justify-center shadow-lg shadow-red-500/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">Bạn đã có tài khoản? </span>
            <Link to="/login" className="text-blue-500 font-medium hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - IMAGE (50% on desktop) */}
      <div className="w-full h-[40vh] lg:h-auto lg:w-[50%] relative flex flex-col p-6 lg:p-12 order-1 lg:order-2 shrink-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/bg-register.jpg')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col h-full text-white">
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold">
              DANA<span className="text-[#FFC107]">EventSpark</span>
            </h1>
          </div>

          <div className="mt-auto pb-4 lg:pb-12">
            <h2 className="text-2xl lg:text-4xl font-bold mb-3 leading-tight">
              Quản lý sự kiện chuyên nghiệp
            </h2>
            <p className="text-sm lg:text-base text-gray-200 mb-6 max-w-md">
              Công cụ mạnh mẽ giúp bạn tổ chức, quảng bá và theo dõi hiệu quả sự kiện tại Đà Nẵng
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 rounded-full bg-yellow-500/80 text-white text-xs lg:text-sm font-medium backdrop-blur-sm border border-yellow-400/50">
                Quản lý tinh gọn
              </span>
              <span className="px-4 py-1.5 rounded-full bg-yellow-500/80 text-white text-xs lg:text-sm font-medium backdrop-blur-sm border border-yellow-400/50">
                Tiếp cận hàng nghìn người
              </span>
              <span className="px-4 py-1.5 rounded-full bg-yellow-500/80 text-white text-xs lg:text-sm font-medium backdrop-blur-sm border border-yellow-400/50">
                Thống kê thời gian thực
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
