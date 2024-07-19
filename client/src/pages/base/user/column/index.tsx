import { useTranslation } from 'react-i18next';

import { EFormRuleType, EFormType, ETableFilterType } from '@/enums';
import { CAvatar } from '@/library/avatar';
import { SCrud } from '@/services';
import type { IDataTable, IForm } from '@/types';
import type { IMUser, IMUserRole } from '@/types/model';

export default {
  useTable: (): IDataTable[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });

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
              keyApi: 'Code',
              format: (item: any) => ({
                label: item.name,
                value: item.code,
              }),
              params: (fullTextSearch: string, value) => ({
                fullTextSearch,
                typeCode: 'POSITION',
                extend: value && [value.map(item => ['code', item])],
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
          isDateTime: true,
        },
      },
    ];
  },
  useForm: (): IForm[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
    const sCrud = SCrud<IMUser, IMUserRole>('User', 'UserRole');

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
            keyApi: 'Code',
            params: (fullTextSearch: string, value) => ({
              fullTextSearch,
              typeCode: 'position',
              extend: value('positionCode') && [['code', value('positionCode')]],
            }),
            format: item => ({
              label: item.name,
              value: item.code,
            }),
            data: () => sCrud.data?.position,
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
