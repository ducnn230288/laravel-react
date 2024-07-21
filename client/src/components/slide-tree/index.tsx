import { Popconfirm, Spin, Tree, TreeSelect } from 'antd';
import { useTranslation } from 'react-i18next';

import { CButton } from '@/components/button';
import { Scrollbar } from '@/components/scrollbar';
import { CSvgIcon } from '@/components/svg-icon';
import { CTooltip } from '@/components/tooltip';
import { mapTreeObject } from '@/utils';

export const CSideTree = ({
  isLoading,
  listData,
  label,
  value,
  onAdd,
  onEdit,
  onDelete,
  onSelect,
}: {
  isLoading?: boolean;
  listData?: any;
  label: string;
  value: string;
  onAdd?: any;
  onEdit?: any;
  onDelete?: any;
  onSelect?: any;
}) => {
  const { t } = useTranslation('locale', { keyPrefix: 'library' });

  const titleRender = data => (
    <span className={'item'}>
      {data.title}
      <div className='action'>
        {!!onEdit && (
          <CTooltip title={t('Edit', { name: data.title, label: label.toLowerCase() })}>
            <button
              title={t('Edit', { name: data.title, label: label.toLowerCase() })}
              onClick={() => onEdit({ id: data.key })}
            >
              <CSvgIcon name='edit' className='primary' />
            </button>
          </CTooltip>
        )}
        {onDelete && (
          <CTooltip title={t('Delete', { name: data.title, label: label.toLowerCase() })}>
            <Popconfirm
              destroyTooltipOnHide={true}
              title={t('Are you sure want delete?', {
                name: data.title,
                label: label.toLowerCase(),
              })}
              onConfirm={() => onDelete(data.key)}
            >
              <button title={t('Delete', { name: data.title, label: label.toLowerCase() })}>
                <CSvgIcon name='trash' className='error' />
              </button>
            </Popconfirm>
          </CTooltip>
        )}
      </div>
    </span>
  );

  return (
    <div className='card'>
      <div className='header'>
        <h3>{label}</h3>
        {!!onAdd && (
          <CButton
            icon={<CSvgIcon name='plus' size={12} />}
            onClick={() => onAdd({ dataType: undefined, isVisibleType: true })}
          />
        )}
      </div>
      <Spin spinning={isLoading}>
        <div className='desktop'>
          {listData && (
            <Scrollbar>
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<CSvgIcon name='arrow' size={12} />}
                defaultSelectedKeys={[value]}
                treeData={listData?.map(mapTreeObject)}
                onSelect={selectedKeys => selectedKeys[0] && !!onSelect && onSelect(selectedKeys[0])}
                titleRender={titleRender}
              />
            </Scrollbar>
          )}
        </div>
        <div className='mobile'>
          <TreeSelect
            treeLine
            switcherIcon={<CSvgIcon name='arrow' size={12} />}
            value={value}
            className={'w-full'}
            treeData={listData?.map(mapTreeObject)}
            onChange={e => e && !!onSelect && onSelect(e)}
          />
        </div>
      </Spin>
    </div>
  );
};
