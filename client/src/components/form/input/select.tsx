import { Select, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';

import type { ITableGet, ITableItemFilterList } from '@/types';
import { API, KEY_TEMP, arrayUnique, cleanObjectKeyNull, routerLinks } from '@/utils';

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
  list = [],
  mode,
  className = '',
  allowClear = true,
}: Type) => {
  const _local = localStorage.getItem(KEY_TEMP);
  const _temp = _local ? JSON.parse(_local) : {};
  const [temp, setTemp] = useState<{ current: any[]; list: any[]; isLoading: boolean }>({
    current: [],
    list:
      !get?.keyApi || !_temp['select-' + get.keyApi]
        ? list
        : _temp['select-' + get.keyApi].data
            .map((e: any) => (get?.format ? get.format(e) : e))
            .filter((item: any) => !!item.value),
    isLoading: false,
  });

  const loadData = async (fullTextSearch: string) => {
    if (get?.keyApi) {
      const params = cleanObjectKeyNull(
        get.params ? get.params(fullTextSearch, form?.getFieldValue) : { fullTextSearch },
      );
      const obj = _temp['select-' + get.keyApi];
      if (!obj || (obj && (new Date().getTime() > obj.time || JSON.stringify(params) != obj.queryParams)))
        try {
          setTemp(pre => ({ ...pre, isLoading: true }));
          _temp['select-' + get.keyApi] = {
            time: new Date().getTime() + (get.keepUnusedDataFor ?? 60) * 1000,
            queryParams: JSON.stringify(params),
            data: [],
          };
          const data: any = await API.get({ url: `${routerLinks(get.keyApi, 'api')}`, params });
          setTemp(pre => ({
            ...pre,
            list: data.data.map((e: any) => (get?.format ? get.format(e) : e)).filter((item: any) => !!item.value),
            isLoading: false,
          }));
          _temp['select-' + get.keyApi].data = data.data;
          localStorage.setItem(KEY_TEMP, JSON.stringify(_temp));
        } catch (e) {}
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
    if (get?.data) {
      let data = get.data();
      if (get?.format && data) {
        data = mode === 'multiple' ? data.map(get.format) : [get.format(data)];
        if (JSON.stringify(data) !== JSON.stringify(temp.current)) setTemp(pre => ({ ...pre, current: data }));
      }
    }
  }, [get?.data]);

  let __list = temp.list;
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
      loading={temp.isLoading}
      allowClear={allowClear}
      onSearch={showSearch ? value => loadData(value) : undefined}
      value={value}
      maxTagPlaceholder={array => '+' + array.length}
      mode={mode}
      optionFilterProp='label'
      onBlur={onBlur}
      onDropdownVisibleChange={open => open && !temp.isLoading && loadData('')}
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
  allowClear?: boolean;
}
export default Component;
