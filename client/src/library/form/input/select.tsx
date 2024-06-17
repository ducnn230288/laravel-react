import React, { useEffect, useState } from 'react';
import { type FormInstance, Select } from 'antd';

import type { ITableGet, ITableItemFilterList } from '@/types';
import { arrayUnique, cleanObjectKeyNull } from '@/utils';

const Component = ({
  form,
  value,
  showSearch = true,
  maxTagCount,
  onChange,
  onBlur,
  placeholder,
  disabled,
  get,
  list,
  mode,
  firstLoad,
  className = '',
  allowClear = true,
}: Type) => {
  const [temp, setTemp] = useState<{ current: any[]; list: any[] }>({ current: [], list: list || [] });
  const facade = get?.facade() || {};
  const data = (get?.key ? facade[get?.key] : facade.result?.data)
    ?.map((e: any) => (get?.format ? get.format(e) : e))
    .filter((item: any) => !!item.value);
  let __list = data ?? temp.list;

  const loadData = async (fullTextSearch: string) => {
    if (get) {
      const { time, queryParams } = facade;
      const params = cleanObjectKeyNull(
        get.params ? get.params(fullTextSearch, form?.getFieldValue) : { fullTextSearch },
      );
      if (
        !(get?.key ? facade[get?.key] : facade.result?.data) ||
        new Date().getTime() > time ||
        JSON.stringify(params) != queryParams
      )
        facade[get.method ?? 'get'](params);
    } else if (list) {
      setTemp(pre => ({
        ...pre,
        list: list.filter(
          (item: any) =>
            !item?.label?.toUpperCase || item?.label?.toUpperCase().indexOf(fullTextSearch.toUpperCase()) > -1,
        ),
      }));
    }
  };
  useEffect(() => {
    if (firstLoad) {
      facade[get?.method ?? 'get'](firstLoad(value));
    }
  }, []);

  useEffect(() => {
    if (get?.data) {
      let data = get.data();
      if (get?.format && data) {
        data = mode === 'multiple' ? data.map(get.format) : [get.format(data)];
        if (JSON.stringify(data) !== JSON.stringify(temp.current)) setTemp(pre => ({ ...pre, current: data }));
      }
    }
  }, [get?.data]);
  if (temp.current.length) __list = __list?.length ? arrayUnique([...temp.current, ...__list], 'value') : temp.current;

  return (
    <Select
      maxTagCount={maxTagCount}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      listHeight={200}
      filterOption={false}
      showSearch={showSearch}
      loading={(facade.result && facade?.isLoading) || false}
      allowClear={allowClear}
      onSearch={showSearch ? value => loadData(value) : undefined}
      value={value}
      maxTagPlaceholder={array => '+' + array.length}
      mode={mode}
      optionFilterProp='label'
      onBlur={onBlur}
      onDropdownVisibleChange={open => open && !!facade?.isLoading && loadData('')}
      className={className}
    >
      {__list?.map((item: any, index: number) => (
        <Select.Option key={`${item.value}${index}`} value={item.value} disabled={item.disabled}>
          <span dangerouslySetInnerHTML={{ __html: item.label }} />
        </Select.Option>
      ))}
    </Select>
  );
};
interface Type {
  form?: FormInstance;
  value?: any;
  showSearch?: boolean;
  maxTagCount?: number | 'responsive';
  onChange: (e: any) => any;
  onBlur?: (e: any) => any;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  get?: ITableGet;
  list?: ITableItemFilterList[];
  mode?: 'multiple' | 'tags';
  firstLoad?: (data: any) => any;
  allowClear?: boolean;
}
export default Component;
