import { Form, type FormInstance, Spin } from 'antd';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { EFormType } from '@/enums';
import { SGlobal } from '@/services';
import type { IForm } from '@/types';
import { convertFormValue } from '@/utils';

import { CButton } from '../button';
import { generateForm } from './generate-form';

export const CForm = ({
  className,
  columns,
  textSubmit,
  textCancel,
  handSubmit,
  handCancel,
  values = {},
  widthLabel,
  checkHidden = false,
  extendForm,
  extendButton,
  disableSubmit = false,
  spinning = false,
  formAnt,
}: Type) => {
  const [forms] = Form.useForm();
  const form = formAnt || forms;
  useEffect(() => {
    if (form) {
      form.resetFields();
      form.setFieldsValue(convertFormValue(columns, values, false));
    }
  }, [values]);

  const { t } = useTranslation('locale', { keyPrefix: 'library' });
  const sGlobal = SGlobal();

  const handFinish = (values: any) => {
    values = convertFormValue(columns, values);
    handSubmit && handSubmit(values);
  };

  const timeout = useRef<any>();
  return (
    <Spin spinning={spinning}>
      <Form
        scrollToFirstError={true}
        requiredMark={true}
        className={classNames(className)}
        form={form}
        layout={!widthLabel ? 'vertical' : 'horizontal'}
        onFinishFailed={failed =>
          failed?.errorFields?.length && form?.scrollToField(failed?.errorFields[0].name, { behavior: 'smooth' })
        }
        onFinish={handFinish}
        onValuesChange={async objValue => {
          if (form && checkHidden) {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(async () => {
              for (const key in objValue) {
                if (Object.hasOwn(objValue, key)) columns.filter((_item: any) => _item.name === key);
              }
            }, 500);
          }
        }}
      >
        <div>
          <div className={'grid grid-cols-12 gap-x-5'}>
            {columns
              .filter((item: any) => !!item && !!item.formItem)
              .map(
                (column: any, index: number) =>
                  (!column?.formItem?.condition ||
                    !!column?.formItem?.condition({ value: values[column.name], form, index, values })) && (
                    <div
                      className={classNames(
                        'col-span-12 type-' +
                          (column?.formItem?.type || EFormType.text) +
                          (' sm:col-span-' + (column?.formItem?.col ?? 12)) +
                          (' lg:col-span-' + (column?.formItem?.col ?? 12)),
                      )}
                      key={index + column.name}
                    >
                      {generateForm({
                        item: column,
                        index,
                        values,
                        form,
                        t,
                        widthLabel,
                        formatDate: sGlobal.formatDate!,
                      })}
                    </div>
                  ),
              )}
          </div>

          {extendForm?.(values)}
        </div>

        <div
          className={classNames('gap-7 flex sm:block mt-2', {
            'items-center sm:flex-row': handCancel && handSubmit,
            'md:inline-flex w-full justify-end': handSubmit,
            'sm:w-auto text-center items-center sm:flex-row flex-col': handSubmit && extendButton,
            '!w-full sm:inline-flex text-center justify-end items-center sm:flex-row':
              !handSubmit && (handCancel || extendButton),
          })}
        >
          {handCancel && (
            <CButton
              text={textCancel ?? t('Cancel')}
              className={'w-full justify-center !border-black sm:w-auto sm:min-w-32'}
              onClick={handCancel}
            />
          )}
          {extendButton?.(form)}
          {handSubmit && (
            <CButton
              text={textSubmit ?? t('Save')}
              onClick={() => form?.submit()}
              disabled={disableSubmit || spinning}
              className={'text-base-100 bg-primary hover:bg-primary/90 leading-4 w-full rounded-lg !h-12'}
            />
          )}
        </div>
      </Form>
    </Spin>
  );
};
interface Type {
  className?: string;
  columns: IForm[];
  textSubmit?: string;
  textCancel?: string;
  handSubmit?: (values: any) => void;
  handCancel?: () => void;
  values?: any;
  formAnt?: FormInstance;
  onFirstChange?: () => void;
  widthLabel?: string;
  checkHidden?: boolean;
  extendForm?: (values: any) => JSX.Element;
  extendButton?: (values: any) => JSX.Element;
  disableSubmit?: boolean;
  spinning?: boolean;
}
