import React, { forwardRef, Fragment, type Ref, useEffect, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';
import type { FormInstance } from 'antd';

import type { ITableItemFilterList } from '@/interfaces';
import { Button } from '../../button';

const Component = forwardRef(
  (
    {
      id,
      mask,
      value,
      addonBefore,
      addonAfter,
      form,
      disabled,
      placeholder,
      onBlur,
      onFocus,
      onChange,
      onPressEnter,
      list,
      autoFocus = false,
    }: Type,
    ref: Ref<{ input: HTMLInputElement }>,
  ) => {
    useImperativeHandle(ref, () => ({
      input: input.current!,
    }));
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setTimeout(() => !!mask && !!input.current && Inputmask(mask).mask(input.current));
    }, []);

    const getCursorPosition = (el: HTMLInputElement) => {
      if (!el) return 0;
      if ('selectionStart' in el) {
        return el.selectionStart ?? 0;
      }
      return 0;
    };

    const setCaretPosition = (input: HTMLInputElement, selectionStart: number, selectionEnd: number) => {
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
      }
    };

    return (
      <Fragment>
        <div className={'relative'}>
          {!!addonBefore && <span className='before'>{addonBefore(form)}</span>}
          <input
            id={id}
            ref={input}
            className={classNames('ant-input', {
              before: !!addonBefore,
              after: !!addonAfter,
              disabled: disabled,
            })}
            autoFocus={autoFocus}
            readOnly={disabled}
            defaultValue={value}
            placeholder={placeholder}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            onKeyUp={e => e.keyCode === 13 && onPressEnter && onPressEnter(e)}
          />
          {!!addonAfter && <span className='after'>{addonAfter(form)}</span>}
        </div>
        {list && (
          <div className={'mt-2 flex flex-wrap gap-2'}>
            {list.map((item, index) => (
              <Button
                key={item.value!.toString() + index}
                text={item.label}
                onClick={() => {
                  if (item.value) {
                    const value = input.current?.value ?? '';
                    const position = getCursorPosition(input.current!);
                    input.current!.value = value.slice(0, position) + item.value + value.slice(position);
                    if (onChange) onChange({ target: input.current });
                    setCaretPosition(
                      input.current!,
                      position + item.value.toString().length,
                      position + item.value.toString().length,
                    );
                  }
                }}
              />
            ))}
          </div>
        )}
      </Fragment>
    );
  },
);
Component.displayName = 'Mask Input';
interface Type {
  id?: string;
  mask?: any;
  value?: string;
  addonBefore?: (form?: FormInstance) => JSX.Element;
  addonAfter?: (form?: FormInstance) => JSX.Element;
  form?: FormInstance;
  disabled?: boolean;
  placeholder: string;
  onBlur?: (e: any) => any;
  onFocus?: (e: any) => any;
  onChange?: (e: any) => any;
  onPressEnter?: (e: any) => any;
  list?: ITableItemFilterList[];
  autoFocus?: boolean;
}
export default Component;
