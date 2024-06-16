import React, { forwardRef, useImperativeHandle, type PropsWithChildren, type Ref, useEffect } from 'react';
import { Modal as AntModal, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button } from '../button';

export const Modal = forwardRef(
  (
    {
      facade,
      keyState = 'isVisible',
      title,
      widthModal = 9999,
      onOk,
      firstChange = true,
      textSubmit = 'Save',
      textCancel = 'Cancel',
      className = '',
      footerCustom,
      children,
      name = 'create',
    }: PropsWithChildren<{
      facade: any;
      keyState?: string;
      title?: (data: any) => string;
      widthModal?: number;
      onOk?: () => any;
      onCancel?: () => void;
      firstChange?: boolean;
      textSubmit?: string;
      textCancel?: string;
      className?: string;
      footerCustom?: (handleOk: () => Promise<void>, handleCancel: () => void) => JSX.Element[] | JSX.Element;
      name?: string;
    }>,
    ref: Ref<{ handleCancel: () => void }>,
  ) => {
    useImperativeHandle(ref, () => ({ handleCancel }));
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isLoading, ...state } = facade;
    const { t } = useTranslation('locale', { keyPrefix: 'library' });
    const handleCancel = () => facade.set({ [keyState]: false });
    const handleOk = async () => {
      if (onOk) onOk();
      else handleCancel();
    };

    useEffect(() => {
      if (searchParams.get('modal') === 'create') facade.set({ [keyState]: true, isLoading: false });
      else facade.getById({ id: searchParams.get('modal') });
    }, []);

    useEffect(() => {
      if (name) {
        if (facade[keyState] && !searchParams.has('modal')) {
          setSearchParams(params => {
            params.set('modal', name);
            return params;
          });
        } else if (searchParams.has('modal')) {
          setSearchParams(params => {
            params.delete('modal');
            return params;
          });
        }
      }
    }, [facade[keyState]]);

    return (
      <AntModal
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        width={widthModal}
        title={title && <h3 className='text-lg font-bold'>{title(data)}</h3>}
        open={state[keyState]}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={className}
        footer={
          !!onOk &&
          ((footerCustom && footerCustom(handleOk, handleCancel)) || (
            <div className='flex justify-end gap-2'>
              <Button
                text={typeof textCancel === 'string' ? t(textCancel) : textCancel}
                className='!bg-white !text-teal-900'
                onClick={handleCancel}
              />
              <Button
                isLoading={isLoading}
                text={typeof textCancel === 'string' ? t(textSubmit) : textSubmit}
                className='!bg-teal-900'
                disabled={!firstChange}
                onClick={handleOk}
              />
            </div>
          ))
        }
      >
        <Spin spinning={isLoading}>{children}</Spin>
      </AntModal>
    );
  },
);
Modal.displayName = 'HookModal';
