import React, { Fragment, useEffect } from 'react';

import { EStatusState } from '@/enums';
import { SGlobal, SUser, SUserRole } from '@/services';
import { Breadcrumbs } from '@/library/breadcrumbs';

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

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  return (
    <Fragment>
      <Breadcrumbs title={t('User')} />
      <Form />
      <div className={'wrapper-grid'}>
        <div className="-intro-x left">
          <Side />
        </div>
        <div className="intro-x right">
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
  const sUserRole = SUserRole();
  return (
    <DrawerForm
      facade={sUser}
      columns={_column.useForm()}
      title={t(sUser.data ? 'Edit User' : 'Add new User', {
        name: sUserRole.result?.data?.find((item) => item.code === request.roleCode)?.name,
      })}
      onSubmit={(values) => {
        if (sUser.data) sUser.put({ ...values, id: sUser.data.id, roleCode: request.roleCode });
        else sUser.post({ ...values, roleCode: request.roleCode });
      }}
    />
  );
};

import { useNavigate } from 'react-router';
import queryString from 'query-string';
import { Select, Spin, Tree } from 'antd';
import { Arrow, Plus } from '@/assets/svg';

const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  const sUserRole = SUserRole();

  const sUser = SUser();
  const request = JSON.parse(sUser?.queryParams ?? '{}');
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="header">
        <h3>{t('Role')}</h3>
      </div>
      <Spin spinning={sUserRole.isLoading}>
        <div className="desktop">
          {sUserRole.result?.data && (
            <Tree
              blockNode
              showLine
              autoExpandParent
              defaultExpandAll
              switcherIcon={<Arrow className={'size-3'} />}
              defaultSelectedKeys={[request.roleCode]}
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
                navigate(
                  location.pathname.substring(1) + '?' + queryString.stringify(request, { arrayFormat: 'index' }),
                );
              }}
            />
          )}
        </div>
        <div className="mobile">
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
  const sUserRole = SUserRole();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  const request = JSON.parse(sUser?.queryParams ?? '{}');

  return (
    <div className="card">
      <div className="body">
        <DataTable
          facade={sUser}
          defaultRequest={{ include: 'position' }}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination user', { from, to, total })}
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(keyRole.P_USER_STORE) && (
              <Button
                icon={<Plus className="size-3" />}
                text={t('Add new User', {
                  name: sUserRole.result?.data?.find((item) => item.code === request.roleCode)?.name,
                })}
                onClick={() => sUser.set({ data: undefined, isVisible: true })}
              />
            )
          }
        />
      </div>
    </div>
  );
};
