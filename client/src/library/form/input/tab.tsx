// @ts-nocheck
import React from 'react';
import { Form, Tabs } from 'antd';
import classNames from 'classnames';

import { IForm } from '@/interfaces';

const Component = ({
  name,
  column = [],
  generateForm,
  list,
}: {
  name?: string;
  column?: IForm[];
  generateForm: any;
  list: any;
}) => {
  return (
    <Form.List name={name}>
      {(fields) => (
        <Tabs
          destroyInactiveTabPane={true}
          items={fields.map(({ name: n }, i) => ({
            label: list[i].label,
            key: i,
            children: (
              <div className={'grid grid-cols-12 gap-x-5'}>
                {column.map((col: any, index: number) => (
                  <div
                    className={classNames(
                      col?.formItem?.classItem,
                      'col-span-12' +
                        (' sm:col-span-' +
                          (col?.formItem?.colTablet
                            ? col?.formItem?.colTablet
                            : col?.formItem?.col
                              ? col?.formItem?.col
                              : 12)) +
                        (' lg:col-span-' + (col?.formItem?.col ? col?.formItem?.col : 12)),
                    )}
                    key={index}
                  >
                    {generateForm(col, index + '_' + i, true, [n, col.name])}
                  </div>
                ))}
              </div>
            ),
          }))}
        ></Tabs>
      )}
    </Form.List>
  );
};
export default Component;