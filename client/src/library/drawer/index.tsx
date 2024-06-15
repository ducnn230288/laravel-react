import React, { forwardRef, Ref, useImperativeHandle } from 'react';
import { Drawer, Form as FormAnt } from 'antd';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { IForm, IFormModalRefObject } from '@/interfaces';
import { convertFormValue } from '@/utils';

import { Form } from '../form';
import { Button } from '../button';

export const DrawerForm = forwardRef(
  (
    {
      size,
      title,
      columns,
      textSubmit = 'Save',
      textCancel = 'Cancel',
      facade,
      keyState = 'isVisible',
      keyIsLoading = 'isLoading',
      keyData = 'data',
      onSubmit,
    }: Type,
    ref: Ref<IFormModalRefObject>,
  ) => {
    useImperativeHandle(ref, () => ({ form }));
    const { t } = useTranslation('locale', { keyPrefix: 'library' });
    const [form] = FormAnt.useForm();

    return (
      <Drawer
        keyboard={false}
        size={size}
        footer={
          <div className={classNames('gap-3 flex mt-2 items-center sm:flex-row justify-end')}>
            <Button
              text={typeof textCancel === 'string' ? t(textCancel) : textCancel}
              className={'w-full sm:w-auto sm:min-w-36'}
              onClick={() => facade.set({ [keyData]: undefined, [keyState]: false })}
            />
            <Button
              text={typeof textCancel === 'string' ? t(textSubmit) : textSubmit}
              onClick={async () => onSubmit(convertFormValue(columns, await form.validateFields()))}
              disabled={facade[keyIsLoading]}
              className={'w-full sm:w-auto sm:min-w-48 btn-primary'}
            />
          </div>
        }
        title={title}
        open={facade[keyState]}
        onClose={() => facade.set({ [keyData]: undefined, [keyState]: false })}
        closeIcon={null}
      >
        <Form
          className='intro-x'
          values={{ ...facade[keyData] }}
          formAnt={form}
          columns={columns}
          spinning={facade[keyIsLoading]}
        />
      </Drawer>
    );
  },
);
DrawerForm.displayName = 'DrawerForm';
interface Type {
  facade: any;
  size?: undefined | 'large';
  keyState?: string;
  keyIsLoading?: string;
  keyData?: string;
  title: string;
  columns: IForm[];
  textSubmit?: any;
  textCancel?: any;
  onSubmit: (value: any) => void;
}
