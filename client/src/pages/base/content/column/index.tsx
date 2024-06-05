import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Popconfirm } from 'antd';

import { Check, Disable, Edit, Trash } from '@/assets/svg';
import { EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import { IDataTable, IForm } from '@/interfaces';
import { Avatar } from '@/library/avatar';
import { ToolTip } from '@/library/tooltip';
import { SContent, SGlobal } from '@/services';
import { keyRole } from '@/utils';

export default {
  useTable: (): IDataTable[] => {
    const sGlobal = SGlobal();
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });
    const sContent = SContent();

    return [
      {
        title: t('Name Content'),
        name: 'name',
        tableItem: {
          filter: { type: ETableFilterType.search },
          sorter: true,
          render: (text: string, item: any) => (
            <Avatar
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
          render: (text) => (
            <ToolTip title={dayjs(text).format(sGlobal.formatDate + ' HH:mm:ss')}>
              {dayjs(text).format(sGlobal.formatDate)}
            </ToolTip>
          ),
        },
      },
      {
        title: 'Action',
        tableItem: {
          width: 100,
          align: ETableAlign.center,
          render: (text: string, data) => (
            <div className={'flex gap-2'}>
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_CONTENT_UPDATE) && (
                <ToolTip
                  title={t(data.isDisable ? 'Disabled content' : 'Enabled content', {
                    name: data.name,
                  })}
                >
                  <Popconfirm
                    title={t(
                      !data.isDisable ? 'Are you sure want disable content?' : 'Are you sure want enable content?',
                      {
                        name: data.name,
                      },
                    )}
                    onConfirm={() => sContent.put({ id: data.id, isDisable: !data.isDisable })}
                  >
                    <button
                      title={t(data.isDisable ? 'Disabled content' : 'Enabled content', {
                        name: data.name,
                      })}
                    >
                      {data.isDisable ? (
                        <Disable className="icon-cud bg-yellow-700 hover:bg-yellow-500" />
                      ) : (
                        <Check className="icon-cud bg-green-600 hover:bg-green-400" />
                      )}
                    </button>
                  </Popconfirm>
                </ToolTip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_CONTENT_UPDATE) && (
                <ToolTip
                  title={t('Edit Content', {
                    name: data.name,
                  })}
                >
                  <button
                    title={t('Edit Content', {
                      name: data.name,
                    })}
                    onClick={() => sContent.getById({ id: data.id, params: { include: 'languages' } })}
                  >
                    <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                  </button>
                </ToolTip>
              )}
              {sGlobal.user?.role?.permissions?.includes(keyRole.P_CONTENT_DESTROY) && (
                <ToolTip
                  title={t('Delete content', {
                    name: data.name,
                  })}
                >
                  <Popconfirm
                    title={t('Are you sure want delete content?', {
                      name: data.name,
                    })}
                    onConfirm={() => sContent.delete(data.id)}
                  >
                    <button
                      title={t('Delete content', {
                        name: data.name,
                      })}
                    >
                      <Trash className="icon-cud bg-red-600 hover:bg-red-400" />
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
                  { label: t('English content'), value: 'en' },
                  { label: t('Vietnamese content'), value: 'vn' },
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