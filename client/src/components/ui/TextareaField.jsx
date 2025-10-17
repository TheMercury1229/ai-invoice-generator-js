export const TextareaField = ({ icon: Icon, label, name, ...props }) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="size-5 text-slate-400" />
          </div>
        )}
        <textarea
          {...props}
          name={name}
          rows={3}
          id={name}
          className={`w-full min-h-[200px] h-[200px] max-h-[500px] pl-3 py-2 border border-slate-200 rounded-lg resize-y bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            Icon ? "pr-10" : "pr-3"
          }`}
        />
      </div>
    </div>
  );
};
