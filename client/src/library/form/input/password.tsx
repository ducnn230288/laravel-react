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
        className="ant-input h-12 w-full rounded-btn border border-solid bg-base-100 py-2 pl-4 pr-9 text-base-content"
      />
      {!toggle && (
        <Eye onClick={() => set_toggle(!toggle)} className="absolute right-3 top-3.5 z-10 size-5 fill-base-content" />
      )}
      {toggle && (
        <EyeSlash
          onClick={() => set_toggle(!toggle)}
          className="absolute right-3 top-3.5 z-10 size-5 fill-base-content"
        />
      )}
    </div>
  );
};
export default Component;
