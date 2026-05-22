import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginApi, loginWithGoogleApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginApi({ email, password });
      const { user, token } = response.data.data;
      
      const roleName = typeof user.role === 'object' ? user.role?.name : user.role;
      if (roleName !== 'organizer') {
        setError('Tài khoản không có quyền truy cập nhà tổ chức.');
        setLoading(false);
        return;
      }

      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const payload = {
        name: user.displayName,
        email: user.email,
        google_id: user.uid,
        avatar: user.photoURL,
      };

      const response = await loginWithGoogleApi(payload);
      const { user: dbUser, token } = response.data.data;

      const roleName = typeof dbUser.role === 'object' ? dbUser.role?.name : dbUser.role;
      if (roleName !== 'organizer') {
        setError('Tài khoản không có quyền truy cập nhà tổ chức.');
        setLoading(false);
        return;
      }

      login(dbUser, token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập bằng Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Top/Left Column - Background Image with Overlay Content */}
      <div className="w-full h-[45vh] lg:h-auto lg:w-[45%] relative flex flex-col p-6 lg:p-12 shrink-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/bg-login.jpg')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content on top of image */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-bold font-serif text-white">
              DANA<span className="text-[#FFC107]">EventSpark</span>
            </h1>
          </div>

          {/* Texts and Badges */}
          <div className="mt-auto pb-2 lg:pb-8">
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 leading-tight">
              Quản lý sự kiện Đà Nẵng dễ dàng
            </h2>
            <p className="text-sm lg:text-base text-gray-200 mb-6 max-w-md">
              Công cụ mạnh mẽ để tạo, quản lý và theo dõi sự kiện của bạn hiệu quả
            </p>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <span className="px-4 py-1.5 rounded-full bg-yellow-500/80 text-white text-xs lg:text-sm font-medium backdrop-blur-sm border border-yellow-400/50">
                Tạo sự kiện nhanh
              </span>
              <span className="px-4 py-1.5 rounded-full bg-yellow-500/80 text-white text-xs lg:text-sm font-medium backdrop-blur-sm border border-yellow-400/50">
                Thống kê chi tiết
              </span>
              <span className="px-4 py-1.5 rounded-full bg-yellow-500/80 text-white text-xs lg:text-sm font-medium backdrop-blur-sm border border-yellow-400/50">
                Hỗ trợ 24/7
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom/Right Column - Form */}
      <div className="w-full lg:w-[55%] flex-1 flex flex-col justify-center px-6 py-10 sm:px-16 lg:px-24 bg-white z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Headings */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Chào mừng trở lại</h2>
            <p className="text-sm text-gray-500 mt-2">
              Đăng nhập với tư cách <span className="text-green-600 font-medium">Nhà tổ chức</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@gmail.com"
                className="w-full border border-gray-100 bg-gray-50/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E53E3E] focus:border-transparent outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  className="w-full border border-gray-100 bg-gray-50/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E53E3E] focus:border-transparent outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E53E3E] hover:text-red-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#E53E3E] focus:ring-[#E53E3E]" />
                <span className="text-sm text-gray-500">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-sm text-green-600 hover:underline">Quên mật khẩu ?</a>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E53E3E] hover:bg-red-600 text-white py-3 rounded-xl font-medium mt-6 transition-colors disabled:opacity-70 flex justify-center items-center shadow-lg shadow-red-500/30"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Đăng nhập
            </button>
            
            <div className="mt-4 flex items-center justify-center">
              <span className="h-px bg-gray-200 flex-1"></span>
              <span className="px-4 text-sm text-gray-500">Hoặc</span>
              <span className="h-px bg-gray-200 flex-1"></span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium mt-4 transition-colors disabled:opacity-70 flex justify-center items-center shadow-sm"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Đăng nhập bằng Google
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-500 font-medium hover:underline">
              Đăng ký ngay
            </Link>

          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
