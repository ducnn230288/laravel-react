import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Select, Spin, Tree } from 'antd';
import classNames from 'classnames';
import { createSearchParams } from 'react-router-dom';

import { Arrow, Plus } from '@/assets/svg';
import { EStatusState } from '@/enums';
import { ITableRefObject } from '@/interfaces';
import { Breadcrumbs } from '@/library/breadcrumbs';
import { Button } from '@/library/button';
import { DataTable } from '@/library/data-table';
import { DrawerForm } from '@/library/drawer';
import { SGlobal, SUser, SUserRole } from '@/services';
import { keyRole, lang, routerLinks } from '@/utils';

import _column from './column';

const Page = () => {
  const sUserRole = SUserRole();
  const sGlobal = SGlobal();
  useEffect(() => {
    if (!sUserRole?.result?.data) sUserRole.get({});
    return () => {
      sUser.set({ isLoading: true, status: EStatusState.idle });
    };
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (
      sUserRole?.result?.data?.length &&
      !sUserRole?.result?.data?.filter((item) => item.code === request.roleCode).length
    ) {
      navigate({
        pathname: `/${lang}${routerLinks('User')}`,
        search: `?${createSearchParams({ roleCode: 'SUPER-ADMIN' })}`,
      });
      request.roleCode = 'SUPER-ADMIN';
      dataTableRef?.current?.onChange(request);
    }
  }, [sUserRole?.result]);

  const sUser = SUser();
  useEffect(() => {
    Breadcrumbs(t('User'), [{ title: t('User'), link: '' }]);
    switch (sUser.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
      case EStatusState.deleteFulfilled:
        dataTableRef?.current?.onChange(request);
        break;
    }
  }, [sUser.status]);
  const request = JSON.parse(sUser?.queryParams ?? '{}');
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  const dataTableRef = useRef<ITableRefObject>(null);
  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <DrawerForm
        facade={sUser}
        columns={_column.useForm()}
        title={t(sUser.data ? 'Edit User' : 'Add new User', { name: request.roleCode })}
        onSubmit={(values) => {
          if (sUser.data) sUser.put({ ...values, id: sUser.data.id, roleCode: request.roleCode });
          else sUser.post({ ...values, roleCode: request.roleCode });
        }}
      />
      <div className="col-span-12 md:col-span-4 lg:col-span-3 -intro-x">
        <div className="shadow rounded-xl w-full bg-white overflow-hidden">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>{t('Role')}</h3>
          </div>
          <Spin spinning={sUserRole.isLoading}>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto relative scroll hidden sm:block">
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<Arrow className={'w-4 h-4'} />}
                treeData={sUserRole.result?.data?.map((item: any) => ({
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
                      { 'bg-gray-100': request.roleCode === data.value },
                      'item text-gray-700 font-medium hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 w-full text-left  group',
                    )}
                  >
                    <button
                      onClick={() => {
                        request.roleCode = data.value;
                        dataTableRef?.current?.onChange(request);
                      }}
                      className="truncate cursor-pointer flex-1 hover:text-teal-900 item-text px-3 py-1"
                    >
                      {data.title}
                    </button>
                  </div>
                )}
              />
            </div>
            <div className="p-2 sm:p-0 block sm:hidden">
              <Select
                value={request.roleCode}
                className={'w-full'}
                options={sUserRole?.result?.data?.map((data) => ({ label: data.name, value: data.code }))}
                onChange={(e) => {
                  request.roleCode = e;
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
              className={'container mx-auto'}
              facade={sUser}
              ref={dataTableRef}
              defaultRequest={{
                page: 1,
                perPage: 1,
                include: 'position',
              }}
              onRow={() => ({
                // onDoubleClick: () => userService.getById({ id: data.id }),
              })}
              paginationDescription={(from: number, to: number, total: number) =>
                t('Pagination user', { from, to, total })
              }
              columns={_column.useTable()}
              rightHeader={
                <div className={'flex gap-2'}>
                  {sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_STORE) && (
                    <Button
                      icon={<Plus className="icon-cud !h-5 !w-5" />}
                      text={t('Add new User', { name: request.roleCode })}
                      onClick={() => sUser.set({ data: undefined, isVisible: true })}
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
