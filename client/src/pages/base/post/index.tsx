import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Spin, Tree, TreeSelect } from 'antd';
import classNames from 'classnames';

import { Arrow, Edit, Plus, Trash } from '@/assets/svg';
import { EStatusState } from '@/enums';
import { ITableRefObject } from '@/interfaces';
import { Breadcrumbs } from '@/library/breadcrumbs';
import { Button } from '@/library/button';
import { DataTable } from '@/library/data-table';
import { DrawerForm } from '@/library/drawer';
import { PopConfirm } from '@/library/pop-confirm';
import { ToolTip } from '@/library/tooltip';
import { SGlobal, SPost, SPostType } from '@/services';
import { keyRole } from '@/utils';

import _column from './column';
import _columnType from './column/type';

const Page = () => {
  const sGlobal = SGlobal();
  const sPostType = SPostType();
  useEffect(() => {
    if (!sPostType.result?.data) sPostType.get({ include: 'children', postTypeId: '' });
    return () => {
      sPost.set({ isLoading: true, status: EStatusState.idle });
    };
  }, []);

  const sPost = SPost();
  useEffect(() => {
    // Breadcrumbs(t('Post'), [
    //   { title: t('Setting'), link: '' },
    //   { title: t('Post'), link: '' },
    // ]);
    switch (sPost.status) {
      case EStatusState.putFulfilled:
      case EStatusState.postFulfilled:
      case EStatusState.deleteFulfilled:
        dataTableRef?.current?.onChange(request);
        break;
    }
  }, [sPost.status]);
  useEffect(() => {
    switch (sPostType.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
      case EStatusState.deleteFulfilled:
        sPostType.get(JSON.parse(sPostType.queryParams ?? '{}'));
        break;
    }
  }, [sPostType.status]);

  const request = JSON.parse(sPost.queryParams ?? '{}');
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  const dataTableRef = useRef<ITableRefObject>(null);

  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <DrawerForm
        facade={sPostType}
        columns={_columnType.useForm(sPostType.data?.id, sPostType.result?.data)}
        title={t(sPostType.data ? 'Edit Type Post' : 'Add new Type Post')}
        onSubmit={(values) => {
          if (sPostType.data) sPostType.put({ ...values, id: sPostType.data.code });
          else sPostType.post({ ...values });
        }}
      />
      <DrawerForm
        size={'large'}
        facade={sPost}
        columns={_column.useForm(sPost.data?.id)}
        title={t(sPost.data ? 'Edit Post' : 'Add new Post', { name: request.typeCode })}
        onSubmit={(values) => {
          if (sPost?.data?.id) sPost.put({ ...values, id: sPost.data.id, typeCode: request.typeCode });
          else sPost.post({ ...values, typeCode: request.typeCode });
        }}
      />
      <div className="-intro-x col-span-12 md:col-span-4 lg:col-span-3">
        <div className="w-full overflow-hidden rounded-xl bg-white shadow">
          <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4 py-2">
            <h3 className={'text-lg font-bold'}>{t('Type Post')}</h3>
            <div className="flex items-center">
              <Button
                icon={<Plus className="icon-cud !h-5 !w-5" />}
                text={t('Add new Type Post')}
                onClick={() => sPostType.set({ data: undefined, isVisible: true })}
              />
            </div>
          </div>
          <Spin spinning={sPostType.isLoading}>
            <div className="relative hidden h-[calc(100vh-12rem)] overflow-y-auto sm:block">
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<Arrow className={'size-4'} />}
                treeData={sPostType.result?.data}
                titleRender={(data: any) => (
                  <div
                    className={classNames(
                      { 'bg-gray-100': request.typeCode === data.code },
                      'item text-gray-700 font-medium hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 w-full text-left  group',
                    )}
                  >
                    <button
                      onClick={() => {
                        request.typeCode = data.code;
                        dataTableRef?.current?.onChange(request);
                      }}
                      className="flex-1 cursor-pointer truncate px-3 py-1 hover:text-teal-900"
                    >
                      {data.name}
                    </button>
                    <div className="flex w-16 justify-end gap-1">
                      {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_TYPE_UPDATE) && (
                        <ToolTip title={t('Edit Type Post', { name: data.name })}>
                          <button
                            className={'opacity-0 transition-all duration-300 group-hover:opacity-100 '}
                            title={t('Edit Type Post', { name: data.name })}
                            onClick={() => sPostType.getById({ id: data.code })}
                          >
                            <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                          </button>
                        </ToolTip>
                      )}
                      {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_TYPE_DESTROY) && !data.isPrimary && (
                        <ToolTip title={t('Delete type post', { name: data.name })}>
                          <PopConfirm
                            title={t('Are you sure want delete type post?', { name: data.name })}
                            onConfirm={() => sPostType.delete(data.code)}
                          >
                            <button
                              className={'opacity-0 transition-all duration-300 group-hover:opacity-100'}
                              title={t('Delete type post', { name: data.name })}
                            >
                              <Trash className="icon-cud bg-red-600 hover:bg-red-400" />
                            </button>
                          </PopConfirm>
                        </ToolTip>
                      )}
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="block p-2 sm:hidden sm:p-0">
              <TreeSelect
                value={request.typeCode}
                className={'w-full'}
                treeData={sPostType.result?.data}
                onChange={(e) => {
                  if (request.typeCode !== e) request.typeCode = e;
                  else delete request.typeCode;
                  dataTableRef?.current?.onChange(request);
                }}
              />
            </div>
          </Spin>
        </div>
      </div>
      <div className="intro-x col-span-12 md:col-span-8 lg:col-span-9">
        <div className="w-full overflow-auto rounded-xl bg-white shadow">
          <div className="overflow-y-auto p-3 sm:min-h-[calc(100vh-8.5rem)]">
            <DataTable
              facade={sPost}
              ref={dataTableRef}
              paginationDescription={(from: number, to: number, total: number) =>
                t('Pagination post', { from, to, total })
              }
              defaultRequest={{ include: 'languages' }}
              columns={_column.useTable()}
              rightHeader={
                <div className={'flex gap-2'}>
                  {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_STORE) && (
                    <Button
                      icon={<Plus className="icon-cud !h-5 !w-5" />}
                      text={t('Add new Post', { name: request.typeCode })}
                      onClick={() => sPost.set({ data: undefined, isVisible: true })}
                    />
                  )}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
