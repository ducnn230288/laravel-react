import { useTranslation } from 'react-i18next';
import slug from 'slug';

import { EFormRuleType, EFormType, ETableFilterType } from '@/enums';
import { CAvatar } from '@/library/avatar';
import { SCrud } from '@/services';
import type { IDataTable, IForm } from '@/types';
import type { IMPost, IMPostType } from '@/types/model';
import { routerLinks } from '@/utils';

export default {
  useTable: (): IDataTable[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });

    return [
      {
        title: t('Name Post'),
        name: 'languages.name',
        tableItem: {
          filter: { type: ETableFilterType.search },
          sorter: true,
          render: (_: string, item: any) => (
            <CAvatar
              src={item.image}
              text={
                item.languages?.length
                  ? item.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng')).name
                  : ''
              }
            />
          ),
        },
      },
      {
        title: 'Slug',
        name: 'languages.slug',
        tableItem: {
          filter: { type: ETableFilterType.search },
          sorter: true,
          render: (_: string, item: any) =>
            item.languages?.length
              ? item.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng')).slug
              : '',
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
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
    const sCrud = SCrud<IMPost, IMPostType>('Post', 'PostType');

    return [
      {
        title: t('Created At'),
        name: 'createdAt',
        formItem: {
          col: 6,
          type: EFormType.date,
          rules: sCrud.data?.id ? [{ type: EFormRuleType.required }] : [],
        },
      },
      {
        title: t('Image'),
        name: 'image',
        formItem: {
          col: 6,
          type: EFormType.upload,
        },
      },
      {
        name: 'languages',
        title: '',
        formItem: {
          type: EFormType.tab,
          tab: 'language',
          list: [
            { label: t('English'), value: 'en' },
            { label: t('Vietnamese'), value: 'vn' },
          ],
          column: [
            { title: 'id', name: 'id', formItem: { type: EFormType.hidden } },
            {
              title: t('Name Post'),
              name: 'name',
              formItem: {
                col: 6,
                rules: [
                  { type: EFormRuleType.required },
                  {
                    type: EFormRuleType.api,
                    api: {
                      url: `${routerLinks('Post', 'api')}/valid`,
                      name: 'name',
                      label: t('Name Post'),
                      id: sCrud.data?.id,
                    },
                  },
                ],
                onBlur: (value, form, name) => {
                  if (value && !form.getFieldValue(['languages', name[0], 'slug'])) {
                    form.setFieldValue(['languages', name[0], 'slug'], slug(value));
                  }
                },
              },
            },
            {
              title: 'Slug',
              name: 'slug',
              formItem: {
                col: 6,
                rules: [
                  { type: EFormRuleType.required },
                  { type: EFormRuleType.max, value: 100 },
                  {
                    type: EFormRuleType.api,
                    api: {
                      url: `${routerLinks('Post', 'api')}/valid`,
                      name: 'slug',
                      label: 'Slug',
                      id: sCrud.data?.id,
                    },
                  },
                ],
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
              title: t('Content'),
              name: 'content',
              formItem: {
                type: EFormType.editor,
              },
            },
          ],
        },
      },
    ];
  },
};
