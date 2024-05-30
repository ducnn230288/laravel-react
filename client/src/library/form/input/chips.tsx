import React, { Fragment, useEffect, useRef, useState } from 'react';
import { TweenOneGroup } from 'rc-tween-one';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';

import { Plus, Times } from '@/assets/svg';
import { ITableItemFilterList } from '@/interfaces';
import { reorderArray } from '@/utils';

import { Button } from '../../button';
import { Mask, Select } from './index';

const Component = ({
  onChange,
  value = [],
  list,
  placeholder,
  disabled,
}: {
  onChange?: (values: any[]) => void;
  value?: string[];
  list?: ITableItemFilterList[];
  placeholder: string;
  disabled?: boolean;
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<any>(null);
  useEffect(() => {
    if (inputVisible) {
      setTimeout(() => {
        inputRef.current && inputRef.current.input.focus();
      });
    }
  }, [inputVisible]);

  const handleClose = (removedTag: any) => {
    onChange && onChange(value.filter((tag) => tag !== removedTag));
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputConfirm = (inputValue: string | string[]) => {
    if (typeof inputValue === 'string' && inputValue && value.indexOf(inputValue) === -1) {
      onChange && onChange([...value, inputValue]);
    } else if (typeof inputValue === 'object') {
      onChange && onChange([...value, ...inputValue.filter((i) => value.indexOf(i) === -1)]);
    }

    !list && setInputVisible(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    if (active.id !== over.id) {
      const oldIndex = value.findIndex((item) => item === active.id);
      const newIndex = value.findIndex((item) => item === over.id);
      onChange && onChange(reorderArray(value, oldIndex, newIndex));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <Fragment>
      <TweenOneGroup
        appear={false}
        enter={{ scale: 0.8, opacity: 0, type: 'from', duration: 100 }}
        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
        onEnd={(e) => {
          if (e.type === 'appear' || e.type === 'enter') {
            (e.target as any).style = 'display: inline-block';
          }
        }}
        className={'flex flex-wrap gap-2.5 py-2'}
      >
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <SortableContext items={value} strategy={horizontalListSortingStrategy}>
            {value.map((tag) => (
              <DraggableTag
                disabled={!!disabled}
                tag={tag}
                key={tag}
                list={list}
                onClose={(e: any) => {
                  e.preventDefault();
                  handleClose(tag);
                }}
              />
            ))}
            {inputVisible ? (
              !list ? (
                <Mask
                  ref={inputRef}
                  className={'h-8'}
                  placeholder={placeholder}
                  onPressEnter={() => handleInputConfirm(inputRef.current?.input.value)}
                  disabled={!!disabled}
                />
              ) : (
                <Select
                  onChange={(value: any) => handleInputConfirm(value)}
                  onBlur={() => setInputVisible(false)}
                  disabled={!!disabled}
                  mode={'multiple'}
                  list={list.filter((i) => i.value && value.indexOf(i.value.toString()) === -1)}
                />
              )
            ) : (
              <Button
                icon={<Plus className="size-8 p-2" />}
                className="inline-block rounded-full border"
                onClick={showInput}
                disabled={disabled}
              />
            )}
          </SortableContext>
        </DndContext>
      </TweenOneGroup>
    </Fragment>
  );
};
export default Component;
const DraggableTag = ({
  tag,
  onClose,
  disabled,
  list,
}: {
  tag: string;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  list?: ITableItemFilterList[];
}) => {
  const { listeners, transform, transition, isDragging, setNodeRef } = useSortable({ id: tag });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, transition: isDragging ? 'unset' : transition }
    : {};

  return (
    <div
      className="relative inline-block cursor-move rounded-xl border bg-teal-100 px-2 py-1.5"
      style={style}
      ref={setNodeRef}
      {...listeners}
    >
      <Button
        icon={<Times className="size-4 p-1" />}
        className="absolute -right-2 -top-1.5 rounded-full"
        onClick={onClose}
        disabled={disabled}
      />
      {list ? list.filter((i) => i.value === tag)[0].label : tag}
    </div>
  );
};
