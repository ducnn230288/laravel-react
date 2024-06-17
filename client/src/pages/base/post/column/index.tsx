import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import slug from 'slug';
import { Popconfirm } from 'antd';

import { CSvgIcon } from '@/library/svg-icon';
import { EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import type { IDataTable, IForm } from '@/types';
import { CAvatar } from '@/library/avatar';
import { CTooltip } from '@/library/tooltip';
import { SGlobal, SPost } from '@/services';
import { keyRole } from '@/utils';

export default {
  useTable: (): IDataTable[] => {
    const sGlobal = SGlobal();
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
    const sPost = SPost();

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
          width: 100,
          align: ETableAlign.center,
          render: (_: string, data) => (
            <div className={'action'}>
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_UPDATE) && (
                <CTooltip
                  title={t(data.isDisable ? 'Disabled post' : 'Enabled post', {
                    name: data.languages?.length
                      ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng')).name
                      : '',
                  })}
                >
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t(!data.isDisable ? 'Are you sure want disable post?' : 'Are you sure want enable post?', {
                      name: data.languages?.length
                        ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng'))
                            .name
                        : '',
                    })}
                    onConfirm={() => sPost.put({ id: data.id, isDisable: !data.isDisable })}
                  >
                    <button
                      title={t(data.isDisable ? 'Disabled post' : 'Enabled post', {
                        name: data.languages?.length
                          ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng'))
                              .name
                          : '',
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
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_UPDATE) && (
                <CTooltip
                  title={t('Edit Post', {
                    name: data.languages?.length
                      ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng')).name
                      : '',
                  })}
                >
                  <button
                    title={t('Edit Post', {
                      name: data.languages?.length
                        ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng'))
                            .name
                        : '',
                    })}
                    onClick={() => sPost.getById({ id: data.id, params: { include: 'languages' } })}
                  >
                    <CSvgIcon name='edit' className='primary' />
                  </button>
                </CTooltip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_DESTROY) && (
                <CTooltip
                  title={t('Delete post', {
                    name: data.languages?.length
                      ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng')).name
                      : '',
                  })}
                >
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t('Are you sure want delete post?', {
                      name: data.languages?.length
                        ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng'))
                            .name
                        : '',
                    })}
                    onConfirm={() => sPost.delete(data.id)}
                  >
                    <button
                      title={t('Delete post', {
                        name: data.languages?.length
                          ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng'))
                              .name
                          : '',
                      })}
                    >
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
  useForm: (id?: string): IForm[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
    return [
      {
        title: t('Created At'),
        name: 'createdAt',
        formItem: {
          col: 6,
          type: EFormType.date,
          rules: id ? [{ type: EFormRuleType.required }] : [],
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
                rules: [{ type: EFormRuleType.required }],
                onBlur: (value, form, name) => {
                  console.log(form, name);
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
