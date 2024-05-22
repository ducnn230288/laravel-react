import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import slug from 'slug';

import { EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import { IDataTable, IForm } from '@/interfaces';

import { Check, Disable, Edit, Trash } from '@/assets/svg';
import { ToolTip } from '@/library/tooltip';
import { PopConfirm } from '@/library/pop-confirm';
import { SCode, SGlobal } from '@/services';
import { keyRole } from '@/utils';

export default {
  table: (): IDataTable[] => {
    const sGlobal = SGlobal();
    const { t } = useTranslation();
    const sCode = SCode();

    return [
      {
        title: 'titles.Code',
        name: 'code',
        tableItem: {
          width: 100,
          filter: { type: ETableFilterType.search },
          sorter: true,
        },
      },
      {
        title: 'routes.admin.Code.Name',
        name: 'name',
        tableItem: {
          filter: { type: ETableFilterType.search },
          sorter: true,
        },
      },
      {
        title: 'Created',
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
        title: 'routes.admin.user.Action',
        tableItem: {
          width: 100,
          align: ETableAlign.center,
          render: (text: string, data) => (
            <div className={'flex gap-2'}>
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_CODE_UPDATE) && (
                <ToolTip title={t(data.isDisable ? 'components.datatable.Disabled' : 'components.datatable.Enabled')}>
                  <PopConfirm
                    title={t(
                      !data.isDisable
                        ? 'components.datatable.areYouSureWantDisable'
                        : 'components.datatable.areYouSureWantEnable',
                    )}
                    onConfirm={() => sCode.put({ id: data.code, isDisable: !data.isDisable })}
                  >
                    <button
                      title={t(data.isDisable ? 'components.datatable.Disabled' : 'components.datatable.Enabled') || ''}
                    >
                      {data.isDisable ? (
                        <Disable className="icon-cud bg-yellow-700 hover:bg-yellow-500" />
                      ) : (
                        <Check className="icon-cud bg-green-600 hover:bg-green-400" />
                      )}
                    </button>
                  </PopConfirm>
                </ToolTip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_CODE_UPDATE) && (
                <ToolTip title={t('routes.admin.Layout.Edit')}>
                  <button title={t('routes.admin.Layout.Edit') || ''} onClick={() => sCode.getById({ id: data.code })}>
                    <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                  </button>
                </ToolTip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_CODE_DESTROY) && (
                <ToolTip title={t('routes.admin.Layout.Delete')}>
                  <PopConfirm
                    title={t('components.datatable.areYouSureWant')}
                    onConfirm={() => sCode.delete(data.code)}
                  >
                    <button title={t('routes.admin.Layout.Delete') || ''}>
                      <Trash className="icon-cud bg-red-600 hover:bg-red-400" />
                    </button>
                  </PopConfirm>
                </ToolTip>
              )}
            </div>
          ),
        },
      },
    ];
  },
  form: (): IForm[] => {
    return [
      {
        title: 'routes.admin.Code.Name',
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
        title: 'titles.Code',
        name: 'code',
        formItem: {
          condition: (_: string, form, __: number, values: any) => !values?.id,
          rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.max, value: 100 }],
        },
      },
      {
        title: 'routes.admin.user.Description',
        name: 'description',
        formItem: {
          type: EFormType.textarea,
        },
      },
    ];
  },
};
