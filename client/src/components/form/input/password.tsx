import { useState } from 'react';
import { CSvgIcon } from '../../svg-icon';

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
        autoComplete='on'
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        type={toggle ? 'password' : 'text'}
        className='ant-input pr-9'
        onChange={onChange}
      />
      <CSvgIcon name={toggle ? 'eye-slash' : 'eye'} onClick={() => setToggle(!toggle)} className='icon' />
    </div>
  );
};
export default Component;
