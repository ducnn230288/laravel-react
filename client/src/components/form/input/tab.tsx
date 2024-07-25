import { Form, type FormInstance, Tabs } from 'antd';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import type { IForm } from '@/types';

const Component = ({
  name,
  column = [],
  generateForm,
  list,
  form,
}: {
  name: string;
  column?: IForm[];
  generateForm: any;
  list: any;
  form: FormInstance;
}) => {
  const { t } = useTranslation('locale', { keyPrefix: 'library' });

  const render = (name: string, i: number) =>
    column.map((col: any, index: number) => (
      <div
        className={classNames(
          col?.formItem?.classItem,
          'col-span-12' +
            (' sm:col-span-' + (col?.formItem?.colTablet ? col?.formItem?.colTablet : col?.formItem?.col ?? 12)) +
            (' lg:col-span-' + (col?.formItem?.col ? col?.formItem?.col : 12)),
        )}
        key={'tabs' + index}
      >
        {generateForm({ item: col, index: index + '_' + i, name: [name, col.name], t, form })}
      </div>
    ));

  return (
    <Form.List name={name}>
      {(fields: any) => (
        <Tabs
          destroyInactiveTabPane={true}
          items={fields.map(({ name }, i) => ({
            label: list[i].label,
            key: i,
            children: <div className={'grid grid-cols-12 gap-x-5'}>{render(name, i)}</div>,
          }))}
        ></Tabs>
      )}
    </Form.List>
  );
};
export default Component;
