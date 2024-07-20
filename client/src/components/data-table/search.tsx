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

  return (
    <div className='search'>
      <CIMask
        id={idTable.current + '_input_search'}
        value={params.fullTextSearch}
        placeholder={t('Search')}
        onChange={() => {
          clearTimeout(timeoutSearch.current);
          timeoutSearch.current = setTimeout(
            () =>
              handleTableChange(
                undefined,
                params.like,
                params.sort as SorterResult<any>,
                (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value.trim(),
              ),
            500,
          );
        }}
        onPressEnter={() =>
          handleTableChange(
            undefined,
            params.like,
            params.sort as SorterResult<any>,
            (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value.trim(),
          )
        }
      />
      {!params.fullTextSearch ? (
        <CSvgIcon
          name='search'
          onClick={() => {
            if (params.fullTextSearch) {
              (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value = '';
              handleTableChange(undefined, params.like, params.sort as SorterResult<any>, '');
            }
          }}
        />
      ) : (
        !!params.fullTextSearch && (
          <CSvgIcon
            name='times'
            onClick={() => {
              if (params.fullTextSearch) {
                (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value = '';
                handleTableChange(undefined, params.like, params.sort as SorterResult<any>, '');
              }
            }}
          />
        )
      )}
    </div>
  );
};
