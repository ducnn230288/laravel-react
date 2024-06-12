import React, { Fragment, useEffect } from 'react';

import { EStatusState } from '@/enums';
import { Breadcrumbs } from '@/library/breadcrumbs';
import { SContent, SContentType, SGlobal } from '@/services';

const Page = () => {
  const sContent = SContent();
  useEffect(() => {
    return () => {
      sContent.set({ isLoading: true, status: EStatusState.idle });
    };
  }, []);

  const sContentType = SContentType();
  useEffect(() => {
    if (sContent.result && !sContentType?.result) sContentType.get({});
  }, [sContent.result]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });
  return (
    <Fragment>
      <Breadcrumbs title={t('Content')} list={[t('Setting'), t('Content')]} />
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
  const sContent = SContent();
  const request = JSON.parse(sContent?.queryParams ?? '{}');

  useEffect(() => {
    switch (sContent.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
      case EStatusState.deleteFulfilled:
        sContent.get(request);
        break;
    }
  }, [sContent.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });
  const sContentType = SContentType();
  return (
    <DrawerForm
      facade={sContent}
      columns={_column.useForm()}
      title={t(sContent.data?.id ? 'Edit Content' : 'Add new Content', {
        name: sContentType.result?.data?.find((item) => item.code === request.typeCode)?.name,
      })}
      onSubmit={(values) => {
        if (sContent.data?.id) sContent.put({ ...values, id: sContent.data.id, typeCode: request.typeCode });
        else sContent.post({ ...values, typeCode: request.typeCode });
      }}
    />
  );
};

import { useLocation, useNavigate } from 'react-router';
import queryString from 'query-string';
import { Select, Spin, Tree } from 'antd';
import { Arrow, Plus } from '@/assets/svg';
const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });
  const sContentType = SContentType();

  const sContent = SContent();
  const request = JSON.parse(sContent?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="card">
      <div className="header">
        <h3>{t('Type content')}</h3>
      </div>
      <Spin spinning={sContentType.isLoading}>
        <div className="desktop">
          {sContentType.result?.data && (
            <Tree
              blockNode
              showLine
              autoExpandParent
              defaultExpandAll
              switcherIcon={<Arrow className={'size-3'} />}
              defaultSelectedKeys={[request.typeCode]}
              treeData={sContentType.result?.data?.map((item: any) => ({
                title: item?.name,
                key: item?.code,
                isLeaf: true,
                expanded: true,
                children: [],
              }))}
              onSelect={(selectedKeys) => {
                request.typeCode = selectedKeys[0];
                sContent.get(request);
                navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
              }}
            />
          )}
        </div>
        <div className="mobile">
          <Select
            value={request.typeCode}
            className={'w-full'}
            options={sContentType?.result?.data?.map((data) => ({ label: data.name, value: data.code }))}
            onChange={(e) => {
              request.typeCode = e;
              sContent.get(request);
              navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
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
  const sContent = SContent();
  const sGlobal = SGlobal();
  const sContentType = SContentType();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });
  const request = JSON.parse(sContent?.queryParams ?? '{}');

  return (
    <div className="card">
      <div className="body">
        <DataTable
          defaultRequest={{ include: 'languages' }}
          facade={sContent}
          paginationDescription={(from: number, to: number, total: number) =>
            t('Pagination content', { from, to, total })
          }
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(keyRole.P_CONTENT_STORE) && (
              <Button
                icon={<Plus className="size-3" />}
                text={t('Add new Content', {
                  name: sContentType.result?.data?.find((item) => item.code === request.typeCode)?.name,
                })}
                onClick={() => sContent.set({ data: undefined, isVisible: true })}
              />
            )
          }
        />
      </div>
    </div>
  );
};
