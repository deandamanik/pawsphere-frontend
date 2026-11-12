import AuthLayout from '../../components/auth/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-brand-blue-light font-poppins flex flex-col">
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </div>
  );
};

export default Register;