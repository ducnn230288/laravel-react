import React, { Fragment, useState } from 'react';
import { Form, Checkbox, type FormInstance } from 'antd';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import type { IForm } from '@/types';
import { CSvgIcon } from '../../svg-icon';
import { CButton } from '../../button';

const Component = ({
  name,
  column = [],
  textAdd = 'Thêm dòng',
  onAdd = () => null,
  generateForm,
  form,
  isTable = true,
  showRemove = () => true,
  idCheck,
}: Type) => {
  const [temp, setTemp] = useState<{ indeterminate: boolean; checkAll: boolean; checkedList: any[] }>({
    indeterminate: false,
    checkAll: false,
    checkedList: [],
  });
  const onCheckAllChange = (e: any) => {
    const array = form.getFieldValue(name).map((item: any) => {
      item[idCheck + 'Checked'] = e.target.checked;
      return item;
    });
    setTemp({
      indeterminate: false,
      checkAll: e.target.checked,
      checkedList: e.target.checked ? array.map((item: any) => item[idCheck]) : [],
    });

    form.setFieldValue(name, array);
  };
  const onCheckChange = (e: any, array: any[], index: number) => {
    if (e.target.checked) {
      temp.checkedList.push(array[index][idCheck]);
      setTemp({
        indeterminate: array.length !== temp.checkedList.length,
        checkAll: array.length === temp.checkedList.length,
        checkedList: temp.checkedList,
      });
    } else {
      temp.checkedList.splice(temp.checkedList.indexOf(array[index][idCheck]), 1);
      setTemp({ indeterminate: temp.checkedList.length !== 0, checkAll: false, checkedList: temp.checkedList });
    }
    array[index][idCheck + 'Checked'] = e.target.checked;
    if (form.setFieldValue) {
      form.setFieldValue(name, array);
    }
  };
  const { t } = useTranslation('locale', { keyPrefix: 'library' });

  return (
    <Form.List name={name!}>
      {(fields, { add, remove }) =>
        isTable ? (
          <Fragment>
            <div className={'table w-full border-collapse'} style={{ minWidth: column.length * 150 }}>
              <div className='table-row'>
                {!!idCheck && (
                  <div className={'table-cell w-10 p-1 text-center font-bold'}>
                    <Checkbox indeterminate={temp.indeterminate} onChange={onCheckAllChange} checked={temp.checkAll} />
                  </div>
                )}
                <div className={'table-cell w-10 border bg-gray-300 p-1 text-center font-bold'}>STT</div>
                {column.map((col: any, index: number) => (
                  <div
                    key={index}
                    className={classNames('table-cell border bg-gray-300 font-bold p-1 text-center', {
                      'w-full': column.length === 1,
                      'w-1/2': column.length === 2,
                      'w-1/3': column.length === 3,
                      'w-1/4': column.length === 4,
                      'w-1/5': column.length === 5,
                      'w-1/6': column.length === 6,
                    })}
                  >
                    {col.title}
                  </div>
                ))}
                <div className={'h-1 w-8'} />
              </div>
              {fields.map(({ name: n }, i) => (
                <div className='table-row' key={i}>
                  {!!idCheck && (
                    <div className={'table-cell text-center'}>
                      <Checkbox
                        onChange={e => onCheckChange(e, form.getFieldValue(name), n)}
                        checked={temp.checkedList.indexOf(form.getFieldValue(name)[n][idCheck] ?? '') > -1}
                      />
                    </div>
                  )}
                  <div className={'table-cell border bg-base-200 text-center'}>{i + 1}</div>
                  {column.map((col: any, index: number) => (
                    <div className={'relative table-cell border'} key={index}>
                      {generateForm({ item: col, index: index + '_' + i, showLabel: false, name: [n, col.name], t })}
                    </div>
                  ))}
                  <div className={'table-cell w-8 align-middle sm:w-8'}>
                    {showRemove(form.getFieldValue([[name], n]), n) && (
                      <CSvgIcon
                        name='trash'
                        size={32}
                        className='cursor-pointer fill-error hover:fill-error/50'
                        onClick={() => {
                          remove(n);
                          onAdd(form.getFieldValue(name), form);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className={'flex justify-end'}>
              <CButton
                onClick={() => {
                  add();
                  onAdd(form.getFieldValue(name), form);
                }}
                icon={<CSvgIcon name='plus' size={20} />}
                text={textAdd}
              />
            </div>
          </Fragment>
        ) : (
          <div>
            {fields.map(({ name: n }, i) => (
              <div className={'grid grid-cols-12 gap-x-5'} key={i}>
                {column.map((col: any, index: number) => (
                  <div
                    className={classNames(
                      col?.formItem?.classItem,
                      'col-span-12' +
                        (' sm:col-span-' +
                          (col?.formItem?.colTablet ? col?.formItem?.colTablet : col?.formItem?.col ?? 12)) +
                        (' lg:col-span-' + (col?.formItem?.col ? col?.formItem?.col : 12)),
                    )}
                    key={'addable' + index}
                  >
                    {generateForm({ item: col, index: index + '_' + i, name: [n, col.name], t })}
                  </div>
                ))}
                <div className={'table-cell w-8 align-middle'}>
                  {showRemove(form.getFieldValue([[name], n]), n) && (
                    <CSvgIcon
                      name='trash'
                      size={32}
                      className='cursor-pointer fill-error hover:fill-error/50'
                      onClick={() => {
                        remove(n);
                        onAdd(form.getFieldValue(name), form);
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            <div className={'flex justify-end'}>
              <CButton
                icon={<CSvgIcon name='plus' size={20} />}
                text={textAdd}
                onClick={() => {
                  add();
                  onAdd(form.getFieldValue(name), form);
                }}
              />
            </div>
          </div>
        )
      }
    </Form.List>
  );
};
interface Type {
  name?: string;
  column?: IForm[];
  textAdd?: string;
  onAdd?: (values: any, form: FormInstance) => void;
  generateForm: any;
  form: FormInstance;
  isTable?: boolean;
  showRemove: any;
  idCheck: any;
}
export default Component;
