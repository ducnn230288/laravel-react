import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import slug from 'slug';

import { Check, Disable, Edit, Trash } from '@/assets/svg';
import { EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import { IDataTable, IForm } from '@/interfaces';
import { Avatar } from '@/library/avatar';
import { PopConfirm } from '@/library/pop-confirm';
import { ToolTip } from '@/library/tooltip';
import { SGlobal, SPost } from '@/services';
import { keyRole } from '@/utils';

export default {
  table: (): IDataTable[] => {
    const sGlobal = SGlobal();
    const { t } = useTranslation();
    const sPost = SPost();

    return [
      {
        title: 'routes.admin.Post.Name',
        name: 'translations.name',
        tableItem: {
          filter: { type: ETableFilterType.search },
          sorter: true,
          render: (_: string, item: any) => (
            <Avatar
              src={item.image}
              text={
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
        title: 'Slug',
        name: 'translations.slug',
        tableItem: {
          filter: { type: ETableFilterType.search },
          sorter: true,
          render: (_: string, item: any) =>
            item.languages?.length
              ? item.languages?.filter((item: any) => item?.language === localStorage.getItem('i18nextLng'))[0].slug
              : '',
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
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_UPDATE) && (
                <ToolTip title={t(data.isDisable ? 'components.datatable.Disabled' : 'components.datatable.Enabled')}>
                  <PopConfirm
                    title={t(
                      !data.isDisable
                        ? 'components.datatable.areYouSureWantDisable'
                        : 'components.datatable.areYouSureWantEnable',
                    )}
                    onConfirm={() => sPost.put({ id: data.id, isDisable: !data.isDisable })}
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
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_UPDATE) && (
                <ToolTip title={t('routes.admin.Layout.Edit')}>
                  <button
                    title={t('routes.admin.Layout.Edit') || ''}
                    onClick={() => sPost.getById({ id: data.id, params: { include: 'languages' } })}
                  >
                    <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                  </button>
                </ToolTip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_DESTROY) && (
                <ToolTip title={t('routes.admin.Layout.Delete')}>
                  <PopConfirm title={t('components.datatable.areYouSureWant')} onConfirm={() => sPost.delete(data.id)}>
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
  form: (id?: string): IForm[] => {
    return [
      {
        title: 'Created At',
        name: 'createdAt',
        formItem: {
          col: 6,
          type: EFormType.date,
          rules: id ? [{ type: EFormRuleType.required }] : [],
        },
      },
      {
        title: 'Thumbnail Url',
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
            { label: 'English', value: 'en' },
            { label: 'Vietnam', value: 'vn' },
          ],
          column: [
            { title: 'id', name: 'id', formItem: { type: EFormType.hidden } },
            {
              title: 'Name',
              name: 'name',
              formItem: {
                col: 6,
                rules: [{ type: EFormRuleType.required }],
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
                rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.max, value: 100 }],
              },
            },
            {
              title: 'Description',
              name: 'description',
              formItem: {
                type: EFormType.textarea,
              },
            },
            {
              title: 'Content',
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
