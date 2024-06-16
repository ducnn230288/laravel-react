import React from 'react';
import { Checkbox, type CheckboxOptionType, DatePicker, Radio, Spin } from 'antd';
import classNames from 'classnames';
import dayjs, { type Dayjs } from 'dayjs';
import type { TFunction } from 'i18next';

import { Calendar, CheckCircle, CheckSquare, Search } from '@/assets/svg';
import type { ITableGet, ITableItemFilterList } from '@/interfaces';
import { cleanObjectKeyNull } from '@/utils';
import { Mask } from '../form/input';
import { Button } from '../button';

const groupButton = ({confirm, clearFilters, value, t}: {confirm: any, clearFilters: any, key: any, value: any, t: any}) => (
  <div className='mt-2 grid grid-cols-2 gap-2'>
    <Button
      isTiny={true}
      text={t('Reset')}
      onClick={() => {
        clearFilters();
        confirm();
      }}
      className=' '
    />
    <Button
      isTiny={true}
      icon={<Search className='size-3 fill-primary-content' />}
      text={t('Search')}
      onClick={() => confirm(value)}
    />
  </div>
);
const columnSearch = (get: ITableGet, fullTextSearch = '', value?: any, facade: any = {}) => {
  if (get?.facade) {
    const params = get.params ? get.params(fullTextSearch, value) : { fullTextSearch };
    if (new Date().getTime() > facade.time || JSON.stringify(cleanObjectKeyNull(params)) != facade.queryParams) {
      facade.get(cleanObjectKeyNull(params));
    }
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
    const facade = get?.facade ? get?.facade() : {};
    if (get && !facade?.result?.data && valueFilter.current[key]) {
      columnSearch(get, '', undefined, facade);
      valueFilter.current[key] = false;
    }

    return (
      <Spin spinning={facade.isLoading === true}>
        <div className='p-1'>
          {!!get?.facade && (
            <Mask
              placeholder={t('Search')}
              onChange={e => {
                clearTimeout(timeoutSearch.current);
                timeoutSearch.current = setTimeout(() => columnSearch(get, e.target.value, selectedKeys, facade), 500);
              }}
              onPressEnter={e => columnSearch(get, e.currentTarget.value, undefined, facade)}
            />
          )}
          <div className='mt-1'>
            <Checkbox.Group
              options={
                (list as CheckboxOptionType[]) ||
                facade?.result?.data?.map(get.format).filter((item: any) => !!item.value) ||
                []
              }
              defaultValue={selectedKeys}
              onChange={e => setSelectedKeys(e)}
            />
            {(list?.length === 0 || facade?.result?.data?.length === 0) && (
              <span className={'px-2'}>{t('No Data')}</span>
            )}
          </div>
          {groupButton({confirm, clearFilters, key, value: selectedKeys, t})}
        </div>
      </Spin>
    );
  },
  filterIcon: (filtered: boolean) => (
    <CheckSquare className={classNames('size-3.5', { 'fill-blue-600': filtered, 'fill-base-content': !filtered })} />
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
    const facade = get?.facade ? get?.facade() : {};
    if (get && !facade?.result?.data && valueFilter.current[key]) {
      columnSearch(get, '', undefined, facade);
      valueFilter.current[key] = false;
    }
    return (
      <Spin spinning={facade.isLoading === true}>
        <div className='p-1'>
          {get?.facade && (
            <Mask
              placeholder={t('Search')}
              onChange={e => {
                clearTimeout(timeoutSearch.current);
                timeoutSearch.current = setTimeout(() => columnSearch(get, e.target.value, selectedKeys), 500);
              }}
              onPressEnter={e => columnSearch(get, e.currentTarget.value, undefined, facade)}
            />
          )}
          <div className='mt-1'>
            <Radio.Group
              options={
                (list as CheckboxOptionType[]) ||
                facade?.result?.data?.map(get.format).filter((item: any) => !!item.value) ||
                []
              }
              value={selectedKeys}
              onChange={e => setSelectedKeys(e.target.value + '')}
            />
            {(list?.length === 0 || facade?.result?.data?.length === 0) && (
              <span className={'px-2'}>{t('No Data')}</span>
            )}
          </div>
          {groupButton({confirm, clearFilters, key,value: selectedKeys, t})}
        </div>
      </Spin>
    );
  },
  filterIcon: (filtered: boolean) => (
    <CheckCircle className={classNames('size-3.5', { 'fill-primary': filtered, 'fill-base-content': !filtered })} />
  ),
});
export const getColumnSearchDate = ({ key, t }: { key: string; t: TFunction<'locale', 'library'> }) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
    <div className={'p-1'}>
      <DatePicker.RangePicker
        renderExtraFooter={() => (
          <Button
            icon={<CheckCircle className='size-5 fill-base-100' />}
            text={t('Ok')}
            onClick={() => (document.activeElement as HTMLElement).blur()}
            className={'w-full justify-center !py-0'}
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
      {groupButton({confirm, clearFilters, key, value: selectedKeys, t})}
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <Calendar className={classNames('size-3.5', { 'fill-primary': filtered, 'fill-base-content': !filtered })} />
  ),
});

export const getColumnSearchInput = ({ key, t }: { key: string; t: TFunction<'locale', 'library'> }) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
    <div className='p-1'>
      <Mask
        id={'_input_filter_' + key}
        placeholder={t('Search')}
        value={selectedKeys}
        onChange={e => setSelectedKeys(e.target.value)}
        onPressEnter={() => confirm()}
      />
      {groupButton({confirm, clearFilters, key, value: selectedKeys, t})}
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <Search className={classNames('size-3.5', { 'fill-primary': filtered, 'fill-base-content': !filtered })} />
  ),
  onFilterDropdownOpenChange: (visible: boolean) => {
    if (visible) {
      setTimeout(() => (document.getElementById('_input_filter_' + key) as HTMLInputElement).select(), 100);
    }
  },
});
