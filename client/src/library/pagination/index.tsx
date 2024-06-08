import React, { useEffect, useRef, useCallback, useState } from 'react';
import classNames from 'classnames';
import { Arrow, DoubleArrow } from '@/assets/svg';

import { Select } from '../form/input';

export const Pagination: any = ({
  total = 4,
  page = 1,
  perPage = 10,
  pageSizeOptions = [],
  paginationDescription = (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
  queryParams = () => null,
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
        index = page - 10;
        break;
      case 'next':
        index = page + 1;
        break;
      case 'next_10':
        index = page + 10;
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
        disabled: page - 10 < 0,
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
        disabled: page + 10 > lastIndex,
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
      <div className={'pagination'}>
        <div className={'left'}>
          {pageSizeOptions.length > 0 && (
            <Select
              allowClear={false}
              showSearch={false}
              value={perPage}
              onChange={(value) => onPageSizeChange(value)}
              list={pageSizeOptions.map((item: number) => ({ value: item, label: item + ' / page' }))}
            />
          )}
          {!!paginationDescription && <label>{paginationDescription(_temp.ranges[0], _temp.ranges[1], total)}</label>}
        </div>
        <div className="right">
          {listOfPageItem.current.map((item: any) => (
            <button
              type={'button'}
              disabled={item.disabled}
              key={item.type}
              className={classNames({ active: page === item.index, disabled: item.disabled })}
              onClick={() => onPageIndexChange(item)}
              aria-label={item.type}
            >
              {item.type === 'prev' && <Arrow className={'rotate-180'} />}
              {item.type === 'next' && <Arrow />}
              {item.type === 'prev_10' && <DoubleArrow className={'rotate-180'} />}
              {item.type === 'next_10' && <DoubleArrow />}
              {item.type.indexOf('page') === 0 && item.index}
              {(item.type === 'prev_5' || item.type === 'next_5') && '...'}
            </button>
          ))}
        </div>
      </div>
    )
  );
};

interface Type {
  total: number;
  page: number;
  perPage: number;
  pageSizeOptions: number[];
  paginationDescription: (from: number, to: number, total: number) => string;
  queryParams: ({ perPage, page }: { perPage: number; page: number }) => void;
}
export default Pagination;
