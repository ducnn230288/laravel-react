import React, { type PropsWithChildren } from 'react';
import { Tooltip } from 'antd';
import type { RenderFunction } from 'antd/es/_util/getRenderPropValue';
import type { TooltipPlacement } from 'antd/es/tooltip';

export const CTooltip = ({
  children,
  title,
  placement,
}: PropsWithChildren<{
  title: React.ReactNode | RenderFunction;
  placement?: TooltipPlacement;
}>) => {
  return (
    <Tooltip title={title} placement={placement} destroyTooltipOnHide={true}>
      {children}
    </Tooltip>
  );
};
CTooltip.displayName = 'Tooltip';
