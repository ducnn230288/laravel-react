import React, { MouseEventHandler } from 'react';
import classNames from 'classnames';

import { Spinner } from '@/assets/svg';

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
      type="button"
      disabled={disabled}
      title={title ?? text ?? ''}
      className={classNames('btn', className, {
        'btn-md': !isTiny,
        'btn-xs': isTiny,
        'btn-primary': !className,
      })}
      {...props}
    >
      {!isLoading ? icon : <Spinner className={'size-3 animate-spin'} />}
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
