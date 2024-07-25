import { DndContext } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import React, { type PropsWithChildren } from 'react';

export const CTableDrag = ({
  children,
  tableRef,
}: PropsWithChildren<{ tableRef: React.RefObject<HTMLDivElement> }>) => {
  let indexLeft: number;
  let left: any;
  let wLeft: number;
  let table: HTMLTableElement;
  let wTable: number;

  const handleDragMove = ({ activatorEvent, delta }) => {
    if (!left) {
      left = (activatorEvent.target as HTMLSpanElement)?.closest('th');
      const th = Array.prototype.slice.call(tableRef.current?.querySelectorAll('thead > tr > th'));
      indexLeft = th.indexOf(left) + 1;
      left = tableRef.current!.querySelector('col:nth-of-type(' + indexLeft + ')')!;
      wLeft = parseFloat(left.style.width);
      table = tableRef.current!.querySelector('table')!;
      wTable = parseFloat(table!.style.width);
    }
    left = tableRef.current!.querySelector('col:nth-of-type(' + indexLeft + ')')!;
    const p = delta.x * 0.6;
    left.style.width = wLeft + p + 'px';
    left.style.minWidth = wLeft + p + 'px';
    table!.style.width = wTable + p + 'px';
  };
  return (
    <DndContext modifiers={[restrictToHorizontalAxis]} onDragMove={handleDragMove} onDragEnd={() => (left = undefined)}>
      {children}
    </DndContext>
  );
};
