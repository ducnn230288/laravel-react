import classNames from 'classnames';
import React, { type MouseEventHandler } from 'react';

import { CSvgIcon } from '../svg-icon';

export const CButton = ({
  text = '',
  icon,
  title,
  className,
  disabled,
  isLoading = false,
  isTiny = false,
  ...props
}: Type) => {
  className = classNames('btn', className, {
    'h-10 px-3': !isTiny,
    'h-6 px-2': isTiny,
  });
  const renderLoading = () => (!isLoading ? icon : <CSvgIcon name='spinner' size={12} />);
  return (
    <button type='button' disabled={disabled} title={title ?? text ?? ''} className={className} {...props}>
      {renderLoading()}
      {text}
    </button>
  );
};

interface Type {
  text?: any;
  isTiny?: boolean;
  icon?: React.ReactNode;
  title?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onPaste?: (event: any) => Promise<void>;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
}
