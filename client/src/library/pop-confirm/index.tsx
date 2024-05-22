import React, { forwardRef, PropsWithChildren, Ref, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { Popconfirm } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import type { RenderFunction } from 'antd/es/_util/getRenderPropValue';

export const PopConfirm = forwardRef(
  (
    {
      children,
      title,
      onConfirm,
      placement,
    }: PropsWithChildren<{
      title: React.ReactNode | RenderFunction;
      onConfirm: (e?: React.MouseEvent<HTMLElement>) => void;
      placement?: TooltipPlacement;
    }>,
    ref: Ref<{ onConfirm: () => any }>,
  ) => {
    useImperativeHandle(ref, () => ({ onConfirm }));

    const { t } = useTranslation();
    return (
      <Popconfirm
        title={title}
        placement={placement}
        onConfirm={onConfirm}
        destroyTooltipOnHide={true}
        okText={t('components.datatable.ok')}
        cancelText={t('components.datatable.cancel')}
      >
        {children}
      </Popconfirm>
    );
  },
);
PopConfirm.displayName = 'PopConfirm';
