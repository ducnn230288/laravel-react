import { Popconfirm, Spin, Tree, TreeSelect } from 'antd';
import classNames from 'classnames';
import { Fragment, useEffect } from 'react';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CTooltip } from '@/components/tooltip';
import { EStatusState } from '@/enums';
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
    if (sCrud.result && !sCrud.resultType) sCrud.getType({ include: 'children', postTypeId: '' });
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

import { CDrawerForm } from '@/components/drawer';
import { CSvgIcon } from '@/components/svg-icon';
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
        name: sCrud.resultType?.data?.find(item => item.code === request.typeCode)?.name,
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

  const request = JSON.parse(sCrud?.queryParamsType ?? '{}');
  useEffect(() => {
    if (sCrud.statusType === EStatusState.isFulfilled) {
      sCrud.getType(request);
    }
  }, [sCrud.statusType]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  return (
    <CDrawerForm
      facade={sCrud}
      keyData='dataType'
      keyIsLoading='isLoadingType'
      keyState='isVisibleType'
      columns={_columnType.useForm()}
      title={t(sCrud.dataType?.id ? 'Edit Type Post' : 'Add new Type Post')}
      onSubmit={values => {
        if (sCrud.dataType?.id) sCrud.putType({ ...values, id: sCrud.dataType.id });
        else sCrud.postType({ ...values });
      }}
    />
  );
};

import { Scrollbar } from '@/components/scrollbar';
import { KEY_ROLE, mapTreeObject } from '@/utils';
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
          onClick={() => sCrud.set({ dataType: undefined, isVisibleType: true })}
        />
      </div>
      <Spin spinning={sCrud.isLoadingType}>
        <div className='desktop'>
          {sCrud.resultType?.data && (
            <Scrollbar>
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<CSvgIcon name='arrow' size={12} />}
                defaultSelectedKeys={[request.typeCode]}
                treeData={sCrud.resultType?.data?.map(mapTreeObject)}
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
                            onClick={() => sCrud.getByIdType({ id: data.key })}
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
                            onConfirm={() => sCrud.deleteType(data.key)}
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
            treeData={sCrud.resultType?.data?.map(mapTreeObject)}
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

import { CButton } from '@/components/button';
import { CDataTable } from '@/components/data-table';
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
            label: t('Post'),
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
                  name: sCrud.resultType?.data?.find(item => item.code === request.typeCode)?.name,
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
