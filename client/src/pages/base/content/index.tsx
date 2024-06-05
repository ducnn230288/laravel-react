import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Spin, Tree } from 'antd';
import classNames from 'classnames';

import { Arrow, Plus } from '@/assets/svg';
import { EStatusState } from '@/enums';
import { ITableRefObject } from '@/interfaces';
import { Breadcrumbs } from '@/library/breadcrumbs';
import { Button } from '@/library/button';
import { DataTable } from '@/library/data-table';
import { DrawerForm } from '@/library/drawer';
import { SContent, SContentType, SGlobal } from '@/services';
import { keyRole } from '@/utils';

import _column from './column';

const Page = () => {
  const sGlobal = SGlobal();
  const sContentType = SContentType();
  useEffect(() => {
    if (!sContentType.result?.data) sContentType.get({});
    return () => {
      sContent.set({ isLoading: true, status: EStatusState.idle });
    };
  }, []);

  const sContent = SContent();
  useEffect(() => {
    Breadcrumbs(t('Content'), [
      { title: t('Setting'), link: '' },
      { title: t('Content'), link: '' },
    ]);
    switch (sContent.status) {
      case EStatusState.putFulfilled:
      case EStatusState.postFulfilled:
      case EStatusState.deleteFulfilled:
        dataTableRef?.current?.onChange(request);
        break;
    }
  }, [sContent.status]);

  const request = JSON.parse(sContent.queryParams ?? '{}');
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });
  const dataTableRef = useRef<ITableRefObject>(null);
  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <DrawerForm
        size={request.typeCode !== 'partner' && request.typeCode !== 'tech' ? 'large' : undefined}
        facade={sContent}
        columns={_column.useForm(request.typeCode)}
        title={t(sContent.data ? 'Edit Content' : 'Add new Content', { name: request.typeCode })}
        onSubmit={(values) => {
          if (sContent.data?.id) sContent.put({ ...values, id: sContent.data.id, typeCode: request.typeCode });
          else sContent.post({ ...values, typeCode: request.typeCode });
        }}
      />
      <div className="-intro-x col-span-12 md:col-span-4 lg:col-span-3">
        <div className="w-full overflow-hidden rounded-xl bg-white shadow">
          <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4 py-2">
            <h3 className={'text-lg font-bold'}>{t('Type content')}</h3>
          </div>
          <Spin spinning={sContentType.isLoading}>
            <div className="relative hidden h-[calc(100vh-12rem)] overflow-y-auto sm:block">
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<Arrow className={'size-4'} />}
                treeData={sContentType.result?.data?.map((item: any) => ({
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
                    <button
                      onClick={() => {
                        request.typeCode = data.value;
                        dataTableRef?.current?.onChange(request);
                      }}
                      className="flex-1 cursor-pointer truncate px-3 py-1 hover:text-teal-900"
                    >
                      {data.title}
                    </button>
                  </div>
                )}
              />
            </div>
            <div className="block p-2 sm:hidden sm:p-0">
              <Select
                value={request.typeCode}
                className={'w-full'}
                options={sContentType.result?.data?.map((data) => ({ label: data.name, value: data.code }))}
                onChange={(e) => {
                  request.typeCode = e;
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
              facade={sContent}
              ref={dataTableRef}
              paginationDescription={(from: number, to: number, total: number) =>
                t('Pagination content', { from, to, total })
              }
              defaultRequest={{ include: 'languages' }}
              columns={_column.useTable()}
              rightHeader={
                <div className={'flex gap-2'}>
                  {sGlobal.user?.role?.permissions?.includes(keyRole.P_CONTENT_STORE) && (
                    <Button
                      icon={<Plus className="icon-cud !h-5 !w-5" />}
                      text={t('Add new Content', { name: request.typeCode })}
                      onClick={() => sContent.set({ data: undefined, isVisible: true })}
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