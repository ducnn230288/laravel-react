import React, { useRef } from 'react';
import { SorterResult } from 'antd/lib/table/interface';
import { TFunction } from 'i18next';

import { Search, Times } from '@/assets/svg';
import { IPaginationQuery } from '@/interfaces';
import { uuidv4 } from '@/utils';
import { Mask } from '../form/input';

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
    <div className="search">
      <Mask
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
        <Search
          onClick={() => {
            if (params.fullTextSearch) {
              (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value = '';
              handleTableChange(undefined, params.like, params.sort as SorterResult<any>, '');
            }
          }}
        />
      ) : (
        !!params.fullTextSearch && (
          <Times
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
