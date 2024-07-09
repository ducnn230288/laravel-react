import { Scrollbar } from '@/library/scrollbar';
import { Drawer, Form } from 'antd';
import classNames from 'classnames';
import { forwardRef, useImperativeHandle, type Ref } from 'react';
import { useTranslation } from 'react-i18next';

import type { IForm, IFormModalRefObject } from '@/types';
import { convertFormValue } from '@/utils';
import { CButton } from '../button';
import { CForm } from '../form';

export const CDrawerForm = forwardRef(
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
    const [form] = Form.useForm();

    return (
      <Drawer
        keyboard={false}
        size={size}
        footer={
          <div className={classNames('gap-3 flex mt-2 items-center sm:flex-row justify-end')}>
            <CButton
              text={typeof textCancel === 'string' ? t(textCancel) : textCancel}
              className={'w-full sm:w-auto sm:min-w-36 !bg-base-200 !text-base-content hover:!bg-base-200/60'}
              onClick={() => facade.set({ [keyData]: undefined, [keyState]: false })}
            />
            <CButton
              text={typeof textCancel === 'string' ? t(textSubmit) : textSubmit}
              onClick={async () => onSubmit(convertFormValue(columns, await form.validateFields()))}
              disabled={facade[keyIsLoading]}
              className={'w-full sm:w-auto sm:min-w-48'}
            />
          </div>
        }
        title={<h3>{title}</h3>}
        open={facade[keyState]}
        onClose={() => facade.set({ [keyData]: undefined, [keyState]: false })}
        closeIcon={null}
        destroyOnClose={true}
      >
        <Scrollbar>
          <CForm
            className='intro-x'
            values={{ ...facade[keyData] }}
            formAnt={form}
            columns={columns}
            spinning={facade[keyIsLoading]}
          />
        </Scrollbar>
      </Drawer>
    );
  },
);
CDrawerForm.displayName = 'CDrawerForm';
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
