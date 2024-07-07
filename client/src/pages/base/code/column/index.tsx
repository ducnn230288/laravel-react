import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import slug from 'slug';

import { EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import type { IDataTable, IForm } from '@/types';

import { CSvgIcon } from '@/library/svg-icon';
import { CTooltip } from '@/library/tooltip';
import { SCrud, SGlobal } from '@/services';
import type { IMCode, IMCodeType } from '@/types/model';
import { KEY_ROLE } from '@/utils';

export default {
  useTable: (): IDataTable[] => {
    const sGlobal = SGlobal();
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
    const sCrud = new SCrud<IMCode, IMCodeType>('Code', 'CodeType');

    return [
      {
        title: t('Code'),
        name: 'code',
        tableItem: {
          width: 100,
          filter: { type: ETableFilterType.search },
          sorter: true,
        },
      },
      {
        title: t('Name Code'),
        name: 'name',
        tableItem: {
          filter: { type: ETableFilterType.search },
          sorter: true,
        },
      },
      {
        title: t('Created At'),
        name: 'createdAt',
        tableItem: {
          width: 120,
          filter: { type: ETableFilterType.date },
          sorter: true,
          render: text => (
            <CTooltip title={dayjs(text).format(sGlobal.formatDate + ' HH:mm:ss')}>
              {dayjs(text).format(sGlobal.formatDate)}
            </CTooltip>
          ),
        },
      },
      {
        title: t('Action'),
        tableItem: {
          width: 100,
          align: ETableAlign.center,
          render: (_: string, data) => (
            <div className={'action'}>
              {sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_UPDATE) && (
                <CTooltip title={t(data.isDisable ? 'Disabled code' : 'Enabled code', { name: data.name })}>
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t(!data.isDisable ? 'Are you sure want disable code?' : 'Are you sure want enable code?', {
                      name: data.name,
                    })}
                    onConfirm={() => sCrud.put({ id: data.code, isDisable: !data.isDisable })}
                  >
                    <button title={t(data.isDisable ? 'Disabled code' : 'Enabled code', { name: data.name })}>
                      {data.isDisable ? (
                        <CSvgIcon name='disable' className='warning' />
                      ) : (
                        <CSvgIcon name='check' className='success' />
                      )}
                    </button>
                  </Popconfirm>
                </CTooltip>
              )}
              {sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_UPDATE) && (
                <CTooltip title={t('Edit Code', { name: data.name })}>
                  <button title={t('Edit Code', { name: data.name })} onClick={() => sCrud.getById({ id: data.code })}>
                    <CSvgIcon name='edit' className='primary' />
                  </button>
                </CTooltip>
              )}
              {sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_DESTROY) && (
                <CTooltip title={t('Delete code', { name: data.name })}>
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t('Are you sure want delete code?', { name: data.name })}
                    onConfirm={() => sCrud.delete(data.code)}
                  >
                    <button title={t('Delete code', { name: data.name })}>
                      <CSvgIcon name='trash' className='error' />
                    </button>
                  </Popconfirm>
                </CTooltip>
              )}
            </div>
          ),
        },
      },
    ];
  },
  useForm: (): IForm[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
    return [
      {
        title: t('Name Code'),
        name: 'name',
        formItem: {
          rules: [{ type: EFormRuleType.required }],
          onBlur: (value, form) => {
            if (value && !form.getFieldValue('code')) {
              form.setFieldValue('code', slug(value).toUpperCase());
            }
          },
        },
      },
      {
        title: t('Code'),
        name: 'code',
        formItem: {
          condition: ({ values }) => !values?.id,
          rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.max, value: 100 }],
        },
      },
      {
        title: t('Description code'),
        name: 'description',
        formItem: {
          type: EFormType.textarea,
        },
      },
    ];
  },
};
