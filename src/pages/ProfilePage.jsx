import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateProfileInfoApi, updatePasswordApi } from '../api/profile';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Lock, Camera, Loader2, Save } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('info');
  
  // Info Form
  const [infoForm, setInfoForm] = useState({ name: user?.name || '', phone: user?.phone || '', avatar: user?.avatar || '' });
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ type: '', text: '' });
  
  // Upload Image
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  
  // Password Form
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setInfoLoading(true);
    setInfoMessage({ type: '', text: '' });
    
    try {
      let avatarUrl = infoForm.avatar;
      
      if (imageFile) {
        const fileRef = ref(storage, `avatars/${user.id}_${Date.now()}`);
        await uploadBytes(fileRef, imageFile);
        avatarUrl = await getDownloadURL(fileRef);
      }
      
      const payload = {
        name: infoForm.name,
        phone: infoForm.phone,
        avatar: avatarUrl
      };
      
      const res = await updateProfileInfoApi(payload);
      const updatedUser = res.data.data.user;
      setUser(updatedUser); 
      
      setInfoMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      setInfoForm({ name: updatedUser.name, phone: updatedUser.phone, avatar: updatedUser.avatar });
      setImageFile(null);
    } catch (error) {
      setInfoMessage({ type: 'error', text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.' });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassMessage({ type: '', text: '' });

    try {
      await updatePasswordApi(passForm);
      setPassMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPassForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (error) {
      setPassMessage({ type: 'error', text: error.response?.data?.message || 'Có lỗi xảy ra.' });
    } finally {
      setPassLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row max-w-5xl">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                activeTab === 'info' ? 'bg-[#e96a52] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User size={20} />
              Thông tin chung
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                activeTab === 'password' ? 'bg-[#e96a52] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Lock size={20} />
              Đổi mật khẩu
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            {activeTab === 'info' && (
              <form onSubmit={handleUpdateInfo} className="max-w-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin chung</h2>
                
                {infoMessage.text && (
                  <div className={`p-4 rounded-xl mb-6 ${infoMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {infoMessage.text}
                  </div>
                )}

                {/* Avatar Section */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Ảnh đại diện</label>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-lg">
                        {preview ? (
                          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={40} />
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                        <Camera size={16} className="text-gray-600" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                    <div className="text-sm text-gray-500">
                      Định dạng JPG, PNG hoặc GIF.<br />
                      Dung lượng tối đa 2MB.
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Tài khoản)</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={infoForm.name}
                      onChange={(e) => setInfoForm({...infoForm, name: e.target.value})}
                      className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e96a52] focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                    <input
                      type="tel"
                      value={infoForm.phone}
                      onChange={(e) => setInfoForm({...infoForm, phone: e.target.value})}
                      className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e96a52] focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={infoLoading}
                  className="mt-8 flex items-center gap-2 bg-[#173846] hover:bg-[#0f242d] text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-70"
                >
                  {infoLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Lưu thay đổi
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleUpdatePassword} className="max-w-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>
                
                {passMessage.text && (
                  <div className={`p-4 rounded-xl mb-6 ${passMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {passMessage.text}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      required
                      value={passForm.current_password}
                      onChange={(e) => setPassForm({...passForm, current_password: e.target.value})}
                      className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e96a52] focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={passForm.new_password}
                      onChange={(e) => setPassForm({...passForm, new_password: e.target.value})}
                      className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e96a52] focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={passForm.new_password_confirmation}
                      onChange={(e) => setPassForm({...passForm, new_password_confirmation: e.target.value})}
                      className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e96a52] focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="mt-8 flex items-center gap-2 bg-[#173846] hover:bg-[#0f242d] text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-70"
                >
                  {passLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                  Cập nhật mật khẩu
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
