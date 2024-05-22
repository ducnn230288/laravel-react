import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Check, Disable, Edit, Trash } from '@/assets/svg';
import { EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import { IDataTable, IForm } from '@/interfaces';
import { Avatar } from '@/library/avatar';
import { PopConfirm } from '@/library/pop-confirm';
import { ToolTip } from '@/library/tooltip';
import { SCode, SGlobal, SUser } from '@/services';
import { keyRole } from '@/utils';

export default {
  table: (): IDataTable[] => {
    const sGlobal = SGlobal();
    const { t } = useTranslation();
    const sUser = SUser();

    return [
      {
        title: `routes.admin.user.Full name`,
        name: 'name',
        tableItem: {
          filter: { type: ETableFilterType.search },
          width: 210,
          fixed: window.innerWidth > 767 ? 'left' : '',
          sorter: true,
          render: (text: string, item: any) => text && <Avatar src={item.avatar} text={item.name} />,
        },
      },
      {
        title: 'routes.admin.user.Position',
        name: 'positionCode',
        tableItem: {
          width: 200,
          filter: {
            type: ETableFilterType.checkbox,
            get: {
              facade: SCode,
              format: (item: any) => ({
                label: item.name,
                value: item.code,
              }),
              params: (fullTextSearch: string, value) => ({
                fullTextSearch,
                filter: { type: 'position' },
                extend: { code: value },
              }),
            },
          },
          sorter: true,
          render: (_, data) => data?.position?.name,
        },
      },
      {
        title: 'Email',
        name: 'email',
        tableItem: {
          filter: { type: ETableFilterType.search },
          sorter: true,
        },
      },
      {
        title: 'routes.admin.user.Phone Number',
        name: 'phoneNumber',
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
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_UPDATE) && (
                <ToolTip title={t(data.isDisable ? 'components.datatable.Disabled' : 'components.datatable.Enabled')}>
                  <PopConfirm
                    title={t(
                      !data.isDisable
                        ? 'components.datatable.areYouSureWantDisable'
                        : 'components.datatable.areYouSureWantEnable',
                    )}
                    onConfirm={() => sUser.put({ id: data.id, isDisable: !data.isDisable })}
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
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_UPDATE) && (
                <ToolTip title={t('routes.admin.Layout.Edit')}>
                  <button
                    title={t('routes.admin.Layout.Edit') || ''}
                    onClick={() => sUser.getById({ id: data.id, params: { include: 'position' } })}
                  >
                    <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                  </button>
                </ToolTip>
              )}

              {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_DESTROY) && (
                <ToolTip title={t('routes.admin.Layout.Delete')}>
                  <PopConfirm title={t('components.datatable.areYouSureWant')} onConfirm={() => sUser.delete(data.id)}>
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
    const { t } = useTranslation();
    const sUser = SUser();

    return [
      {
        title: 'routes.admin.user.Full name',
        name: 'name',
        formItem: {
          rules: [{ type: EFormRuleType.required }],
        },
      },
      {
        title: 'Email',
        name: 'email',
        formItem: {
          rules: [
            { type: EFormRuleType.required },
            { type: EFormRuleType.email },
            { type: EFormRuleType.min, value: 6 },
          ],
        },
      },
      {
        title: 'columns.auth.login.password',
        name: 'password',
        formItem: {
          type: EFormType.password,
          condition: (value: string, form, index: number, values: any) => !values?.id,
          rules: [{ type: EFormRuleType.required }],
        },
      },
      {
        title: 'columns.auth.register.retypedPassword',
        name: 'passwordConfirmation',
        formItem: {
          placeholder: 'columns.auth.register.retypedPassword',
          type: EFormType.password,
          condition: (value: string, form, index: number, values) => !values?.id,
          rules: [
            { type: EFormRuleType.required },
            { type: EFormRuleType.min, value: 8 },
            {
              type: EFormRuleType.custom,
              validator: ({ getFieldValue }) => ({
                validator(rule, value: string) {
                  if (!value || (getFieldValue('password') === value && value.length >= 8)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t('components.form.ruleConfirmPassword'));
                },
              }),
            },
          ],
        },
      },
      {
        title: 'Số điện thoại',
        name: 'phoneNumber',
        formItem: {
          rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.phone, min: 10, max: 15 }],
        },
      },
      {
        title: 'routes.admin.user.Date of birth',
        name: 'dob',
        formItem: {
          type: EFormType.date,
          rules: [{ type: EFormRuleType.required }],
          disabledDate: (current) => {
            return current && current >= dayjs().startOf('day');
          },
        },
      },
      {
        title: 'routes.admin.user.Position',
        name: 'positionCode',
        formItem: {
          type: EFormType.select,
          rules: [{ type: EFormRuleType.required }],
          get: {
            facade: SCode,
            params: (fullTextSearch: string) => ({
              fullTextSearch,
              typeCode: 'position',
            }),
            format: (item) => ({
              label: item.name,
              value: item.code,
            }),
            data: () => sUser.data?.position,
          },
        },
      },
      {
        title: 'routes.admin.user.Description',
        name: 'description',
        formItem: {
          type: EFormType.textarea,
        },
      },
      {
        name: 'avatar',
        title: 'routes.admin.user.Upload avatar',
        formItem: {
          type: EFormType.upload,
        },
      },
    ];
  },
};
