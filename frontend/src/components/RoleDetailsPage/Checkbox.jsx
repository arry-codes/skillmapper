import { Check } from "lucide-react";
export const Checkbox = ({ checked, onChange, id, className = "" }) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`flex items-center justify-center w-4 h-4 border-2 border-gray-300 rounded cursor-pointer transition-colors ${
          checked ? 'bg-blue-600 border-blue-600' : 'bg-white hover:border-blue-400'
        } ${className}`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </label>
    </div>
  );
};