import { Dropdown, type FormInstance } from 'antd';
import { useRef, useState } from 'react';

import type { ITableGet, ITableRefObject } from '@/types';
import { API, KEY_TEMP, arrayUnique, cleanObjectKeyNull, routerLinks } from '@/utils';
import { CDataTable } from '../../data-table';
import Mask from './mask';

const Component = ({ form, mode, onChange, placeholder, disabled, get }: Type) => {
  const onBlur = () => {
    setTimeout(() => setTemp(previousState => ({ ...previousState, isOpen: false })), 200);
  };
  const onFocus = () => loadData('');

  let _data: any[] = [];
  if (get?.data()) {
    _data = mode === 'multiple' ? get.data() : [get.data()];
  }
  const _local = localStorage.getItem(KEY_TEMP);
  const _temp = _local ? JSON.parse(_local) : {};
  const [temp, setTemp] = useState<{ current: any[]; list: any[]; isLoading: boolean; isOpen: boolean }>({
    current: _data,
    isOpen: false,
    list: !get?.keyApi || !_temp['select-table-' + get.keyApi] ? [] : _temp['select-table-' + get.keyApi].data,
    isLoading: false,
  });

  const loadData = async (fullTextSearch: string) => {
    if (get?.keyApi) {
      const params = cleanObjectKeyNull(
        get.params ? get.params(fullTextSearch, form?.getFieldValue) : { fullTextSearch },
      );
      const obj = _temp['select-table-' + get.keyApi];
      if (!obj || (obj && (new Date().getTime() > obj.time || JSON.stringify(params) != obj.queryParams))) {
        try {
          setTemp(pre => ({ ...pre, isOpen: true, isLoading: true }));
          _temp['select-table-' + get.keyApi] = {
            time: new Date().getTime() + (get.keepUnusedDataFor ?? 60) * 1000,
            queryParams: JSON.stringify(params),
            data: [],
          };
          const data: any = await API.get({ url: `${routerLinks(get.keyApi, 'api')}`, params });
          setTemp(pre => ({
            ...pre,
            list: data.data,
            isLoading: false,
          }));
          _temp['select-table-' + get.keyApi].data = data.data;
          localStorage.setItem(KEY_TEMP, JSON.stringify(_temp));
        } catch (e) {}
      } else setTemp(pre => ({ ...pre, isOpen: true }));
    }
  };

  const table = useRef<ITableRefObject>(null);
  const input = useRef<{ input: HTMLInputElement }>(null);
  const handleRow = e => ({
    onClick: () => {
      if (get?.format) {
        const { label, value } = get.format(e);
        onChange(value);
        if (input.current?.input && typeof label === 'string') {
          input.current.input.value = label;
        }
      }
    },
  });
  const renderDropdown = () => (
    <div className={'overflow-hidden bg-base-100 rounded-lg drop-shadow-lg'}>
      <CDataTable
        formatData={data => arrayUnique([...temp.current, ...data], 'id')}
        ref={table}
        data={temp.list}
        defaultRequest={{ page: 1, perPage: 10 }}
        save={false}
        showSearch={false}
        showPagination={false}
        isLoading={temp.isLoading}
        onRow={handleRow}
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
      {!temp.isOpen ? (
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
      open={temp.isOpen}
      placement='bottom'
      dropdownRender={renderDropdown}
    >
      <div>
        <Mask
          value={temp.list.length > 0 ? temp.list[0].label?.toString() : undefined}
          ref={input}
          disabled={disabled}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={e => loadData(e.target.value)}
          addonAfter={renderIcon}
        />
      </div>
    </Dropdown>
  );
};
interface Type {
  form?: FormInstance;
  mode?: 'multiple' | 'tags';
  onChange: (e: any) => any;
  placeholder: string;
  disabled?: boolean;
  get?: ITableGet;
}
export default Component;
