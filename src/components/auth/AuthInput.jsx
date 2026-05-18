const AuthInput = ({ label, type = 'text', name, value, onChange, placeholder, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-brand-blue-normal">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-brand-blue-light border border-brand-blue-normal/30
                  text-brand-blue-normal placeholder:text-brand-blue-normal/40
                  focus:outline-none focus:border-brand-blue-normal text-sm transition-colors"
        {...props}
      />
    </div>
  );
};

export default AuthInput;