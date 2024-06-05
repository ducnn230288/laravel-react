import React, { Fragment, useEffect } from 'react';

import { EStatusState } from '@/enums';
import { SGlobal, SUser, SUserRole } from '@/services';

const Page = () => {
  const sUser = SUser();
  useEffect(() => {
    return () => {
      sUser.set({ isLoading: true, status: EStatusState.idle });
    };
  }, []);

  const sUserRole = SUserRole();
  useEffect(() => {
    if (sUser.result && !sUserRole?.result) sUserRole.get({});
  }, [sUser.result]);

  return (
    <Fragment>
      <Breadcrumbs />
      <Form />
      <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5'}>
        <div className="-intro-x col-span-12 md:col-span-4 lg:col-span-3">
          <Side />
        </div>
        <div className="intro-x col-span-12 md:col-span-8 lg:col-span-9">
          <Main />
        </div>
      </div>
    </Fragment>
  );
};
export default Page;

import { useTranslation } from 'react-i18next';
import { DrawerForm } from '@/library/drawer';
import _column from './column';

const Form = () => {
  const sUser = SUser();
  const request = JSON.parse(sUser?.queryParams ?? '{}');

  useEffect(() => {
    switch (sUser.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
      case EStatusState.deleteFulfilled:
        sUser.get(request);
        break;
    }
  }, [sUser.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  return (
    <DrawerForm
      facade={sUser}
      columns={_column.useForm()}
      title={t(sUser.data ? 'Edit User' : 'Add new User', { name: request.roleCode })}
      onSubmit={(values) => {
        if (sUser.data) sUser.put({ ...values, id: sUser.data.id, roleCode: request.roleCode });
        else sUser.post({ ...values, roleCode: request.roleCode });
      }}
    />
  );
};

const Breadcrumbs = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  return (
    <div className="container mx-auto flex items-center justify-between px-2.5 py-3">
      <h2 className={'-intro-x text-xl font-bold'}>User</h2>
      <div className={'intro-x breadcrumbs'}>
        <ul>
          <li>
            <Home className="-mt-0.5 size-3" />
          </li>
          <li>{t('User')}</li>
        </ul>
      </div>
    </div>
  );
};

import { useNavigate } from 'react-router';
import queryString from 'query-string';
import { Select, Spin, Tree } from 'antd';
import { Arrow, Home, Plus } from '@/assets/svg';

const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  const sUserRole = SUserRole();

  const sUser = SUser();
  const request = JSON.parse(sUser?.queryParams ?? '{}');
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden rounded-xl bg-base-100 shadow">
      <div className="flex h-14 items-center justify-between border-b border-base-300 px-4 py-2">
        <h3 className={'text-lg font-bold'}>{t('Role')}</h3>
      </div>
      <Spin spinning={sUserRole.isLoading}>
        <div className="relative hidden h-[calc(100vh-14rem)] overflow-y-auto sm:block">
          <Tree
            blockNode
            showLine
            autoExpandParent
            defaultExpandAll
            switcherIcon={<Arrow className={'size-4'} />}
            defaultSelectedKeys={['SUPER-ADMIN']}
            treeData={sUserRole.result?.data?.map((item: any) => ({
              title: item?.name,
              key: item?.code,
              isLeaf: true,
              expanded: true,
              children: [],
            }))}
            onSelect={(selectedKeys) => {
              request.roleCode = selectedKeys[0];
              sUser.get(request);
              navigate(location.pathname.substring(1) + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
            }}
          />
        </div>
        <div className="block p-2 sm:hidden sm:p-0">
          <Select
            value={request.roleCode}
            className={'w-full'}
            options={sUserRole?.result?.data?.map((data) => ({ label: data.name, value: data.code }))}
            onChange={(e) => {
              request.roleCode = e;
              sUser.get(request);
              navigate(location.pathname.substring(1) + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
            }}
          />
        </div>
      </Spin>
    </div>
  );
};

import { Button } from '@/library/button';
import { DataTable } from '@/library/data-table';
import { keyRole } from '@/utils';

const Main = () => {
  const sUser = SUser();
  const sGlobal = SGlobal();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  const request = JSON.parse(sUser?.queryParams ?? '{}');

  return (
    <div className="w-full overflow-auto rounded-xl bg-base-100 shadow">
      <div className="overflow-y-auto p-3 sm:min-h-[calc(100vh-10.5rem)]">
        <DataTable
          className={'container mx-auto'}
          facade={sUser}
          defaultRequest={{
            page: 1,
            perPage: 1,
            include: 'position',
          }}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination user', { from, to, total })}
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_STORE) && (
              <Button
                icon={<Plus className="size-4" />}
                text={t('Add new User', { name: request.roleCode })}
                onClick={() => sUser.set({ data: undefined, isVisible: true })}
              />
            )
          }
        />
      </div>
    </div>
  );
};
