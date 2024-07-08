import { Cascader, type FormInstance } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

import { API } from '@/utils';
import { CButton } from '../../button';
import { CSvgIcon } from '../../svg-icon';

const Component = ({ formItem, placeholder, onChange, value, form, disabled, showSearch = true }: Type) => {
  const [list, setList] = useState(formItem.list || []);
  const allValue = useRef<any>([]);

  const loadData = useCallback(
    async (fullTextSearch: string) => {
      if (formItem.api) {
        if (!formItem.api.condition || formItem.api.condition({ value: form.getFieldValue })) {
          const url = formItem.api.link(form.getFieldValue);
          if (url) {
            const params = formItem.api.params
              ? formItem.api.params(form.getFieldValue, fullTextSearch)
              : { fullTextSearch };
            const { data } = await API.get<any>({ url, params });
            const listData = data.data.map(formItem.api.format);
            setList(listData);
          }
        }
      } else if (formItem.renderList) {
        setList(formItem.renderList(form.getFieldValue));
      }
    },
    [form, formItem, value],
  );

  const initFunction = useCallback(async () => {
    if (
      typeof value === 'object' &&
      value.length > 0 &&
      !value?.filter((item: any) => typeof item === 'object')?.length
    ) {
      onChange?.(value.map((item: any) => ({ value: item, label: item })));
    }
    if ((list.length === 0 && formItem.api) || formItem.renderList) await loadData('');
  }, [formItem, loadData, list, allValue, value, onChange]);

  useEffect(() => {
    initFunction();
  }, [value]);

  const loadDataTree = async (treeNode: any) => {
    if (formItem?.api?.loadData) {
      const data = await formItem.api.loadData(treeNode, list);
      setList(data);
    }
  };

  const handleGetAllValue = useCallback((item: any) => {
    allValue.current.push({ value: item.value, label: item.title });

    if (item?.children?.length) {
      item?.children?.map(handleGetAllValue);
    }
  }, []);

  useEffect(() => {
    list.map(handleGetAllValue);
  }, [list, handleGetAllValue]);

  const handleGetData = (array: any, valueTag: any) => {
    return array.filter((item: any) => handleFindId(item, valueTag));
  };

  const handleFindId = (item: any, valueTag: any) => {
    if (item.value === valueTag) {
      return true;
    } else if (item?.children?.length) {
      return handleGetData(item.children, valueTag)?.length;
    }
  };

  const totalChildren = (obj: any, length: number, arrayValue: any[]) => {
    if (obj.value.indexOf('__') === -1 && arrayValue.indexOf(obj.value) > -1) {
      length += 1;
    }
    if (obj?.children?.length) {
      length = [...obj.children].reduce((previousValue, currentValue) => {
        return totalChildren(currentValue, previousValue, arrayValue);
      }, length);
    }
    return length;
  };

  const clearTag = (object: any, value: any) => {
    value = value.filter((item: any) => item.value !== object.value);
    if (object?.children?.length > 0) {
      object?.children?.map((item: any) => {
        value = clearTag(item, value);
        return item;
      });
    }
    return value;
  };

  const tagRender = (props: { value: string }) => {
    const item = handleGetData(list, props.value);
    const arrayValue = value.map((item: any) => item.value);
    if (
      arrayValue.indexOf(props.value) > -1 &&
      !!item.length &&
      (arrayValue.indexOf(item[0].value) === -1 ||
        arrayValue.indexOf(item[0].value) === arrayValue.indexOf(props.value))
    ) {
      const arraySlice = arrayValue.slice(0, arrayValue.indexOf(props.value));
      let checkShow = true;
      if (!!arraySlice.length && arrayValue.indexOf(item[0]?.value) === -1) {
        arraySlice.map((valueSlide: any) => {
          if (checkShow) {
            const itemSlice = handleGetData(list, valueSlide);
            if (!!itemSlice.length && item[0].value === itemSlice[0].value) {
              checkShow = false;
            }
          }
          return valueSlide;
        });
      }
      return (
        checkShow && (
          <div className='relative -left-2.5 mr-2.5 rounded-xl bg-primary/20 px-2 py-1'>
            <CButton
              icon={<CSvgIcon name='times' size={20} className='fill-error' />}
              className='absolute -right-2 -top-1 z-10 rounded-full !bg-error/20 leading-none !text-error'
              onClick={() => onChange?.(clearTag(item[0], value))}
              disabled={disabled}
            />
            {item[0].title} ({totalChildren(item[0], 0, arrayValue)})
          </div>
        )
      );
    }
    return <></>;
  };

  return (
    <Cascader
      allowClear={true}
      showSearch={showSearch}
      onChange={(data: any) => {
        if (formItem.api?.loadData) {
          if (formItem.mode !== 'multiple') {
            const _data = list.filter((_item: any) => _item.id === data.value)[0];
            onChange?.({ ..._data, label: _data.fullTitle });
          } else {
            onChange?.(
              data.map((__item: any) => {
                const _data = list.filter((_item: any) => _item.id === __item.value)[0];
                if (_data) {
                  return { ..._data, label: _data.fullTitle };
                }
                return __item;
              }),
            );
          }
        } else {
          onChange?.(data[0]);
        }
      }}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      multiple={formItem.mode === 'multiple'}
      loadData={loadDataTree}
      options={list}
      tagRender={tagRender}
      placement={'bottomLeft'}
    />
  );
};
interface Type {
  formItem: any;
  placeholder: string;
  onChange?: (e: any) => any;
  value?: any;
  form: FormInstance;
  disabled?: boolean;
  showSearch?: boolean;
}
export default Component;
