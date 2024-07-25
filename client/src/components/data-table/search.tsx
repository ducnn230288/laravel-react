import type { SorterResult } from 'antd/lib/table/interface';
import type { TFunction } from 'i18next';
import React, { useRef } from 'react';

import type { IPaginationQuery } from '@/types';
import { uuidv4 } from '@/utils';
import { CIMask } from '../form/input';
import { CSvgIcon } from '../svg-icon';

export const CSearch = ({
  params,
  t,
  timeoutSearch,
  handleTableChange,
}: {
  params: IPaginationQuery;
  timeoutSearch: React.MutableRefObject<NodeJS.Timeout | undefined>;
  t: TFunction<'locale', 'library'>;
  handleTableChange: (
    pagination?: {
      page?: number;
      perPage?: number;
    },
    filters?: any,
    sort?: SorterResult<any>,
    tempFullTextSearch?: string,
  ) => void;
}) => {
  const idTable = useRef('temp-' + uuidv4());

  const handlePressEnter = () =>
    handleTableChange(
      undefined,
      params.like,
      params.sort as SorterResult<any>,
      (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value.trim(),
    );

  const handleChange = () => {
    clearTimeout(timeoutSearch.current);
    timeoutSearch.current = setTimeout(() => handlePressEnter, 500);
  };

  const handClick = () => {
    if (params.fullTextSearch) {
      (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value = '';
      handleTableChange(undefined, params.like, params.sort as SorterResult<any>, '');
    }
  };

  return (
    <div className='search'>
      <CIMask
        id={idTable.current + '_input_search'}
        value={params.fullTextSearch}
        placeholder={t('Search')}
        onChange={handleChange}
        onPressEnter={handlePressEnter}
      />
      <CSvgIcon name={params.fullTextSearch ? 'times' : 'search'} onClick={handClick} />
    </div>
  );
};
