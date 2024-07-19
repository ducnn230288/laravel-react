import { Popconfirm, Spin, Tree, TreeSelect } from 'antd';
import classNames from 'classnames';
import { Fragment, useEffect } from 'react';

import { EStatusState } from '@/enums';
import { CBreadcrumbs } from '@/library/breadcrumbs';
import { CTooltip } from '@/library/tooltip';
import { SCrud, SGlobal } from '@/services';
import type { IMPost, IMPostType } from '@/types/model';

const Page = () => {
  const sCrud = SCrud<IMPost, IMPostType>('Post', 'PostType');
  useEffect(() => {
    return () => {
      sCrud.reset();
    };
  }, []);

  useEffect(() => {
    if (sCrud.result && !sCrud.typeResult) sCrud.getType({ include: 'children', postTypeId: '' });
  }, [sCrud.result]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  return (
    <Fragment>
      <CBreadcrumbs title={t('Post')} list={[t('Setting'), t('Post')]} />
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

import { CDrawerForm } from '@/library/drawer';
import { CSvgIcon } from '@/library/svg-icon';
import { useTranslation } from 'react-i18next';
import _column from './column';
const FormPost = () => {
  const sCrud = SCrud<IMPost, IMPostType>('Post', 'PostType');
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  useEffect(() => {
    if (sCrud.status === EStatusState.isFulfilled) {
      sCrud.get(request);
    }
  }, [sCrud.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  return (
    <CDrawerForm
      size={'large'}
      facade={sCrud}
      columns={_column.useForm()}
      title={t(sCrud.data?.id ? 'Edit Post' : 'Add new Post', {
        name: sCrud.typeResult?.data?.find(item => item.code === request.typeCode)?.name,
      })}
      onSubmit={values => {
        if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, typeCode: request.typeCode });
        else sCrud.post({ ...values, typeCode: request.typeCode });
      }}
    />
  );
};

import _columnType from './column/type';
const FormPostType = () => {
  const sCrud = SCrud<IMPost, IMPostType>('Post', 'PostType');

  const request = JSON.parse(sCrud?.typeQueryParams ?? '{}');
  useEffect(() => {
    if (sCrud.typeStatus === EStatusState.isFulfilled) {
      sCrud.getType(request);
    }
  }, [sCrud.typeStatus]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  return (
    <CDrawerForm
      facade={sCrud}
      keyData='typeData'
      keyIsLoading='typeIsLoading'
      keyState='typeIsVisible'
      columns={_columnType.useForm()}
      title={t(sCrud.typeData?.id ? 'Edit Type Post' : 'Add new Type Post')}
      onSubmit={values => {
        if (sCrud.typeData?.id) sCrud.putType({ ...values, id: sCrud.typeData.id });
        else sCrud.postType({ ...values });
      }}
    />
  );
};

import { Scrollbar } from '@/library/scrollbar';
import { KEY_ROLE } from '@/utils';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router';
const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });

  const sCrud = SCrud<IMPost, IMPostType>('Post', 'PostType');
  const request = JSON.parse(sCrud?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();
  const sGlobal = SGlobal();

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Type Post')}</h3>
        <CButton
          icon={<CSvgIcon name='plus' size={12} />}
          onClick={() => sCrud.set({ typeData: undefined, typeIsVisible: true })}
        />
      </div>
      <Spin spinning={sCrud.typeIsLoading}>
        <div className='desktop'>
          {sCrud.typeResult?.data && (
            <Scrollbar>
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<CSvgIcon name='arrow' size={12} />}
                defaultSelectedKeys={[request.typeCode]}
                treeData={sCrud.typeResult?.data?.map((item: any) => ({
                  title: item?.name,
                  key: item?.code,
                  isLeaf: true,
                  expanded: true,
                  children: [],
                }))}
                onSelect={selectedKeys => {
                  if (selectedKeys[0]) {
                    request.typeCode = selectedKeys[0];
                    sCrud.get(request);
                    navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
                  }
                }}
                titleRender={(data: any) => (
                  <span className={classNames('item')}>
                    {data.title}
                    <div className='action'>
                      {sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_UPDATE) && (
                        <CTooltip title={t('Edit Type Post', { name: data.title })}>
                          <button
                            title={t('Edit Type Post', { name: data.title })}
                            onClick={() => sCrud.getByIdType({ id: data.code })}
                          >
                            <CSvgIcon name='edit' className='primary' />
                          </button>
                        </CTooltip>
                      )}
                      {sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_DESTROY) && (
                        <CTooltip title={t('Delete type post', { name: data.title })}>
                          <Popconfirm
                            destroyTooltipOnHide={true}
                            title={t('Are you sure want delete type post?', { name: data.title })}
                            onConfirm={() => sCrud.deleteType(data.code)}
                          >
                            <button title={t('Delete type post', { name: data.title })}>
                              <CSvgIcon name='trash' className='error' />
                            </button>
                          </Popconfirm>
                        </CTooltip>
                      )}
                    </div>
                  </span>
                )}
              />
            </Scrollbar>
          )}
        </div>
        <div className='mobile'>
          <TreeSelect
            treeLine
            switcherIcon={<CSvgIcon name='arrow' size={12} />}
            value={request.typeCode}
            className={'w-full'}
            treeData={sCrud.typeResult?.data?.map((item: any) => ({
              title: item?.name,
              value: item?.code,
              isLeaf: true,
              expanded: true,
              children: [],
            }))}
            onChange={e => {
              if (e) {
                request.typeCode = e;
                sCrud.get(request);
                navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
              }
            }}
          />
        </div>
      </Spin>
    </div>
  );
};

import { CButton } from '@/library/button';
import { CDataTable } from '@/library/data-table';
const Main = () => {
  const sCrud = SCrud<IMPost, IMPostType>('Post', 'PostType');
  const sGlobal = SGlobal();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  return (
    <div className='card'>
      <div className='body'>
        <CDataTable
          action={{
            isDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_UPDATE) && sCrud.put,
            isEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_UPDATE) && sCrud.getById,
            isDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_DESTROY) && sCrud.delete,
            label: t('Content'),
            name: data =>
              data.languages?.length
                ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng')).name
                : '',
          }}
          defaultRequest={{ include: 'languages' }}
          facade={sCrud}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination post', { from, to, total })}
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_STORE) && (
              <CButton
                icon={<CSvgIcon name='plus' size={12} />}
                text={t('Add new Post', {
                  name: sCrud.typeResult?.data?.find(item => item.code === request.typeCode)?.name,
                })}
                onClick={() => sCrud.set({ data: undefined, isVisible: true })}
              />
            )
          }
        />
      </div>
    </div>
  );
};

export default Page;
