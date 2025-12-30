import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { axiosInstance, setAccessToken } from '../../shared/lib/axiosInstance';

export default function SignOutPage({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      try {
        await axiosInstance.delete('/auth/signOut');
      } catch (error) {
        console.log(error);
      } finally {
        setAccessToken('');
        setUser(null);
        navigate('/');
      }
    };
    
    signOut()
  }, [setUser, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Выполняется выход из аккаунта...</p>
      </div>
    </div>
  );
}
