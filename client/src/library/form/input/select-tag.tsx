import React, { useState, useEffect, useCallback } from 'react';
import { type FormInstance, Select } from 'antd';

import { API } from '@/utils';
import { CAvatar } from '../../avatar';
import { CButton } from '../../button';
import { CSvgIcon } from '../../svg-icon';

const Component = ({ tag, onChange, form, value, disabled, maxTagCount, placeholder, ...prop }: Type) => {
  const [options, setOptions] = useState([]);
  const loadData = useCallback(
    async (fullTextSearch = '', value?: any) => {
      if (tag) {
        const params = tag.params
          ? tag.params(form.getFieldValue, fullTextSearch, value && value.filter((item: any) => !!item))
          : { fullTextSearch };
        const { data } = await API.get<any>({ url: tag.api, params });
        setOptions(
          data?.data?.map((item: any, index: number) => ({
            label: tag.avatar ? (
              <CAvatar key={'avatar' + index} size={5} src={item[tag.avatar]} text={item[tag.label]} />
            ) : (
              item[tag.label]
            ),
            value: item[tag.value],
            avatar: item[tag.avatar],
          })),
        );
      }
    },
    [tag, form.getFieldValue],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Select
      disabled={disabled}
      maxTagCount={maxTagCount}
      placeholder={placeholder}
      {...prop}
      listHeight={200}
      value={value || []}
      onSearch={fullTextSearch => loadData(fullTextSearch, value)}
      onBlur={() => loadData()}
      mode='multiple'
      optionFilterProp='label'
      filterOption={false}
      maxTagPlaceholder={array => '+' + array.length}
      tagRender={({ label, onClose }) => (
        <div className='relative -left-2.5 mr-2.5 rounded-xl bg-teal-100 px-2 py-1'>
          <CButton
            icon={<CSvgIcon name='times' size={20} className='fill-error' />}
            className='absolute -right-2 -top-1 z-auto rounded-full !bg-error/20 leading-none !text-error'
            onClick={onClose}
            disabled={disabled}
          />
          {label}
        </div>
      )}
      onChange={value => {
        onChange?.(value);
        loadData('', value);
      }}
      style={{ width: '100%' }}
      options={options}
    />
  );
};
interface Type {
  tag?: {
    avatar: string;
    label: string;
    value: string;
    params: (getFieldValue: any, fullTextSearch: string, value: any) => any;
    api: string;
  };
  onChange?: (e: any) => any;
  form: FormInstance;
  value?: any;
  disabled?: boolean;
  maxTagCount: number | 'responsive';
  placeholder: string;
}
export default Component;
