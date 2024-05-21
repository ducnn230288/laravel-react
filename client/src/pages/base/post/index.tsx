import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Spin, Tree, TreeSelect } from 'antd';
import classNames from 'classnames';

import { Arrow, Edit, Plus, Trash } from '@/assets/svg';
import { Button } from '@/library/button';
import { DataTable } from '@/library/data-table';
import { DrawerForm } from '@/library/drawer';
import { PopConfirm } from '@/library/pop-confirm';
import { ToolTip } from '@/library/tooltip';

import { EStatusState, TableRefObject } from '@/models';
import { GlobalFacade, PostService, PostTypeService } from '@/services';
import { keyRole, renderTitleBreadcrumbs } from '@/utils';

import _column from './column';
import _columnType from './column/type';

const Page = () => {
  const { user } = GlobalFacade();
  const postTypeService = PostTypeService();
  useEffect(() => {
    if (!postTypeService.result?.data) postTypeService.get({ include: 'children', postTypeId: '' });
    return () => {
      postService.set({ isLoading: true, status: EStatusState.idle });
    };
  }, []);

  const postService = PostService();
  useEffect(() => {
    renderTitleBreadcrumbs(t('titles.Post'), [
      { title: t('titles.Setting'), link: '' },
      { title: t('titles.Post'), link: '' },
    ]);
    switch (postService.status) {
      case EStatusState.putFulfilled:
      case EStatusState.postFulfilled:
      case EStatusState.deleteFulfilled:
        dataTableRef?.current?.onChange(request);
        break;
    }
  }, [postService.status]);
  useEffect(() => {
    switch (postTypeService.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
      case EStatusState.deleteFulfilled:
        postTypeService.get(JSON.parse(postTypeService.queryParams || '{}'));
        break;
    }
  }, [postTypeService.status]);

  const request = JSON.parse(postService.queryParams || '{}');
  const { t } = useTranslation();
  const dataTableRef = useRef<TableRefObject>(null);

  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <DrawerForm
        facade={postTypeService}
        columns={_columnType.form(postTypeService.data?.id, postTypeService.result?.data)}
        title={t(postTypeService.data ? 'pages.Post/Edit' : 'pages.Post/Add', { type: '' })}
        onSubmit={(values) => {
          if (postTypeService.data) postTypeService.put({ ...values, id: postTypeService.data.code });
          else postTypeService.post({ ...values });
        }}
      />
      <DrawerForm
        size={'large'}
        facade={postService}
        columns={_column.form(postService.data?.id)}
        title={t(postService.data ? 'pages.Post/Edit' : 'pages.Post/Add', { type: request.typeCode })}
        onSubmit={(values) => {
          if (postService?.data?.id)
            postService.put({ ...values, id: postService.data.id, typeCode: request.typeCode });
          else postService.post({ ...values, typeCode: request.typeCode });
        }}
      />
      <div className="col-span-12 md:col-span-4 lg:col-span-3 -intro-x">
        <div className="shadow rounded-xl w-full bg-white overflow-hidden">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>Post Type</h3>
            <div className="flex items-center">
              <Button
                icon={<Plus className="icon-cud !h-5 !w-5" />}
                text={t('routes.admin.Code.New Type')}
                onClick={() => postTypeService.set({ data: undefined, isVisible: true })}
              />
            </div>
          </div>
          <Spin spinning={postTypeService.isLoading}>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto relative scroll hidden sm:block">
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<Arrow className={'w-4 h-4'} />}
                treeData={postTypeService.result?.data}
                titleRender={(data: any) => (
                  <div
                    className={classNames(
                      { 'bg-gray-100': request.typeCode === data.code },
                      'item text-gray-700 font-medium hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 w-full text-left  group',
                    )}
                  >
                    <div
                      onClick={() => {
                        request.typeCode = data.code;
                        dataTableRef?.current?.onChange(request);
                      }}
                      className="truncate cursor-pointer flex-1 hover:text-teal-900 item-text px-3 py-1"
                    >
                      {data.name}
                    </div>
                    <div className="w-16 flex justify-end gap-1">
                      {user?.role?.permissions?.includes(keyRole.P_POST_TYPE_UPDATE) && (
                        <ToolTip title={t('routes.admin.Layout.Edit')}>
                          <button
                            className={'opacity-0 group-hover:opacity-100 transition-all duration-300 '}
                            title={t('routes.admin.Layout.Edit') || ''}
                            onClick={() => postTypeService.getById({ id: data.code })}
                          >
                            <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                          </button>
                        </ToolTip>
                      )}
                      {user?.role?.permissions?.includes(keyRole.P_POST_TYPE_DESTROY) && !data.isPrimary && (
                        <ToolTip title={t('routes.admin.Layout.Delete')}>
                          <PopConfirm
                            title={t('components.datatable.areYouSureWant')}
                            onConfirm={() => postTypeService.delete(data.code!)}
                          >
                            <button
                              className={'opacity-0 group-hover:opacity-100 transition-all duration-300'}
                              title={t('routes.admin.Layout.Delete') || ''}
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
            <div className="p-2 sm:p-0 block sm:hidden">
              <TreeSelect
                value={request.typeCode}
                className={'w-full'}
                treeData={postTypeService.result?.data}
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
      <div className="col-span-12 md:col-span-8 lg:col-span-9 intro-x">
        <div className="shadow rounded-xl w-full overflow-auto bg-white">
          <div className="sm:min-h-[calc(100vh-8.5rem)] overflow-y-auto p-3">
            <DataTable
              facade={postService}
              ref={dataTableRef}
              paginationDescription={(from: number, to: number, total: number) =>
                t('routes.admin.Layout.Pagination', { from, to, total })
              }
              defaultRequest={{ include: 'languages' }}
              columns={_column.table()}
              rightHeader={
                <div className={'flex gap-2'}>
                  {user?.role?.permissions?.includes(keyRole.P_POST_STORE) && (
                    <Button
                      icon={<Plus className="icon-cud !h-5 !w-5" />}
                      text={t('components.button.New')}
                      onClick={() => postService.set({ data: undefined, isVisible: true })}
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
