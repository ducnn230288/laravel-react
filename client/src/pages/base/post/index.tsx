import React, { Fragment, useEffect } from 'react';
import { Popconfirm, Spin, Tree, TreeSelect } from 'antd';
import classNames from 'classnames';

import { EStatusState } from '@/enums';
import { ToolTip } from '@/library/tooltip';
import { SGlobal, SPost, SPostType } from '@/services';

const Page = () => {
  const sPostType = SPostType();
  useEffect(() => {
    if (!sPostType.result?.data) sPostType.get({ include: 'children', postTypeId: '' });
    return () => {
      sPost.set({ isLoading: true, status: EStatusState.idle });
    };
  }, []);

  const sPost = SPost();

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });

  return (
    <Fragment>
      <Breadcrumbs title={t('Post')} list={[t('Setting'), t('Post')]} />
      <FormPost />
      <FormPostType />
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <Side />
        </div>
        <div className='intro-x right'>
          <Main />
        </div>
      </div>
    </Fragment>
  );
};

import { useTranslation } from 'react-i18next';
import { DrawerForm } from '@/library/drawer';
import _column from './column';
import { Breadcrumbs } from '@/library/breadcrumbs';
import { SvgIcon } from '@/library/svg-icon';
const FormPost = () => {
  const sPost = SPost();
  const request = JSON.parse(sPost?.queryParams ?? '{}');

  useEffect(() => {
    switch (sPost.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
      case EStatusState.deleteFulfilled:
        sPost.get(request);
        break;
    }
  }, [sPost.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  const sPostType = SPostType();
  return (
    <DrawerForm
      size={'large'}
      facade={sPost}
      columns={_column.useForm()}
      title={t(sPost.data?.id ? 'Edit Post' : 'Add new Post', {
        name: sPostType.result?.data?.find(item => item.code === request.typeCode)?.name,
      })}
      onSubmit={values => {
        if (sPost.data?.id) sPost.put({ ...values, id: sPost.data.id, typeCode: request.typeCode });
        else sPost.post({ ...values, typeCode: request.typeCode });
      }}
    />
  );
};

import _columnType from './column/type';
const FormPostType = () => {
  const sPostType = SPostType();
  const request = JSON.parse(sPostType?.queryParams ?? '{}');
  useEffect(() => {
    switch (sPostType.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
      case EStatusState.deleteFulfilled:
        sPostType.get(request);
        break;
    }
  }, [sPostType.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  return (
    <DrawerForm
      facade={sPostType}
      columns={_columnType.useForm(sPostType.data?.id, sPostType.result?.data)}
      title={t(sPostType.data?.id ? 'Edit Type Post' : 'Add new Type Post')}
      onSubmit={values => {
        if (sPostType.data?.id) sPostType.put({ ...values, id: sPostType.data.id });
        else sPostType.post({ ...values });
      }}
    />
  );
};

import { useLocation, useNavigate } from 'react-router';
import queryString from 'query-string';
const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  const sPostType = SPostType();

  const sPost = SPost();
  const request = JSON.parse(sPost?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();
  const sGlobal = SGlobal();

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Type Post')}</h3>
        <Button
          icon={<SvgIcon name='plus' size={12} />}
          onClick={() => sPostType.set({ data: undefined, isVisible: true })}
        />
      </div>
      <Spin spinning={sPostType.isLoading}>
        <div className='desktop'>
          {sPostType.result?.data && (
            <Tree
              blockNode
              showLine
              autoExpandParent
              defaultExpandAll
              switcherIcon={<SvgIcon name='arrow' size={12} />}
              defaultSelectedKeys={[request.typeCode]}
              treeData={sPostType.result?.data?.map((item: any) => ({
                title: item?.name,
                key: item?.code,
                isLeaf: true,
                expanded: true,
                children: [],
              }))}
              onSelect={selectedKeys => {
                if (selectedKeys[0]) {
                  request.typeCode = selectedKeys[0];
                  sPost.get(request);
                  navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
                }
              }}
              titleRender={(data: any) => (
                <span className={classNames('item')}>
                  {data.title}
                  <div className='action'>
                    {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_TYPE_UPDATE) && (
                      <ToolTip title={t('Edit Type Post', { name: data.title })}>
                        <button
                          title={t('Edit Type Post', { name: data.title })}
                          onClick={() => sPostType.getById({ id: data.code })}
                        >
                          <SvgIcon name='edit' className='primary' />
                        </button>
                      </ToolTip>
                    )}
                    {sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_TYPE_DESTROY) && (
                      <ToolTip title={t('Delete type post', { name: data.title })}>
                        <Popconfirm
                          destroyTooltipOnHide={true}
                          title={t('Are you sure want delete type post?', { name: data.title })}
                          onConfirm={() => sPostType.delete(data.code)}
                        >
                          <button title={t('Delete type post', { name: data.title })}>
                            <SvgIcon name='trash' className='error' />
                          </button>
                        </Popconfirm>
                      </ToolTip>
                    )}
                  </div>
                </span>
              )}
            />
          )}
        </div>
        <div className='mobile'>
          <TreeSelect
            treeLine
            switcherIcon={<SvgIcon name='arrow' size={12} />}
            value={request.typeCode}
            className={'w-full'}
            treeData={sPostType.result?.data?.map((item: any) => ({
              title: item?.name,
              value: item?.code,
              isLeaf: true,
              expanded: true,
              children: [],
            }))}
            onChange={e => {
              if (e) {
                request.typeCode = e;
                sPost.get(request);
                navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
              }
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
  const sPost = SPost();
  const sGlobal = SGlobal();
  const sPostType = SPostType();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  const request = JSON.parse(sPost?.queryParams ?? '{}');

  return (
    <div className='card'>
      <div className='body'>
        <DataTable
          defaultRequest={{ include: 'languages' }}
          facade={sPost}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination post', { from, to, total })}
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(keyRole.P_POST_STORE) && (
              <Button
                icon={<SvgIcon name='plus' size={12} />}
                text={t('Add new Post', {
                  name: sPostType.result?.data?.find(item => item.code === request.typeCode)?.name,
                })}
                onClick={() => sPost.set({ data: undefined, isVisible: true })}
              />
            )
          }
        />
      </div>
    </div>
  );
};

export default Page;
