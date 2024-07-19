import { useTranslation } from 'react-i18next';
import slug from 'slug';

import { EFormRuleType, EFormType, ETableFilterType } from '@/enums';
import type { IDataTable, IForm } from '@/types';

export default {
  useTable: (): IDataTable[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });

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
          isDateTime: true,
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
