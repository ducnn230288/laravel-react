import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Popconfirm } from 'antd';

import { CSvgIcon } from '@/library/svg-icon';
import { EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import type { IDataTable, IForm } from '@/types';
import { CAvatar } from '@/library/avatar';
import { CTooltip } from '@/library/tooltip';
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
          render: (text: string, item: any) => text && <CAvatar src={item.avatar} text={item.name} />,
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
                fullTextSearch,
                typeCode: 'POSITION',
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
          width: 90,
          align: ETableAlign.center,
          render: (_: string, data) => (
            <div className={'action'}>
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_UPDATE) && (
                <CTooltip title={t(data.isDisable ? 'Disabled user' : 'Enabled user', { name: data.name })}>
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
                      {data.isDisable ? (
                        <CSvgIcon name='disable' className='warning' />
                      ) : (
                        <CSvgIcon name='check' className='success' />
                      )}
                    </button>
                  </Popconfirm>
                </CTooltip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_UPDATE) && (
                <CTooltip title={t('Edit User', { name: data.name })}>
                  <button
                    title={t('Edit User', { name: data.name })}
                    onClick={() => sUser.getById({ id: data.id, params: { include: 'position' } })}
                  >
                    <CSvgIcon name='edit' className='primary' />
                  </button>
                </CTooltip>
              )}

              {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_DESTROY) && (
                <CTooltip title={t('Delete user', { name: data.name })}>
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t('Are you sure want delete user?', { name: data.name })}
                    onConfirm={() => sUser.delete(data.id)}
                  >
                    <button title={t('Delete user', { name: data.name })}>
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
          condition: ({ values }) => !values?.id,
          rules: [{ type: EFormRuleType.required }],
        },
      },
      {
        title: t('Confirm Password'),
        name: 'passwordConfirmation',
        formItem: {
          type: EFormType.password,
          condition: ({ values }) => !values?.id,
          rules: [
            { type: EFormRuleType.required },
            { type: EFormRuleType.min, value: 8 },
            {
              type: EFormRuleType.custom,
              validator: ({ getFieldValue }) => ({
                validator(_, value: string) {
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
            format: item => ({
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
