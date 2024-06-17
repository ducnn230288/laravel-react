import React, { forwardRef, type Ref, useImperativeHandle } from 'react';
import { Form as FormAnt } from 'antd';

import type { IForm, IFormModalRefObject } from '@/types';
import { convertFormValue } from '@/utils';
import { CForm } from '../../form';
import { CModal } from '../../modal';

export const CModalForm = forwardRef(
  (
    {
      title,
      widthModal = 1200,
      columns,
      textSubmit,
      textCancel,
      className = '',
      footerCustom,
      facade,
      keyState = 'isVisible',
      keyPost = 'post',
      keyPut = 'put',
      keyData = 'data',
    }: Type,
    ref: Ref<IFormModalRefObject>,
  ) => {
    useImperativeHandle(ref, () => ({ handleEdit, form }));
    const [form] = FormAnt.useForm();

    const handleEdit = async (item: { id?: string } = {}, isGet = true) => {
      if (item.id && isGet) facade.getById({ id: item.id, keyState });
      else facade.set({ [keyState]: true, [keyData]: item });
    };
    return (
      <CModal
        facade={facade}
        keyState={keyState}
        widthModal={widthModal}
        textSubmit={textSubmit}
        textCancel={textCancel}
        className={className}
        footerCustom={footerCustom}
        title={() => title(facade[keyData])}
        onOk={async () => {
          return form
            .validateFields()
            .then(async values => {
              values = convertFormValue(columns, values);
              if (facade[keyData]?.id) facade[keyPut]({ ...values, id: facade[keyData].id });
              else facade[keyPost]({ ...values });
              return true;
            })
            .catch(() => false);
        }}
      >
        <CForm values={{ ...facade[keyData] }} formAnt={form} columns={columns} />
      </CModal>
    );
  },
);
CModalForm.displayName = 'CModalForm';
interface Type {
  title: (data: any) => string;
  widthModal?: number;
  columns: IForm[];
  textSubmit?: string;
  textCancel?: string;
  className?: string;
  footerCustom?: (handleOk: () => Promise<any>, handleCancel: () => void) => JSX.Element[] | JSX.Element;
  facade?: any;
  keyState?: string;
  keyPost?: string;
  keyPut?: string;
  keyData?: string;
}
