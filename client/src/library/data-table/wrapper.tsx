import React, { PropsWithChildren } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

export const CWrapper = ({ children, tableRef }: PropsWithChildren<{ tableRef: React.RefObject<HTMLDivElement> }>) => {
  let indexLeft: number;
  let left: any;
  let wLeft: number;
  let table: HTMLTableElement;
  let wTable: number;

  return (
    <DndContext
      modifiers={[restrictToHorizontalAxis]}
      onDragMove={({ activatorEvent, delta }) => {
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
      }}
      onDragEnd={() => (left = undefined)}
    >
      {children}
    </DndContext>
  );
};
