import { DndContext, useDraggable } from '@dnd-kit/core';
import { restrictToHorizontalAxis, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import classNames from 'classnames';
import dayjs, { type Dayjs } from 'dayjs';
import TweenOne from 'rc-tween-one';
import { useEffect, useRef, useState } from 'react';

import { uuidv4 } from '@/utils';
import { CSvgIcon } from '../svg-icon';

export const CGantt = ({
  widthColumnDay = 36,
  perRow = 3,
  maxHeight = 900,
  data = [],
  event = [],
}: {
  widthColumnDay?: number;
  perRow?: number;
  maxHeight?: number;
  data: TTask[];
  event: {
    name: string;
    startDate: Dayjs;
    endDate?: Dayjs;
  }[];
}) => {
  const widthMonthYear = 110;
  const id = useRef('gantt-' + uuidv4());
  useEffect(() => {
    dayjs.locale('vi');
  }, []);

  const remainingMonths = (d: Dayjs, e: Dayjs) => {
    let date = d.subtract(perRow * 2, 'days');
    let end = e;
    const addDate = date.daysInMonth() - date.date() + 1;
    if (addDate * (widthColumnDay / perRow) < widthMonthYear)
      date = date.subtract(Math.ceil(widthMonthYear / widthColumnDay) * perRow - addDate, 'days');

    const addEndDate = end.date() + 1;
    if (addEndDate * (widthColumnDay / perRow) < widthMonthYear)
      end = end.add(Math.ceil(widthMonthYear / widthColumnDay) * perRow - addEndDate, 'days');
    setTemp(pre => ({ ...pre, dateStart: date }));
    const endMonth = end.month() - date.month() + 1 + (end.year() - date.year()) * 12;
    const objDate: any = {};
    let totalDay = date.date();
    let lengthDay = 0;
    for (let i = 0; i < endMonth; i++) {
      const currentDay = date.add(i, 'months');
      const month = currentDay.month();
      if (!objDate[currentDay.year()]) objDate[currentDay.year()] = {};
      if (!objDate[currentDay.year()][month]) objDate[currentDay.year()][month] = [];
      const dayInMonth = currentDay.daysInMonth();
      for (let j = totalDay; j <= dayInMonth; j += perRow) {
        if (j + perRow > dayInMonth) totalDay = j + perRow - dayInMonth;
        const nextDate = dayjs(
          currentDay.year() + '-' + (month < 10 ? '0' : '') + (month + 1) + '-' + (j < 10 ? '0' : '') + j,
        );
        if (nextDate < end.add(perRow, 'days')) objDate[currentDay.year()][month].push(nextDate);
      }
      lengthDay += objDate[currentDay.year()][month].length;
    }
    return { obj: objDate, total: lengthDay };
  };
  const [temp, setTemp] = useState<{ date: any; dateStart: Dayjs; task: any[] }>({
    date: { obj: {}, total: 0 },
    dateStart: dayjs(data[0].startDate),
    task: data,
  });

  const getScrollBarWidth = () => {
    const el = document.createElement('div');
    el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;';
    document.body.appendChild(el);
    const width = el.offsetWidth - el.clientWidth;
    el.remove();
    return width;
  };

  useEffect(() => {
    let start = dayjs();
    let end = dayjs().add(1, 'months');
    if (data.length && temp.date.total === 0) {
      start = data[0].startDate;
      end = data[0].endDate || data[0].startDate.add(1, 'months');
      data.forEach(item => {
        if (item.startDate < start) start = item.startDate;
        if (item.endDate && item.endDate > end) end = item.endDate;
      });
    }
    setTemp(pre => ({ ...pre, date: remainingMonths(start, end) }));
  }, [data]);

  useEffect(() => {
    if (temp.date.total > 0) {
      (document.querySelector(`#${id.current} .left .head`) as any)!.style.width =
        document.querySelector(`#${id.current} .left .body`)!.clientWidth + getScrollBarWidth() + 'px';
      document.querySelectorAll(`#${id.current} .left tbody > tr:nth-of-type(1) > td`).forEach((e: any, index, arr) => {
        (document.querySelector(
          `#${id.current} .left thead > tr:nth-of-type(1) > th:nth-of-type(${index + 1})`,
        ) as any)!.style.width = e.clientWidth + (arr.length - 1 === index ? getScrollBarWidth() : 0) + 'px';
      });
      document
        .querySelectorAll(`#${id.current} .overflow-scroll`)
        .forEach((e: any) => (e.style.height = maxHeight + 'px'));
    }
  }, [temp]);

  const loopGetDataset = (e: HTMLElement, key: string): HTMLElement => {
    if (e.parentElement && Object.prototype.hasOwnProperty.call(e.parentElement.dataset, key)) return e.parentElement;
    else if (e.parentElement) return loopGetDataset(e.parentElement, key);
    else return e;
  };
  const handleHover = (e: any) => {
    if (e.target) {
      const index = parseInt(loopGetDataset(e.target as HTMLElement, 'index').dataset.index!) + 1;
      ['left', 'right'].forEach(className =>
        document
          .querySelector(`#${id.current} .${className} tbody > tr:nth-of-type(${index})`)
          ?.querySelectorAll('td')
          .forEach((td: HTMLTableCellElement) => td.classList.toggle('bg-blue-100')),
      );
    }
  };
  const statusCollapse = useRef<any>({});
  const handleCollapse = (index: number, level: number) => {
    statusCollapse.current[index] = !statusCollapse.current[index];

    let isCheck = true;
    let currentLevel: number | undefined;
    setTemp(pre => ({
      ...pre,
      task: temp.task.map((item, trIndex) => {
        if (isCheck && trIndex > index) {
          if (item.level > level) {
            if (currentLevel !== undefined && currentLevel === item.level && !statusCollapse.current[trIndex])
              currentLevel = undefined;
            else if (statusCollapse.current[trIndex] && currentLevel === undefined) currentLevel = item.level;
            item.hidden = statusCollapse.current[index] || (currentLevel !== undefined && currentLevel !== item.level);
          } else isCheck = false;
        }
        return item;
      }),
    }));
  };

  const handleScroll = (e: any) => {
    (document.querySelector(`#${id.current} .event`) as any)!.style.top = e.target.scrollTop + 'px';
    ['left', 'right'].forEach(className =>
      document.querySelector(`#${id.current} .${className} .overflow-scroll`)!.scrollTo({ top: e.target.scrollTop }),
    );
    if (e.target.dataset.scrollX)
      document.querySelector(`#${id.current} ${e.target.dataset.scrollX}`)!.scrollTo({ left: e.target.scrollLeft });
  };
  const NameColumn = ({ name }: { name: string }) => (
    <th align={'left'} className='relative h-12 truncate border px-4 text-xs capitalize'>
      {name}
    </th>
  );
  const renderSvg = (item: TTask, i: number) => {
    if (item.success) {
      const endDate = item.endDate || item.startDate.add(i === 0 ? 0 : 1, 'day');
      const startTop = i * 24 + 4 + 8;
      const startLeft = (endDate.diff(temp.dateStart, 'day') + perRow / 10) * (widthColumnDay / perRow);
      return item.success.split(',').map((id, index) => {
        const listData = temp.task.filter(item => !item.hidden && item.id === id);
        if (listData.length) {
          const data = listData[0];
          const endTop = temp.task.filter(item => !item.hidden).indexOf(data) * 24 + (data.endDate ? 4 : 7);
          const endLeft =
            (data.startDate.diff(temp.dateStart, 'day') + (data.endDate ? 0 : 1) + perRow / 8) *
              (widthColumnDay / perRow) +
            (data.endDate ? 3 : data.startDate.diff(endDate) > 0 ? -9 : 3);
          return (
            <g key={i + '' + index}>
              <path
                d={
                  endDate.diff(data.startDate, 'day') > 1
                    ? `M ${startLeft - 1} ${startTop} L ${startLeft + widthColumnDay / perRow} ${startTop} L ${
                        startLeft + widthColumnDay / perRow
                      } ${startTop + 10} L ${endLeft} ${startTop + 10} L ${endLeft} ${endTop} `
                    : `M ${startLeft - 1} ${startTop} L ${endLeft} ${startTop} L ${endLeft} ${endTop}`
                }
                fill='transparent'
                stroke={!item.endDate ? 'black' : '#2563eb'}
                strokeWidth={1}
                aria-label={item.name}
                tabIndex={-1}
              ></path>
              <path
                d={`M ${endLeft + 4.2} ${endTop - 4.5} L ${endLeft - 4.5} ${endTop - 4.5} L ${endLeft + 0.2} ${endTop} Z`}
                aria-label={item.name}
                fill={!item.endDate ? 'black' : '#2563eb'}
              ></path>
            </g>
          );
        }
      });
    }
  };
  const indexTask = useRef(-1);
  const renderProgress = (item: TTask, index: number) => {
    if (index === 0) indexTask.current = -1;
    if (item.hidden) return;
    indexTask.current += 1;
    const startTop = indexTask.current * 24 + 4;
    const startLeft = item.startDate.diff(temp.dateStart, 'day') * (widthColumnDay / perRow);
    if (item.endDate && item.percent) {
      return (
        <div
          key={index}
          className={'absolute'}
          style={{
            top: startTop + 'px',
            left: startLeft + 'px',
          }}
        >
          <div
            className={classNames('z-10 overflow-hidden', {
              'bg-base-200': !!temp.task[index + 1] && temp.task[index + 1].level > item.level,
              'rounded-md bg-primary': !temp.task[index + 1] || temp.task[index + 1].level <= item.level,
            })}
            style={{
              width: (item.endDate.diff(item.startDate, 'day') + 1) * (widthColumnDay / perRow) + 'px',
            }}
          >
            <div
              className={classNames('text-center text-base-content text-xs h-4', {
                'bg-base-content/50': !!temp.task[index + 1] && temp.task[index + 1].level > item.level,
                'bg-primary': !temp.task[index + 1] || temp.task[index + 1].level <= item.level,
              })}
              style={{ width: item.percent + '%' }}
            ></div>
          </div>
        </div>
      );
    }
    return (
      <div
        key={index}
        className={'absolute'}
        style={{
          top: startTop,
          left: startLeft + (item.endDate || index === 0 ? 0 : widthColumnDay / perRow) + 'px',
        }}
      >
        <div className={'absolute -left-1 top-1 z-10 size-3 rotate-45 bg-black'}></div>
        {/*<div className="absolute -top-0.5 left-3 whitespace-nowrap">{item.name}</div>*/}
      </div>
    );
  };

  const widthGantt = (year: string, month: string) =>
    (dayjs()
      .year(parseInt(year))
      .month(parseInt(month))
      .endOf('month')
      .diff(temp.date.obj[year][month][temp.date.obj[year][month].length - 1], 'days') < perRow
      ? dayjs().year(parseInt(year)).month(parseInt(month)).endOf('month').diff(temp.date.obj[year][month][0], 'days') >
        temp.date.obj[year][month][0].daysInMonth() - (widthMonthYear / widthColumnDay) * perRow
        ? temp.date.obj[year][month][0].daysInMonth()
        : dayjs()
            .year(parseInt(year))
            .month(parseInt(month))
            .endOf('month')
            .diff(temp.date.obj[year][month][0], 'days') + 1
      : temp.date.obj[year][month][temp.date.obj[year][month].length - 1].diff(
          temp.date.obj[year][month][0].startOf('month'),
          'days',
        ) + perRow) *
      (widthColumnDay / perRow) +
    'px';

  const handleDragMoveHorizontal = ({ delta, active }) => {
    const left: any = document.querySelector(`#${id.current} .left`);
    const right: any = document.querySelector(`#${id.current} .right`);
    if (active.id === 'side') {
      if (dragStart) {
        dragStart = false;
        wLeft = parseFloat(left.clientWidth);
        wRight = parseFloat(right.clientWidth);
      }
      const p = delta.x;
      left.style.flexBasis = ((wLeft + p) / (wLeft + wRight)) * 100 + '%';
      right.style.flexBasis = ((wRight - p) / (wLeft + wRight)) * 100 + '%';
    }
  };
  const handleDragMoveVertical = ({ delta, active }) => {
    if (active.id === 'vertical') {
      const vertical = document.querySelectorAll(`#${id.current} .overflow-scroll`);
      if (dragStart) {
        dragStart = false;
        height = vertical[0].clientHeight;
      }
      vertical.forEach((e: any) => (e.style.height = height + delta.y + 'px'));
    }
  };

  const renderTasks = () =>
    temp.task.map(
      (item, index) =>
        !item.hidden && (
          <tr key={index} onFocus={handleHover} onBlur={handleHover} data-index={index} data-level={item.level}>
            <td className='h-6 overflow-hidden border-x py-0 pl-5'>
              <div
                className={'flex items-center gap-1'}
                style={{ paddingLeft: item.level * (widthColumnDay / perRow) + 'px' }}
              >
                {!!temp.task[index + 1] && temp.task[index + 1].level > item.level && (
                  <TweenOne
                    animation={{ rotate: 0, duration: 200 }} // @ts-ignore
                    moment={!statusCollapse.current[index] ? null : 1}
                    reverse={!statusCollapse.current[index]}
                    className={'-ml-4 size-3 rotate-90 cursor-pointer'}
                  >
                    <CSvgIcon name='arrow' size={12} onClick={() => handleCollapse(index, item.level)} />
                  </TweenOne>
                )}
                <span className={'truncate'}>{item.name}</span>
              </div>
            </td>
            <td className='h-6 truncate border-x px-4 py-0'>{item.assignee}</td>
            <td
              className={classNames('border-x px-4 py-0 h-6 text-white truncate', {
                'bg-primary': item.status === 'In Progress',
                'bg-success': item.status === 'Completed',
                'bg-base-content': item.status === 'On Hold',
              })}
            >
              {item.status}
            </td>
            <td
              className={classNames('border-x px-4 py-0 h-6 text-white truncate', {
                'bg-error': item.priority === 'Critical',
                'bg-secondary': item.priority === 'High',
                'bg-warning': item.priority === 'Normal',
              })}
            >
              {item.priority}
            </td>
            <td className='h-6 truncate border-x px-4 py-0'>
              {item.planned} {item.planned ? 'hours' : ''}
            </td>
            <td className='h-6 truncate border-x px-4 py-0'>
              {item.work} {item.work ? 'days' : ''}
            </td>
          </tr>
        ),
    );
  const renderMonthYear = () =>
    Object.keys(temp.date.obj).map(year =>
      Object.keys(temp.date.obj[year]).map((month, index) => (
        <th
          key={index}
          align={'left'}
          className={'h-6 border-x border-t px-4 text-xs capitalize'}
          style={{ width: widthGantt(year, month) }}
        >
          {temp.date.obj[year][month][0].format('MMMM')} {year}
        </th>
      )),
    );

  const renderDay = () =>
    Object.keys(temp.date.obj).map(year =>
      Object.keys(temp.date.obj[year]).map(month =>
        temp.date.obj[year][month].map((day: Dayjs, index: number) => (
          <th
            key={index}
            className={'h-6 border-x text-xs font-normal capitalize'}
            style={{ width: widthColumnDay + 'px' }}
          >
            {day.format('DD')}
          </th>
        )),
      ),
    );

  const renderEvent = () =>
    event.map((item, index) => {
      if (item.endDate)
        return (
          <div
            key={'event' + index}
            className={'absolute flex h-full items-center justify-center bg-base-300 text-base-content'}
            style={{
              width: (item.endDate.diff(item.startDate, 'day') + 1) * (widthColumnDay / perRow) + 'px',
              left: item.startDate.diff(temp.dateStart, 'day') * (widthColumnDay / perRow) + 'px',
            }}
          >
            <div
              className='rotate-90 whitespace-nowrap text-center'
              style={{ marginTop: -item.name.length * 6 + 'px' }}
            >
              {item.name}
            </div>
          </div>
        );
      else
        return (
          <div
            key={'event' + index}
            className={'absolute flex h-full items-center justify-center border-l border-dashed border-error'}
            style={{
              left: item.startDate.diff(temp.dateStart, 'day') * (widthColumnDay / perRow) + 'px',
            }}
          >
            <div className='rounded-r-xl bg-error px-2 py-1 text-error-content'>{item.name}</div>
          </div>
        );
    });
  const renderGridDay = () =>
    temp.task.map((item, index) => (
      <tr key={index} onFocus={handleHover} onBlur={handleHover} data-index={index} data-level={item.level}>
        {Object.keys(temp.date.obj).map(year =>
          Object.keys(temp.date.obj[year]).map(month =>
            temp.date.obj[year][month].map((_: Dayjs, i: number) => (
              <td key={i} className={'relative h-6 border-x py-0 font-normal capitalize'} />
            )),
          ),
        )}
      </tr>
    ));

  let wLeft = 0;
  let wRight = 0;
  let dragStart = true;
  let height = 0;
  return (
    <div id={id.current} className='relative'>
      <div className='relative'>
        <DndContext
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={() => (dragStart = true)}
          onDragMove={handleDragMoveHorizontal}
        >
          <div className={'flex w-full gap-0.5'}>
            <div className={'left overflow-hidden'} style={{ flexBasis: '50%' }}>
              <div className={'left-scroll overflow-x-hidden'}>
                <table className={'head min-w-[600px]'}>
                  <thead>
                    <tr>
                      <NameColumn name={'Product Release'}></NameColumn>
                      <NameColumn name={'Assignee'}></NameColumn>
                      <NameColumn name={'Status'}></NameColumn>
                      <NameColumn name={'Priority'}></NameColumn>
                      <NameColumn name={'Planned'}></NameColumn>
                      <NameColumn name={'Work Log'}></NameColumn>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className='overflow-scroll' data-scroll-x={'.left-scroll'} onScroll={handleScroll}>
                <table className={'body min-w-[600px] border-b'}>
                  <tbody>{renderTasks()}</tbody>
                </table>
              </div>
            </div>
            <DraggableSide />
            <div className={'right relative overflow-hidden'} style={{ flexBasis: '50%' }}>
              <div className={'right-scroll overflow-x-hidden'} style={{ paddingRight: getScrollBarWidth() + 'px' }}>
                <table
                  className={'w-full min-w-[600px] border-b'}
                  style={{ width: temp.date.total * widthColumnDay + 'px' }}
                >
                  <thead>
                    <tr>{renderMonthYear()}</tr>
                  </thead>
                </table>
                <table
                  className={'w-full min-w-[600px] border-b'}
                  style={{ width: temp.date.total * widthColumnDay + 'px' }}
                >
                  <thead>
                    <tr>{renderDay()}</tr>
                  </thead>
                </table>
              </div>
              <div className='relative overflow-scroll' data-scroll-x={'.right-scroll'} onScroll={handleScroll}>
                <div
                  className='event absolute left-0 top-0 z-10 flex h-full'
                  style={{ width: temp.date.total * widthColumnDay + 'px' }}
                >
                  {renderEvent()}
                </div>
                <svg
                  className={'absolute left-0 top-0 z-10'}
                  style={{
                    width: temp.date.total * widthColumnDay + 'px',
                    height: temp.task.filter(item => !item.hidden).length * 24 + 'px',
                  }}
                >
                  {temp.task.filter(item => !item.hidden).map((item, i) => renderSvg(item, i))}
                </svg>
                <div
                  className='task absolute left-0 top-0 z-10 flex'
                  style={{ width: temp.date.total * widthColumnDay + 'px' }}
                >
                  {temp.task.map((item, index) => renderProgress(item, index))}
                </div>
                <table
                  className={'-z-10 min-w-[600px] border-b'}
                  style={{ width: temp.date.total * widthColumnDay + 'px' }}
                >
                  <tbody>{renderGridDay()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </DndContext>
      </div>
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={() => (dragStart = true)}
        onDragMove={handleDragMoveVertical}
      >
        <DraggableVertical />
      </DndContext>
    </div>
  );
};
const DraggableSide = () => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: 'side' });
  return (
    <div className={'h-auto w-1 cursor-ew-resize hover:bg-error'} ref={setNodeRef} {...listeners} {...attributes} />
  );
};
const DraggableVertical = () => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: 'vertical' });
  return (
    <div className={'h-1 w-full cursor-ns-resize hover:bg-error'} ref={setNodeRef} {...listeners} {...attributes} />
  );
};
type TTask = {
  id: string;
  name: string;
  assignee?: string;
  status?: string;
  priority?: string;
  planned?: number;
  work?: number;
  startDate: Dayjs;
  endDate?: Dayjs;
  percent?: number;
  level: number;
  success?: string;
  hidden?: boolean;
};
