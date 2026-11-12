import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-brand-blue-light font-poppins flex flex-col">
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </div>
  );
};

export default Login;