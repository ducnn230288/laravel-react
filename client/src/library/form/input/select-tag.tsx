import React, { useState, useEffect, useCallback } from 'react';
import { type FormInstance, Select } from 'antd';

import { Times } from '@/assets/svg';
import { API } from '@/utils';

import { Button } from '../../button';
import { Avatar } from '../../avatar';

const Component = ({ tag, onChange, form, value, disabled, maxTagCount, placeholder, ...prop }: Type) => {
  const [_options, set_options] = useState([]);
  const loadData = useCallback(
    async (fullTextSearch = '', value?: any) => {
      if (tag) {
        const params = tag.params
          ? tag.params(form.getFieldValue, fullTextSearch, value && value.filter((item: any) => !!item))
          : { fullTextSearch };
        const { data } = await API.get<any>({ url: tag.api, params });
        set_options(
          data?.data?.map((item: any, index: number) => ({
            label: tag.avatar ? (
              <Avatar key={index} size={5} src={item[tag.avatar]} text={item[tag.label]} />
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
      showArrow
      filterOption={false}
      maxTagPlaceholder={array => '+' + array.length}
      tagRender={({ label, onClose }) => (
        <div className='relative -left-2.5 mr-2.5 rounded-xl bg-teal-100 px-2 py-1'>
          <Button
            icon={<Times className='size-5 fill-red-600' />}
            className='absolute -right-2 -top-1 z-auto rounded-full !bg-red-100 leading-none !text-red-600'
            onClick={onClose}
            disabled={disabled}
          />
          {label}
        </div>
      )}
      onChange={value => {
        onChange && onChange(value);
        loadData('', value);
      }}
      style={{ width: '100%' }}
      options={_options}
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
