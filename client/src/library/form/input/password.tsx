import React, { useState } from 'react';
import { Eye, EyeSlash } from '@/assets/svg';

const Component = ({
  value = '',
  placeholder,
  disabled,
  ...prop
}: {
  value?: string;
  placeholder: string;
  disabled?: boolean;
}) => {
  const [toggle, set_toggle] = useState(true);

  return (
    <div className="relative">
      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        {...prop}
        type={toggle ? 'password' : 'text'}
        className="w-full h-12 rounded-btn text-base-content bg-base-100 border border-solid py-2 pr-9 pl-4 ant-input"
      />
      {!toggle && (
        <Eye
          onClick={() => set_toggle(!toggle)}
          className="absolute top-3.5 right-3 z-10 w-5 h-5 fill-base-content fill-eye"
        />
      )}
      {toggle && (
        <EyeSlash
          onClick={() => set_toggle(!toggle)}
          className="absolute top-3.5 right-3 z-10 w-5 h-5 fill-base-content fill-eye"
        />
      )}
    </div>
  );
};
export default Component;
