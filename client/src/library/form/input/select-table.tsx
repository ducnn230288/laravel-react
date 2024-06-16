import React, { useRef, useState } from 'react';
import { Dropdown } from 'antd';

import type { ITableGet, ITableRefObject } from '@/interfaces';
import { arrayUnique } from '@/utils';

import Mask from './mask';
import { CDataTable } from '../../data-table';

const Component = ({ mode, onChange, placeholder, disabled, get, value }: Type) => {
  const onBlur = () => {
    setTimeout(() => setTemp(previousState => ({ ...previousState, open: false })), 200);
  };
  const onFocus = () => {
    setTemp(previousState => ({ ...previousState, open: true }));
  };
  const facade = get?.facade() || {};

  const table = useRef<ITableRefObject>(null);
  const input = useRef<{ input: HTMLInputElement }>(null);
  let _data: any[] = [];
  if (get?.data) {
    _data = mode === 'multiple' ? get.data() : [get.data()];
  }

  const [temp, setTemp] = useState({ data: _data, open: false });
  const _list = [...temp.data, ...(facade?.result?.data || [])]
    .map(get!.format!)
    .filter((item: any) => !value || item.value === value);

  const renderDropdown = () => (
    <div className={'overflow-hidden bg-base-100 rounded-btn drop-shadow-lg'}>
      <CDataTable
        formatData={data => arrayUnique([...temp.data, ...data], 'id')}
        ref={table}
        facade={facade}
        defaultRequest={{ page: 1, perPage: 10 }}
        save={false}
        showSearch={false}
        showPagination={false}
        onRow={e => ({
          onClick: () => {
            if (get?.format) {
              const { label, value } = get.format(e);
              onChange(value);
              if (input.current?.input.value && typeof label === 'string') {
                input.current.input.value = label;
              }
            }
          },
        })}
        columns={get?.column || []}
      />
    </div>
  );

  const renderIcon = () => (
    <svg
      viewBox='64 64 896 896'
      focusable='false'
      data-icon='down'
      width='1em'
      height='1em'
      fill='currentColor'
      aria-hidden='true'
    >
      {!temp.open ? (
        <path d='M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z'></path>
      ) : (
        <path d='M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z'></path>
      )}
    </svg>
  );
  return (
    <Dropdown
      overlayStyle={{ width: '70vw' }}
      trigger={['click']}
      open={temp.open}
      placement='bottom'
      dropdownRender={renderDropdown}
    >
      <div>
        <Mask
          value={_list.length > 0 ? _list[0].label?.toString() : undefined}
          ref={input}
          disabled={disabled}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={e => table.current?.onChange({ fullTextSearch: e.target.value, page: 1, perPage: 10 })}
          addonAfter={renderIcon}
        />
      </div>
    </Dropdown>
  );
};
interface Type {
  mode?: 'multiple' | 'tags';
  onChange: (e: any) => any;
  value?: any;
  placeholder: string;
  disabled?: boolean;
  get?: ITableGet;
}
export default Component;
