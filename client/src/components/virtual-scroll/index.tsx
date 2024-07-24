import { Scrollbar } from '@/components/scrollbar';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export const CVirtualScroll = ({
  onYReachStart,
  containerRef,
  id,
  className,
  listData,
  renderItem,
  firstItem,
}: {
  id?: string;
  className?: string;
  onYReachStart?: (container: HTMLElement) => void;
  containerRef?: (container: HTMLElement) => void;
  listData?: any[];
  renderItem?: (msg: any, i: number) => any;
  firstItem?: any;
}) => {
  const parentRef = useRef<any>();

  const virtualizer = useVirtualizer({
    count: listData?.length ?? 0, // 80000
    getScrollElement: () => parentRef.current || document.body,
    estimateSize: () => 35,
  });
  const items = virtualizer.getVirtualItems();

  const handleContainerRef = (ref: any) => {
    parentRef.current = ref;
    containerRef?.(ref);
  };
  const renderItems = items.map(virtualRow => (
    <div key={virtualRow.key} data-index={virtualRow.index} ref={virtualizer.measureElement}>
      {listData && renderItem?.(listData[virtualRow.index], virtualRow.index)}
    </div>
  ));
  return (
    <Scrollbar id={id} className={className} onYReachStart={onYReachStart} containerRef={handleContainerRef}>
      {firstItem}
      <div className='c-virtual-scroll' style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <div style={{ transform: `translateY(${items[0]?.start ?? 0}px)` }}>{renderItems}</div>
      </div>
    </Scrollbar>
  );
};
