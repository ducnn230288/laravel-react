import { Checkbox, DatePicker, Radio, Spin, type CheckboxOptionType } from 'antd';
import classNames from 'classnames';
import dayjs, { type Dayjs } from 'dayjs';
import type { TFunction } from 'i18next';
import React, { useState } from 'react';

import type { ITableGet, ITableItemFilterList } from '@/types';
import { API, KEY_TEMP, cleanObjectKeyNull, routerLinks } from '@/utils';

import { CButton } from '../button';
import { CIMask } from '../form/input';
import { CSvgIcon } from '../svg-icon';

const groupButton = ({
  confirm,
  clearFilters,
  value,
  t,
}: {
  confirm: any;
  clearFilters: any;
  key: any;
  value: any;
  t: any;
}) => (
  <div className='mt-2 grid grid-cols-2 gap-2'>
    <CButton
      isTiny={true}
      text={t('Reset')}
      onClick={() => {
        clearFilters();
        confirm();
      }}
      className=' '
    />
    <CButton
      isTiny={true}
      icon={<CSvgIcon name='search' size={12} className='fill-primary-content' />}
      text={t('Search')}
      onClick={() => confirm(value)}
    />
  </div>
);

const loadData = async ({
  get,
  fullTextSearch = '',
  value,
  setTemp,
}: {
  get: ITableGet;
  fullTextSearch?: string;
  value?: any;
  setTemp: any;
}) => {
  if (get?.keyApi) {
    const params = cleanObjectKeyNull(get.params ? get.params(fullTextSearch, value) : { fullTextSearch });
    const _local = localStorage.getItem(KEY_TEMP);
    const _temp = _local ? JSON.parse(_local) : {};
    const obj = _temp['table-filter-' + get.keyApi];
    if (!obj || (obj && (new Date().getTime() > obj.time || JSON.stringify(params) != obj.queryParams)))
      try {
        setTemp(pre => ({ ...pre, isLoading: true }));
        _temp['table-filter-' + get.keyApi] = {
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
        _temp['table-filter-' + get.keyApi].data = data.data;
        localStorage.setItem(KEY_TEMP, JSON.stringify(_temp));
      } catch (e) {}
  }
};

export const getColumnSearchCheckbox = ({
  list,
  key,
  get,
  valueFilter,
  timeoutSearch,
  t,
}: {
  list: ITableItemFilterList[];
  key: string;
  get: ITableGet;
  valueFilter: React.MutableRefObject<{ [selector: string]: boolean }>;
  timeoutSearch: React.MutableRefObject<NodeJS.Timeout | undefined>;
  t: TFunction<'locale', 'library'>;
}) => ({
  onFilterDropdownOpenChange: async (visible: boolean) => (valueFilter.current[key] = visible),
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
    const _local = localStorage.getItem(KEY_TEMP);
    const _temp = _local ? JSON.parse(_local) : {};
    const [temp, setTemp] = useState<{ list: any[]; isLoading: boolean }>({
      list:
        !get?.keyApi || !_temp['table-filter-' + get.keyApi]
          ? list
          : _temp['table-filter-' + get.keyApi].data
              .map((e: any) => (get?.format ? get.format(e) : e))
              .filter((item: any) => !!item.value),
      isLoading: false,
    });

    if (get && valueFilter.current[key]) {
      loadData({ get, fullTextSearch: '', setTemp });
      valueFilter.current[key] = false;
    }

    return (
      <Spin spinning={temp.isLoading}>
        <div className='p-1'>
          {!!get?.keyApi && (
            <CIMask
              placeholder={t('Search')}
              onChange={e => {
                clearTimeout(timeoutSearch.current);
                timeoutSearch.current = setTimeout(
                  () =>
                    loadData({
                      get,
                      fullTextSearch: e.target.value,
                      value: selectedKeys.length > 0 ? selectedKeys : undefined,
                      setTemp,
                    }),
                  500,
                );
              }}
              onPressEnter={e => loadData({ get, fullTextSearch: e.target.value, setTemp })}
            />
          )}
          <div className='mt-1'>
            <Checkbox.Group
              options={(temp.list as CheckboxOptionType[]) ?? []}
              defaultValue={selectedKeys}
              onChange={e => setSelectedKeys(e)}
            />
            {temp.list?.length === 0 && <span className={'px-2'}>{t('No Data')}</span>}
          </div>
          {groupButton({ confirm, clearFilters, key, value: selectedKeys, t })}
        </div>
      </Spin>
    );
  },
  filterIcon: (filtered: boolean) => (
    <CSvgIcon
      name='check-square'
      size={14}
      className={classNames({ 'fill-primary': filtered, 'fill-base-content': !filtered })}
    />
  ),
});

