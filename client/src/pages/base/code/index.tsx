import React, { Fragment, useEffect } from 'react';

import { EStatusState } from '@/enums';
import { Breadcrumbs } from '@/library/breadcrumbs';
import { SCode, SCodeType, SGlobal } from '@/services';

const Page = () => {
  const sCode = SCode();
  useEffect(() => {
    return () => {
      sCode.set({ isLoading: true, status: EStatusState.idle });
    };
  }, []);

  const sCodeType = SCodeType();
  useEffect(() => {
    if (sCode.result && !sCodeType?.result) sCodeType.get({});
  }, [sCode.result]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  return (
    <Fragment>
      <Breadcrumbs title={t('Code')} list={[t('Setting'), t('Code')]} />
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
  const sCode = SCode();
  const request = JSON.parse(sCode?.queryParams ?? '{}');

  useEffect(() => {
    switch (sCode.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
      case EStatusState.deleteFulfilled:
        sCode.get(request);
        break;
    }
  }, [sCode.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  const sCodeType = SCodeType();
  return (
    <DrawerForm
      facade={sCode}
      columns={_column.useForm()}
      title={t(sCode.data?.id ? 'Edit Code' : 'Add new Code', {
        name: sCodeType.result?.data?.find((item) => item.code === request.typeCode)?.name,
      })}
      onSubmit={(values) => {
        if (sCode.data) sCode.put({ ...values, id: sCode.data.id, typeCode: request.typeCode });
        else sCode.post({ ...values, typeCode: request.typeCode });
      }}
    />
  );
};

import { useNavigate } from 'react-router';
import queryString from 'query-string';
import { Select, Spin, Tree } from 'antd';
import { Arrow, Plus } from '@/assets/svg';
const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  const sCodeType = SCodeType();

  const sCode = SCode();
  const request = JSON.parse(sCode?.queryParams ?? '{}');
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="header">
        <h3>{t('Type code')}</h3>
      </div>
      <Spin spinning={sCodeType.isLoading}>
        <div className="desktop">
          {sCodeType.result?.data && (
            <Tree
              blockNode
              showLine
              autoExpandParent
              defaultExpandAll
              switcherIcon={<Arrow className={'size-3'} />}
              defaultSelectedKeys={[request.typeCode]}
              treeData={sCodeType.result?.data?.map((item: any) => ({
                title: item?.name,
                key: item?.code,
                isLeaf: true,
                expanded: true,
                children: [],
              }))}
              onSelect={(selectedKeys) => {
                request.typeCode = selectedKeys[0];
                sCode.get(request);
                navigate(
                  location.pathname.substring(1) + '?' + queryString.stringify(request, { arrayFormat: 'index' }),
                );
              }}
            />
          )}
        </div>
        <div className="mobile">
          <Select
            value={request.typeCode}
            className={'w-full'}
            options={sCodeType?.result?.data?.map((data) => ({ label: data.name, value: data.code }))}
            onChange={(e) => {
              request.typeCode = e;
              sCode.get(request);
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
  const sCode = SCode();
  const sGlobal = SGlobal();
  const sCodeType = SCodeType();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  const request = JSON.parse(sCode?.queryParams ?? '{}');

  return (
    <div className="card">
      <div className="body">
        <DataTable
          facade={sCode}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination code', { from, to, total })}
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(keyRole.P_CODE_STORE) && (
              <Button
                icon={<Plus className="size-3" />}
                text={t('Add new Code', {
                  name: sCodeType.result?.data?.find((item) => item.code === request.typeCode)?.name,
                })}
                onClick={() => sCode.set({ data: undefined, isVisible: true })}
              />
            )
          }
        />
      </div>
    </div>
  );
};
