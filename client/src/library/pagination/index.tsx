import React, { useEffect, useRef, useCallback, useState } from 'react';
import classNames from 'classnames';
import { Arrow, DoubleArrow } from '@/assets/svg';

import { Select } from '../form/input';

export const Pagination: any = ({
  total = 4,
  pageSizeOptions = [],
  perPage = 10,
  page = 1,
  queryParams = () => null,
  paginationDescription = (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
  className = 'pagination',
  firstPageDisabled = ({ page }: { page: number }) => page - 10 < 0,
  lastPageDisabled = ({ page, lastIndex }: { page: number; lastIndex: number }) => page + 10 > lastIndex,
  firstPage = ({ page }: { page: number }) => page - 10,
  lastPage = ({ page }: { page: number }) => page + 10,
  showSizeChanger = true,
  showTotal = true,
}: Type) => {
  const listOfPageItem = useRef<{ disabled: boolean; type: string; index: number }[]>([]);
  const [_temp, set_temp] = useState<{ ranges: [number, number] }>({
    ranges: [(page - 1) * perPage + 1, Math.min(page * perPage, total)],
  });
  const lastNumber = useRef(0);
  const buildIndexes = useCallback(() => {
    const lastIndex = getLastIndex(total, perPage);
    listOfPageItem.current = getListOfPageItem(page, lastIndex);
    set_temp((pre) => ({ ...pre, ranges: [(page - 1) * perPage + 1, Math.min(page * perPage, total)] }));
  }, [page, perPage, total]);

  useEffect(() => {
    buildIndexes();
  }, [buildIndexes]);

  const getLastIndex = (total: number, pageSize: number) => {
    return Math.ceil(total / pageSize);
  };

  const onPageSizeChange = (perPage: number) => {
    queryParams({ perPage, page });
    buildIndexes();
  };

  const onPageIndexChange = ({ type, index }: { type: string; index: number }) => {
    switch (type) {
      case 'prev':
        index = page - 1;
        break;
      case 'prev_10':
        index = firstPage({ page, lastIndex: lastNumber.current });
        break;
      case 'next':
        index = page + 1;
        break;
      case 'next_10':
        index = lastPage({ page, lastIndex: lastNumber.current });
        break;
      default:
    }
    queryParams({ perPage, page: index });
  };

  const getListOfPageItem = (pageIndex: number, lastIndex: number) => {
    const concatWithPrevNext = (listOfPage: { index: number; type: string; disabled: boolean }[]) => {
      const prev10Item = {
        type: 'prev_10',
        index: -1,
        disabled: firstPageDisabled({ page, lastIndex }),
      };
      const prevItem = {
        type: 'prev',
        index: -1,
        disabled: pageIndex === 1,
      };
      const nextItem = {
        type: 'next',
        index: -1,
        disabled: pageIndex === lastIndex,
      };
      const next10Item = {
        type: 'next_10',
        index: -1,
        disabled: lastPageDisabled({ page, lastIndex }),
      };
      lastNumber.current = listOfPage.length;
      return [prev10Item, prevItem, ...listOfPage, nextItem, next10Item];
    };
    const generatePage = (start: number, end: number) => {
      const list: { index: number; type: string; disabled: boolean }[] = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page_' + i,
          disabled: false,
        });
      }
      return list;
    };

    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      const generateRangeItem = (selected: number, last: number) => {
        let listOfRange: { index: number; type: string; disabled: boolean }[];
        const prevFiveItem = {
          type: 'prev_5',
          index: -1,
          disabled: false,
        };
        const nextFiveItem = {
          type: 'next_5',
          index: -1,
          disabled: false,
        };
        const firstPageItem = generatePage(1, 1);
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 4) {
          listOfRange = [...generatePage(2, 4), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 1, selected + 1), nextFiveItem];
        } else {
          listOfRange = [prevFiveItem, ...generatePage(last - 3, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  };

  return (
    total > 0 && (
      <div className={classNames(className, 'flex flex-col lg:flex-row items-center justify-between mt-3 select-none')}>
        <div className={'left relative flex items-center'}>
          <label>
            {showSizeChanger && pageSizeOptions.length > 0 && (
              <Select
                allowClear={false}
                showSearch={false}
                className={'w-full sm:w-auto'}
                value={perPage}
                onChange={(value) => onPageSizeChange(value)}
                list={pageSizeOptions.map((item: number) => ({ value: item, label: item + ' / page' }))}
              />
            )}
          </label>
          {showTotal && (
            <span className="my-3 text-base-content sm:ml-3">
              {paginationDescription(_temp.ranges[0], _temp.ranges[1], total)}
            </span>
          )}
        </div>
        <div className="right mt-3 flex justify-center rounded-btn bg-base-200 p-1 sm:mt-0">
          <div className="flex justify-center transition-all duration-300 sm:flex-wrap">
            {listOfPageItem.current.map((item: any, index: number) => (
              <button
                type={'button'}
                disabled={item.disabled}
                key={index}
                className={classNames('text-center p-1 text-sm font-medium leading-normal relative mx-1', {
                  'text-base-content': page !== item.index && !['next_5', 'prev_5'].includes(item.type),
                  'bg-primary rounded-btn text-primary-content !px-2.5 mx-1': page === item.index,
                  '!text-base-content/20': item.disabled,
                  '!text-base-content/60 text-xs': ['next_5', 'prev_5'].includes(item.type),
                })}
                onClick={() => onPageIndexChange(item)}
                aria-label={item.type}
              >
                {item.type === 'prev' && <Arrow className={'size-3 rotate-180'} />}
                {item.type === 'next' && <Arrow className={'size-3'} />}
                {item.type === 'prev_10' && <DoubleArrow className={'size-3 rotate-180'} />}
                {item.type === 'next_10' && <DoubleArrow className={'size-3'} />}
                {item.type.indexOf('page') === 0 && item.index}
                {(item.type === 'prev_5' || item.type === 'next_5') && '...'}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

interface Type {
  total: number;
  pageSizeOptions: number[];
  perPage: number;
  page: number;
  queryParams: ({ perPage, page }: { perPage: number; page: number }) => void;
  paginationDescription: (from: number, to: number, total: number) => string;
  className: string;
  firstPageDisabled: ({ page, lastIndex }: { page: number; lastIndex: number }) => boolean;
  lastPageDisabled: ({ page, lastIndex }: { page: number; lastIndex: number }) => boolean;
  firstPage: ({ page, lastIndex }: { page: number; lastIndex: number }) => number;
  lastPage: ({ page, lastIndex }: { page: number; lastIndex: number }) => number;
  showSizeChanger: boolean;
  showTotal: boolean;
}
export default Pagination;
