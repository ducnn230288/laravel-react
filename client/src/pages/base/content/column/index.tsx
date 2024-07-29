import { useTranslation } from 'react-i18next';

import { CAvatar } from '@/components/avatar';
import { EFormRuleType, EFormType, ETableFilterType } from '@/enums';
import type { IDataTable, IForm } from '@/types';

export default {
  useTable: (): IDataTable[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });

    return [
      {
        title: t('Name Content'),
        name: 'name',
        tableItem: {
          filter: { type: ETableFilterType.search },
          sorter: true,
          render: (text: string, item: any) => (
            <CAvatar
              src={item.image}
              text={
                text ||
                (item.languages?.length &&
                  item.languages?.filter((item: any) => item?.language === localStorage.getItem('i18nextLng'))[0]
                    .name) ||
                ''
              }
            />
          ),
        },
      },
      {
        title: t('Order'),
        name: 'order',
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
  useForm: (type?: string): IForm[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });

    return [
      {
        title: t('Name Content'),
        name: 'name',
        formItem: type === 'partner' || type === 'tech' ? {} : undefined,
      },
      {
        title: t('Order'),
        name: 'order',
        formItem: {
          col: type === 'partner' || type === 'tech' ? 12 : 6,
          type: EFormType.number,
        },
      },
      {
        title: t('Image'),
        name: 'image',
        formItem: {
          col: type === 'partner' || type === 'tech' ? 12 : 6,
          type: EFormType.upload,
        },
      },
      {
        name: 'languages',
        title: '',
        formItem:
          type === 'partner' || type === 'tech'
            ? undefined
            : {
                type: EFormType.tab,
                tab: 'language',
                list: [
                  { label: t('English'), value: 'en' },
                  { label: t('Vietnamese'), value: 'vi' },
                ],
                column: [
                  { title: 'id', name: 'id', formItem: { type: EFormType.hidden } },
                  {
                    title: t('Name'),
                    name: 'name',
                    formItem: {
                      col: type === 'member' ? 6 : 12,
                      rules: [{ type: EFormRuleType.required }],
                    },
                  },

                  {
                    title: t('Position'),
                    name: 'position',
                    formItem:
                      type === 'member'
                        ? {
                            col: 6,
                          }
                        : undefined,
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
                    formItem:
                      type === 'member'
                        ? {
                            type: EFormType.editor,
                          }
                        : undefined,
                  },
                ],
              },
      },
    ];
  },
};
