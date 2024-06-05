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
    <div className="relative">
      <Mask
        className={'h-10 pl-8'}
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
          className="absolute left-2.5 top-2 z-10 my-1 size-3.5 fill-gray-500 text-lg"
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
            className="absolute right-3 top-2 z-10 my-1 size-3.5 fill-gray-500 text-lg"
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
