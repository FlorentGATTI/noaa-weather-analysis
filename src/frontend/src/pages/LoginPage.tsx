import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '../features/auth/AuthProvider';
import authApi from '../api/authApi';
import type { LoginCredentials } from '../features/auth/types';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (credentials: LoginCredentials) => {
    const { data } = await authApi.login(credentials);
    login(data.access_token, data.refresh_token, data.user);

    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
