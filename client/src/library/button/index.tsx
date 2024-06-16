import React, { type MouseEventHandler } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '../svg-icon';

export const Button = ({
  text = '',
  icon,
  title,
  className,
  disabled,
  isLoading = false,
  isTiny = false,
  ...props
}: Type) => {
  return (
    <button
      type='button'
      disabled={disabled}
      title={title ?? text ?? ''}
      className={classNames('btn', className, {
        'btn-md': !isTiny,
        'btn-xs': isTiny,
        'btn-primary': !className,
      })}
      {...props}
    >
      {!isLoading ? icon : <SvgIcon name='spinner' size={12} />}
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
