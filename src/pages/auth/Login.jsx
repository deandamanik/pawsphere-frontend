import AuthLayout from '../../components/auth/AuthLayout';
import AuthToggle from '../../components/auth/AuthToggle';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-brand-blue-light font-poppins flex flex-col">
      <AuthToggle activePage="login" />
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </div>
  );
};

export default Login;