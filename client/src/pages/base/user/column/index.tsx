import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Popconfirm } from 'antd';

import { Check, Disable, Edit, Trash } from '@/assets/svg';
import { EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import { IDataTable, IForm } from '@/interfaces';
import { Avatar } from '@/library/avatar';
import { ToolTip } from '@/library/tooltip';
import { SCode, SGlobal, SUser } from '@/services';
import { keyRole } from '@/utils';

export default {
  useTable: (): IDataTable[] => {
    const sGlobal = SGlobal();
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
    const sUser = SUser();

    return [
      {
        title: t('Full name'),
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
        title: t('Position'),
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
                // fullTextSearch,
                typeCode: 'POSITION',
                // extend: { code: value },
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
        title: t('Phone Number'),
        name: 'phoneNumber',
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
          width: 90,
          align: ETableAlign.center,
          render: (text: string, data) => (
            <div className={'action'}>
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_UPDATE) && (
                <ToolTip title={t(data.isDisable ? 'Disabled user' : 'Enabled user', { name: data.name })}>
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t(!data.isDisable ? 'Are you sure want disable user?' : 'Are you sure want enable user?', {
                      name: data.name,
                    })}
                    onConfirm={() => sUser.put({ id: data.id, isDisable: !data.isDisable })}
                  >
                    <button
                      title={t(data.isDisable ? 'Disabled user' : 'Enabled user', {
                        name: data.name,
                      })}
                    >
                      {data.isDisable ? <Disable className="warning" /> : <Check className="success" />}
                    </button>
                  </Popconfirm>
                </ToolTip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_UPDATE) && (
                <ToolTip title={t('Edit User', { name: data.name })}>
                  <button
                    title={t('Edit User', { name: data.name })}
                    onClick={() => sUser.getById({ id: data.id, params: { include: 'position' } })}
                  >
                    <Edit className="primary" />
                  </button>
                </ToolTip>
              )}

              {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_DESTROY) && (
                <ToolTip title={t('Delete user', { name: data.name })}>
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t('Are you sure want delete user?', { name: data.name })}
                    onConfirm={() => sUser.delete(data.id)}
                  >
                    <button title={t('Delete user', { name: data.name })}>
                      <Trash className="error" />
                    </button>
                  </Popconfirm>
                </ToolTip>
              )}
            </div>
          ),
        },
      },
    ];
  },
  useForm: (): IForm[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
    const sUser = SUser();

    return [
      {
        title: t('Full name'),
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
        title: t('Password'),
        name: 'password',
        formItem: {
          type: EFormType.password,
          condition: (value: string, form, index: number, values: any) => !values?.id,
          rules: [{ type: EFormRuleType.required }],
        },
      },
      {
        title: t('Confirm Password'),
        name: 'passwordConfirmation',
        formItem: {
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
                  return Promise.reject(new Error(t('Two passwords that you enter is inconsistent!')));
                },
              }),
            },
          ],
        },
      },
      {
        title: t('Phone Number'),
        name: 'phoneNumber',
        formItem: {
          rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.phone, min: 10, max: 15 }],
        },
      },
      {
        title: t('Date of birth'),
        name: 'dob',
        formItem: {
          type: EFormType.date,
          rules: [{ type: EFormRuleType.required }],
        },
      },
      {
        title: t('Position'),
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
        title: t('Description'),
        name: 'description',
        formItem: {
          type: EFormType.textarea,
        },
      },
      {
        title: t('Upload avatar'),
        name: 'avatar',
        formItem: {
          type: EFormType.upload,
        },
      },
    ];
  },
};
