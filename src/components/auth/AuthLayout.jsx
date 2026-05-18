import AuthFeatures from './AuthFeatures';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-1 items-center justify-between max-w-6xl mx-auto w-full px-8 pb-8 pt-4 gap-12">
      <AuthFeatures />
      {children}
    </div>
  );
};

export default AuthLayout;