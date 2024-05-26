import React, { MouseEventHandler } from 'react';
import classNames from 'classnames';

import { Spinner } from '@/assets/svg';

export const Button = ({ text = '', icon, title, className, disabled, isLoading = false, ...props }: Type) => {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title ?? text ?? ''}
      className={classNames(
        'button',
        {
          icon: !!icon && !text,
        },
        className,
      )}
      {...props}
    >
      {!isLoading ? icon : <Spinner className={'animate-spin h-5 w-5'} />}
      {text}
    </button>
  );
};

interface Type {
  text?: any;
  icon?: React.ReactNode;
  title?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onPaste?: any;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
}
