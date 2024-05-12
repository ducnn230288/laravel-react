import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Spin, Tree } from 'antd';
import classNames from 'classnames';

import { Button } from '@core/button';
import { DataTable } from '@core/data-table';
import { keyRole, lang, renderTitleBreadcrumbs, routerLinks } from '@utils';
import { ContentFacade, ContentTypeFacade, GlobalFacade } from '@store';
import { Arrow, Plus } from '@svgs';
import { EStatusState, TableRefObject } from '@models';
import _column from '@column/content';
import { DrawerForm } from '@core/drawer';

const Page = () => {
  const { user } = GlobalFacade();
  const contentTypeFacade = ContentTypeFacade();
  useEffect(() => {
    if (!contentTypeFacade.result?.data) contentTypeFacade.get({});
    return () => {
      contentFacade.set({ isLoading: true, status: EStatusState.idle });
    };
  }, []);

  const contentFacade = ContentFacade();
  useEffect(() => {
    renderTitleBreadcrumbs(t('pages.Content'), [
      { title: t('titles.Setting'), link: '' },
      { title: t('titles.Content'), link: '' },
    ]);
    switch (contentFacade.status) {
      case EStatusState.putFulfilled:
      case EStatusState.putDisableFulfilled:
      case EStatusState.postFulfilled:
      case EStatusState.deleteFulfilled:
        dataTableRef?.current?.onChange(request);
        break;
    }
  }, [contentFacade.status]);

  const request = JSON.parse(contentFacade.queryParams || '{}');
  const { t } = useTranslation();
  const dataTableRef = useRef<TableRefObject>(null);
  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <DrawerForm
        size={request.typeCode !== 'partner' && request.typeCode !== 'tech' ? 'large' : undefined}
        facade={contentFacade}
        columns={_column.form(request.typeCode)}
        title={t(contentFacade.data ? 'pages.Content/Edit' : 'pages.Content/Add', { type: request.typeCode })}
        onSubmit={(values) => {
          if (contentFacade.data?.id) contentFacade.put({ ...values, id: contentFacade.data.id, typeCode: request.typeCode });
          else contentFacade.post({ ...values, typeCode: request.typeCode });
        }}
      />
      <div className="col-span-12 md:col-span-4 lg:col-span-3 -intro-x">
        <div className="shadow rounded-xl w-full bg-white overflow-hidden">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>Data Type</h3>
          </div>
          <Spin spinning={contentTypeFacade.isLoading}>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto relative scroll hidden sm:block">
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<Arrow className={'w-4 h-4'} />}
                treeData={contentTypeFacade.result?.data?.map((item: any) => ({
                  title: item?.name,
                  key: item?.code,
                  value: item?.code,
                  isLeaf: true,
                  expanded: true,
                  children: [],
                }))}
                titleRender={(data: any) => (
                  <div
                    className={classNames(
                      { 'bg-gray-100': request.typeCode === data.value },
                      'item text-gray-700 font-medium hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 w-full text-left  group',
                    )}
                  >
                    <div
                      onClick={() => {
                        request.typeCode = data.value;
                        dataTableRef?.current?.onChange(request);
                      }}
                      className="truncate cursor-pointer flex-1 hover:text-teal-900 item-text px-3 py-1"
                    >
                      {data.title}
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="p-2 sm:p-0 block sm:hidden">
              <Select
                value={request.typeCode}
                className={'w-full'}
                options={contentTypeFacade.result?.data?.map((data) => ({ label: data.name, value: data.code }))}
                onChange={(e) => {
                  request.typeCode = e;
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
              facade={contentFacade}
              ref={dataTableRef}
              paginationDescription={(from: number, to: number, total: number) =>
                t('routes.admin.Layout.Pagination', { from, to, total })
              }
              defaultRequest={{include: 'languages'}}
              columns={_column.table()}
              rightHeader={
                <div className={'flex gap-2'}>
                  {user?.role?.permissions?.includes(keyRole.P_CONTENT_STORE) && (
                    <Button
                      icon={<Plus className="icon-cud !h-5 !w-5" />}
                      text={t('components.button.New')}
                      onClick={() => contentFacade.set({ data: undefined, isVisible: true })}
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
