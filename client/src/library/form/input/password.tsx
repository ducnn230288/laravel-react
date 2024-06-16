import React, { useState } from 'react';
import { SvgIcon } from '../../svg-icon';

const Component = ({
  value = '',
  placeholder,
  disabled,
  onChange,
}: {
  value?: string;
  placeholder: string;
  disabled?: boolean;
  onChange?: (e: any) => any;
}) => {
  const [toggle, setToggle] = useState(true);

  return (
    <div className='relative'>
      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        type={toggle ? 'password' : 'text'}
        className='ant-input pr-9'
        onChange={onChange}
      />
      {!toggle && <SvgIcon name='eye' onClick={() => setToggle(!toggle)} className='icon' />}
      {toggle && <SvgIcon name='eye-slash' onClick={() => setToggle(!toggle)} className='icon' />}
    </div>
  );
};
export default Component;
