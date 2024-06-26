import React, { useState, useEffect, useCallback } from 'react';
import { type FormInstance, Table, Transfer } from 'antd';

const Component = ({
  formItem,
  form,
  onChange,
  value,
  ...restProps
}: {
  formItem: any;
  form: FormInstance;
  onChange?: (e: any) => any;
  value?: any;
}) => {
  const [temp, setTemp] = useState<{ dataSource: any[]; targetKeys: any[] }>({ dataSource: [], targetKeys: [] });

  const initFunction = useCallback(async () => {
    const dataSource = await formItem.transfer.dataSource(value, form);
    const targetKeys = formItem.transfer.targetKeys(dataSource, form, value);
    setTemp({ dataSource, targetKeys });
    onChange?.(targetKeys);
  }, [form, formItem, onChange, value]);

  useEffect(() => {
    initFunction();
  }, [initFunction]);

  return (
    <Transfer
      {...restProps}
      showSearch
      showSelectAll={false}
      dataSource={temp.dataSource}
      targetKeys={temp.targetKeys}
      onChange={targetKeys => {
        setTemp(pre => ({ ...pre, targetKeys }));
        onChange?.(targetKeys);
      }}
    >
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? formItem.transfer.leftColumns : formItem.transfer.rightColumns;

        return (
          <Table
            rowSelection={{
              getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
              selectedRowKeys: listSelectedKeys,
              onSelectAll(selected, selectedRows) {
                const treeSelectedKeys: any = selectedRows.filter(item => !item.disabled).map(({ key }) => key);
                const diffKeys = selected
                  ? treeSelectedKeys
                      .filter((x: any) => !listSelectedKeys.includes(x))
                      .concat(listSelectedKeys.filter(x => !treeSelectedKeys.includes(x)))
                  : listSelectedKeys
                      .filter(x => !treeSelectedKeys.includes(x))
                      .concat(treeSelectedKeys.filter((x: any) => !listSelectedKeys.includes(x)));
                onItemSelectAll(diffKeys, selected);
              },
              onSelect({ key }: any, selected) {
                onItemSelect(key, selected);
              },
            }}
            columns={columns}
            dataSource={filteredItems}
            size='small'
            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
            onRow={({ key, disabled: itemDisabled }: any) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};
export default Component;
