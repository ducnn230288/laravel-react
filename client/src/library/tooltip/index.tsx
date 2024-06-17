import React, { type PropsWithChildren } from 'react';
import { Tooltip } from 'antd';
import { RenderFunction } from 'antd/lib/_util/getRenderPropValue';
import { TooltipPlacement } from 'antd/lib/tooltip';

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
