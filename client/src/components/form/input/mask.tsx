import type { FormInstance } from 'antd';
import classNames from 'classnames';
import { forwardRef, Fragment, type Ref, useEffect, useImperativeHandle, useRef } from 'react';

import type { ITableItemFilterList } from '@/types';
import { CButton } from '../../button';

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

    const className = classNames('ant-input', {
      before: !!addonBefore,
      after: !!addonAfter,
      disabled: disabled,
    });
    const handleClick = item => {
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
    };

    const renderButton = () =>
      list && (
        <div className={'mt-2 flex flex-wrap gap-2'}>
          {list.map((item, index) => (
            <CButton key={item.value!.toString() + index} text={item.label} onClick={() => handleClick(item)} />
          ))}
        </div>
      );

    return (
      <Fragment>
        <div className={'relative'}>
          {!!addonBefore && <span className='before'>{addonBefore(form)}</span>}
          <input
            id={id}
            ref={input}
            className={className}
            readOnly={disabled}
            defaultValue={value}
            placeholder={placeholder}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            onKeyUp={e => e.key === 'Enter' && onPressEnter?.(e)}
          />
          {!!addonAfter && <span className='after'>{addonAfter(form)}</span>}
        </div>
        {renderButton()}
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
}
export default Component;
