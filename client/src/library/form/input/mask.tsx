import React, { forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';
import { FormInstance } from 'antd';

import { ITableItemFilterList } from '@/interfaces';
import { Button } from '../../button';

const Component = forwardRef(
  (
    {
      id,
      className = 'h-12',
      mask,
      value,
      addonBefore,
      addonAfter,
      form,
      disabled,
      maxLength,
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
      // if (el && document.selection) {
      //   el.focus();
      //   const sel = document.selection.createRange();
      //   const selLen = document.selection.createRange().text.length;
      //   sel.moveStart('character', -el.value.length);
      //   return sel.text.length - selLen;
      // }
      return 0;
    };

    const setCaretPosition = (input: HTMLInputElement, selectionStart: number, selectionEnd: number) => {
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
      }
      // else if (input.createTextRange) {
      //   const range = input.createTextRange();
      //   range.collapse(true);
      //   range.moveEnd('character', selectionEnd);
      //   range.moveStart('character', selectionStart);
      //   range.select();
      // }
    };

    return (
      <Fragment>
        <div
          className={classNames('', {
            'ant-input flex items-center border rounded-btn': !!addonBefore || !!addonAfter,
          })}
        >
          {!!addonBefore && <div>{addonBefore(form)}</div>}
          <input
            id={id}
            ref={input}
            className={classNames(
              'w-full text-base-content bg-base-100 px-4 ',
              {
                'ant-input': !addonBefore && !addonAfter,
                'border rounded-btn': !addonBefore && !addonAfter,
                'rounded-l-btn border-r': !addonBefore && !!addonAfter,
                'rounded-r-btn border-l': !!addonBefore && !addonAfter,
                'border-r border-l': !!addonBefore && !!addonAfter,
                'border-none focus:shadow-none text-base-300': disabled,
              },
              className,
            )}
            autoFocus={autoFocus}
            readOnly={disabled}
            defaultValue={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            onKeyUp={(e) => e.keyCode === 13 && onPressEnter && onPressEnter(e)}
          />
          {!!addonAfter && <div>{addonAfter(form)}</div>}
        </div>
        {list && (
          <div className={'mt-2 flex flex-wrap gap-2'}>
            {list.map((item, index) => (
              <Button
                key={index}
                text={item.label}
                onClick={() => {
                  if (item.value) {
                    const value = input.current?.value ?? '';
                    const position = getCursorPosition(input.current!);
                    input.current!.value = value.slice(0, position) + item.value + value.slice(position);
                    onChange && onChange({ target: input.current });
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
  className?: string;
  mask?: any;
  value?: string;
  addonBefore?: (form?: FormInstance) => JSX.Element;
  addonAfter?: (form?: FormInstance) => JSX.Element;
  form?: FormInstance;
  disabled?: boolean;
  maxLength?: number;
  placeholder: string;
  onBlur?: (e: any) => any;
  onFocus?: (e: any) => any;
  onChange?: (e: any) => any;
  onPressEnter?: (e: any) => any;
  list?: ITableItemFilterList[];
  autoFocus?: boolean;
}
export default Component;
