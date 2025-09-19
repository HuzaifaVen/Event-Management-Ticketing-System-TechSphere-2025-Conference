import React from 'react';

interface InputProps {
  placeholder: string;
  label: string;
  value: string;
  onChange: (value: string) => void; 
  className?: string;
  inputClass?: string;
  width?: number | string;
  height?: number | string;
  type?: string; 
}

const InputBar: React.FC<InputProps> = ({
  placeholder,
  label,
  value,
  onChange,
  className = '',
  inputClass = "",
  width = '100%',
  height = 40,
  type = 'text',
}) => {
  return (
    <div className={`flex flex-col ${className}`} style={{ width }}>
      {label && <label className="mb-1 text-sm font-medium">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
        style={{ width, height }}
      />
    </div>
  );
};

export default InputBar;