export const getColumnSearchRadio = ({
  list,
  key,
  get,
  valueFilter,
  timeoutSearch,
  t,
}: {
  list: ITableItemFilterList[];
  key: string;
  get: ITableGet;
  valueFilter: React.MutableRefObject<{ [selector: string]: boolean }>;
  timeoutSearch: React.MutableRefObject<NodeJS.Timeout | undefined>;
  t: TFunction<'locale', 'library'>;
}) => ({
  onFilterDropdownOpenChange: async (visible: boolean) => (valueFilter.current[key] = visible),
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
    const _local = localStorage.getItem(KEY_TEMP);
    const _temp = _local ? JSON.parse(_local) : {};
    const [temp, setTemp] = useState<{ list: any[]; isLoading: boolean }>({
      list:
        !get?.keyApi || !_temp['table-filter-' + get.keyApi]
          ? list
          : _temp['table-filter-' + get.keyApi].data
              .map((e: any) => (get?.format ? get.format(e) : e))
              .filter((item: any) => !!item.value),
      isLoading: false,
    });

    if (get && valueFilter.current[key]) {
      loadData({ get, fullTextSearch: '', setTemp });
      valueFilter.current[key] = false;
    }

    return (
      <Spin spinning={temp.isLoading}>
        <div className='p-1'>
          {get?.keyApi && (
            <CIMask
              placeholder={t('Search')}
              onChange={e => {
                clearTimeout(timeoutSearch.current);
                timeoutSearch.current = setTimeout(
                  () =>
                    loadData({
                      get,
                      fullTextSearch: e.target.value,
                      value: selectedKeys.length > 0 ? selectedKeys : undefined,
                      setTemp,
                    }),
                  500,
                );
              }}
              onPressEnter={e => loadData({ get, fullTextSearch: e.target.value, setTemp })}
            />
          )}
          <div className='mt-1'>
            <Radio.Group
              options={(temp.list as CheckboxOptionType[]) ?? []}
              value={selectedKeys}
              onChange={e => setSelectedKeys(e.target.value + '')}
            />
            {temp.list?.length === 0 && <span className={'px-2'}>{t('No Data')}</span>}
          </div>
          {groupButton({ confirm, clearFilters, key, value: selectedKeys, t })}
        </div>
      </Spin>
    );
  },
  filterIcon: (filtered: boolean) => (
    <CSvgIcon
      name='check-circle'
      size={14}
      className={classNames({ 'fill-primary': filtered, 'fill-base-content': !filtered })}
    />
  ),
});
export const getColumnSearchDate = ({ key, t }: { key: string; t: TFunction<'locale', 'library'> }) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
    <div className={'p-1'}>
      <DatePicker.RangePicker
        renderExtraFooter={() => (
          <CButton
            icon={<CSvgIcon name='check-circle' size={20} className='fill-base-100' />}
            text={t('Ok')}
            onClick={() => (document.activeElement as HTMLElement).blur()}
            className={'w-full justify-center py-0'}
          />
        )}
        format={['DD-MM-YYYY', 'DD-MM-YY']}
        value={!!selectedKeys && selectedKeys.length && [dayjs(selectedKeys[0]), dayjs(selectedKeys[1])]}
        onChange={(e: null | (Dayjs | null)[]) => {
          if (e?.length && e[0] && e[1]) {
            setSelectedKeys([
              e[0].startOf('day').utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
              e[1].endOf('day').utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            ]);
          }
        }}
      />
      {groupButton({ confirm, clearFilters, key, value: selectedKeys, t })}
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <CSvgIcon
      name='calendar'
      size={14}
      className={classNames({ 'fill-primary': filtered, 'fill-base-content': !filtered })}
    />
  ),
});

export const getColumnSearchInput = ({ key, t }: { key: string; t: TFunction<'locale', 'library'> }) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
    <div className='p-1'>
      <CIMask
        id={'_input_filter_' + key}
        placeholder={t('Search')}
        value={selectedKeys}
        onChange={e => setSelectedKeys(e.target.value)}
        onPressEnter={() => confirm()}
      />
      {groupButton({ confirm, clearFilters, key, value: selectedKeys, t })}
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <CSvgIcon
      name='search'
      size={14}
      className={classNames({ 'fill-primary': filtered, 'fill-base-content': !filtered })}
    />
  ),
  onFilterDropdownOpenChange: (visible: boolean) => {
    if (visible) {
      setTimeout(() => (document.getElementById('_input_filter_' + key) as HTMLInputElement).select(), 100);
    }
  },
});
