import React from 'react';
import { Checkbox, CheckboxOptionType, DatePicker, Radio, Spin } from 'antd';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { TFunction } from 'i18next';

import { Calendar, CheckCircle, CheckSquare, Search } from '@/assets/svg';
import { ITableGet } from '@/interfaces';
import { cleanObjectKeyNull } from '@/utils';
import { Mask } from '../form/input';
import { Button } from '../button';

const groupButton = (confirm: any, clearFilters: any, key: any, value: any, t: any) => (
  <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-1">
    <Button
      text={t('Reset')}
      onClick={() => {
        clearFilters();
        confirm();
      }}
      className={'h-4/5 justify-center !bg-gray-300 !px-2 !text-black sm:h-auto sm:px-4'}
    />
    <Button
      icon={<Search className="size-3 fill-white" />}
      text={t('Search')}
      onClick={() => confirm(value)}
      className={'h-4/5 justify-center !px-2 sm:h-auto sm:px-4'}
    />
  </div>
);
const columnSearch = (get: ITableGet, fullTextSearch = '', value?: any, facade: any = {}) => {
  if (get?.facade) {
    const params = get.params ? get.params(fullTextSearch, value) : { fullTextSearch };
    if (new Date().getTime() > facade.time || JSON.stringify(cleanObjectKeyNull(params)) != facade.queryParams)
      facade.get(cleanObjectKeyNull(params));
  }
};

export const getColumnSearchCheckbox = ({
  filters,
  key,
  get,
  valueFilter,
  timeoutSearch,
  t,
}: {
  filters: CheckboxOptionType[];
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
        <div className="p-1">
          {!!get?.facade && (
            <Mask
              placeholder={t('Search')}
              onChange={(e) => {
                clearTimeout(timeoutSearch.current);
                timeoutSearch.current = setTimeout(() => columnSearch(get, e.target.value, selectedKeys, facade), 500);
              }}
              onPressEnter={(e) => columnSearch(get, e.currentTarget.value, undefined, facade)}
            />
          )}
          <div>
            <Checkbox.Group
              options={filters || facade?.result?.data?.map(get.format).filter((item: any) => !!item.value) || []}
              defaultValue={selectedKeys}
              onChange={(e) => setSelectedKeys(e)}
            />
            {(filters?.length === 0 || facade?.result?.data?.length === 0) && (
              <span className={'px-2'}>{t('No Data')}</span>
            )}
          </div>
          {groupButton(confirm, clearFilters, key, selectedKeys, t)}
        </div>
      </Spin>
    );
  },
  filterIcon: (filtered: boolean) => (
    <CheckSquare className={classNames('h-3.5 w-3.5', { 'fill-blue-600': filtered, 'fill-gray-600': !filtered })} />
  ),
});

export const getColumnSearchRadio = ({
  filters,
  key,
  get,
  valueFilter,
  timeoutSearch,
  t,
}: {
  filters: CheckboxOptionType[];
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
        <div className="p-1">
          {get?.facade && (
            <Mask
              placeholder={t('Search')}
              onChange={(e) => {
                clearTimeout(timeoutSearch.current);
                timeoutSearch.current = setTimeout(() => columnSearch(get, e.target.value, selectedKeys), 500);
              }}
              onPressEnter={(e) => columnSearch(get, e.currentTarget.value, undefined, facade)}
            />
          )}
          <div>
            <Radio.Group
              options={filters || get?.facade?.result?.data?.map(get.format).filter((item: any) => !!item.value) || []}
              value={selectedKeys}
              onChange={(e) => setSelectedKeys(e.target.value + '')}
            />
            {(filters?.length === 0 || facade?.result?.data?.length === 0) && (
              <span className={'px-2'}>{t('No Data')}</span>
            )}
          </div>
          {groupButton(confirm, clearFilters, key, selectedKeys, t)}
        </div>
      </Spin>
    );
  },
  filterIcon: () => <CheckCircle className="size-3.5 fill-gray-600" />,
});
export const getColumnSearchDate = ({ key, t }: { key: string; t: TFunction<'locale', 'library'> }) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
    <div className={'p-1'}>
      <DatePicker.RangePicker
        renderExtraFooter={() => (
          <Button
            icon={<CheckCircle className="size-5 fill-white" />}
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
      {groupButton(confirm, clearFilters, key, selectedKeys, t)}
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <Calendar className={classNames('h-3.5 w-3.5', { 'fill-blue-600': filtered, 'fill-gray-600': !filtered })} />
  ),
});

export const getColumnSearchInput = ({ key, t }: { key: string; t: TFunction<'locale', 'library'> }) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
    <div className="p-1">
      <Mask
        id={'_input_filter_' + key}
        placeholder={t('Search')}
        value={selectedKeys}
        onChange={(e) => setSelectedKeys(e.target.value)}
        onPressEnter={() => confirm()}
      />
      {groupButton(confirm, clearFilters, key, selectedKeys, t)}
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <Search className={classNames('h-3.5 w-3.5', { 'fill-blue-600': filtered, 'fill-gray-600': !filtered })} />
  ),
  onFilterDropdownOpenChange: (visible: boolean) => {
    if (visible) {
      setTimeout(() => (document.getElementById('_input_filter_' + key) as HTMLInputElement).select(), 100);
    }
  },
});
