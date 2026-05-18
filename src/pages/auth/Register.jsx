import AuthLayout from '../../components/auth/AuthLayout';
import AuthToggle from '../../components/auth/AuthToggle';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-brand-blue-light font-poppins flex flex-col">
      <AuthToggle activePage="register" />
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </div>
  );
};

export default Register;