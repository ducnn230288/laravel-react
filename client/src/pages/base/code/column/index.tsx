import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import slug from 'slug';
import { Popconfirm } from 'antd';

import { EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import { IDataTable, IForm } from '@/interfaces';

import { Check, Disable, Edit, Trash } from '@/assets/svg';
import { ToolTip } from '@/library/tooltip';
import { SCode, SGlobal } from '@/services';
import { keyRole } from '@/utils';

export default {
  useTable: (): IDataTable[] => {
    const sGlobal = SGlobal();
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
    const sCode = SCode();

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
          render: (text) => (
            <ToolTip title={dayjs(text).format(sGlobal.formatDate + ' HH:mm:ss')}>
              {dayjs(text).format(sGlobal.formatDate)}
            </ToolTip>
          ),
        },
      },
      {
        title: t('Action'),
        tableItem: {
          width: 100,
          align: ETableAlign.center,
          render: (text: string, data) => (
            <div className={'flex gap-2'}>
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_CODE_UPDATE) && (
                <ToolTip title={t(data.isDisable ? 'Disabled code' : 'Enabled code', { name: data.name })}>
                  <Popconfirm
                    title={t(!data.isDisable ? 'Are you sure want disable code?' : 'Are you sure want enable code?', {
                      name: data.name,
                    })}
                    onConfirm={() => sCode.put({ id: data.code, isDisable: !data.isDisable })}
                  >
                    <button title={t(data.isDisable ? 'Disabled code' : 'Enabled code', { name: data.name })}>
                      {data.isDisable ? (
                        <Disable className="icon-cud bg-yellow-700 hover:bg-yellow-500" />
                      ) : (
                        <Check className="icon-cud bg-green-600 hover:bg-green-400" />
                      )}
                    </button>
                  </Popconfirm>
                </ToolTip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_CODE_UPDATE) && (
                <ToolTip title={t('Edit Code', { name: data.name })}>
                  <button title={t('Edit Code', { name: data.name })} onClick={() => sCode.getById({ id: data.code })}>
                    <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                  </button>
                </ToolTip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_CODE_DESTROY) && (
                <Popconfirm
                  title={t('Are you sure want delete code?', { name: data.name })}
                  onConfirm={() => sCode.delete(data.code)}
                >
                  <ToolTip title={t('Delete code', { name: data.name })}>
                    <button title={t('Delete code', { name: data.name })}>
                      <Trash className="icon-cud bg-red-600 hover:bg-red-400" />
                    </button>
                  </ToolTip>
                </Popconfirm>
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
          condition: (_: string, form, __: number, values: any) => !values?.id,
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
