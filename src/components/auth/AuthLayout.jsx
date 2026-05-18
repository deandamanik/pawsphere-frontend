import AuthFeatures from './AuthFeatures';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row flex-1 items-center justify-center md:justify-between max-w-6xl mx-auto w-full px-4 sm:px-8 pb-12 pt-4 gap-10 md:gap-12">
      <AuthFeatures />
      <div className="w-full max-w-md flex justify-center md:justify-end">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;