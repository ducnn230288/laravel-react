import { Fragment, useEffect } from 'react';

import { EStatusState } from '@/enums';
import { CBreadcrumbs } from '@/library/breadcrumbs';
import { SCrud, SGlobal } from '@/services';
import type { IMUser, IMUserRole } from '@/types/model';

const Page = () => {
  const sCrud = new SCrud<IMUser, IMUserRole>('User', 'UserRole');
  useEffect(() => {
    return () => {
      sCrud.reset();
    };
  }, []);

  useEffect(() => {
    if (sCrud.result && !sCrud?.typeResult) sCrud.getType({});
  }, [sCrud.result]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  return (
    <Fragment>
      <CBreadcrumbs title={t('User')} list={[t('User')]} />
      <Form />
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
export default Page;

import { CDrawerForm } from '@/library/drawer';
import { useTranslation } from 'react-i18next';
import _column from './column';
const Form = () => {
  const sCrud = new SCrud<IMUser, IMUserRole>('User', 'UserRole');
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  useEffect(() => {
    switch (sCrud.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
      case EStatusState.deleteFulfilled:
        sCrud.get(request);
        break;
    }
  }, [sCrud.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  return (
    <CDrawerForm
      facade={sCrud}
      columns={_column.useForm()}
      title={t(sCrud.data?.id ? 'Edit User' : 'Add new User', {
        name: sCrud.typeResult?.data?.find(item => item.code === request.roleCode)?.name,
      })}
      onSubmit={values => {
        if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, roleCode: request.roleCode });
        else sCrud.post({ ...values, roleCode: request.roleCode });
      }}
    />
  );
};

import { Scrollbar } from '@/library/perfect-scrollbar';
import { Select, Spin, Tree } from 'antd';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router';

import { CSvgIcon } from '@/library/svg-icon';
const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });

  const sCrud = new SCrud<IMUser, IMUserRole>('User', 'UserRole');
  const request = JSON.parse(sCrud?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Role')}</h3>
      </div>
      <Spin spinning={sCrud.typeIsLoading}>
        <div className='desktop'>
          {sCrud.typeResult?.data && (
            <Scrollbar options={{ wheelSpeed: 1 }}>
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<CSvgIcon name='arrow' size={12} />}
                defaultSelectedKeys={[request.roleCode]}
                treeData={sCrud.typeResult?.data?.map((item: any) => ({
                  title: item?.name,
                  key: item?.code,
                  isLeaf: true,
                  expanded: true,
                  children: [],
                }))}
                onSelect={selectedKeys => {
                  request.roleCode = selectedKeys[0];
                  sCrud.get(request);
                  navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
                }}
              />
            </Scrollbar>
          )}
        </div>
        <div className='mobile'>
          <Select
            value={request.roleCode}
            className={'w-full'}
            options={sCrud.typeResult?.data?.map(data => ({ label: data.name, value: data.code }))}
            onChange={e => {
              request.roleCode = e;
              sCrud.get(request);
              navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
            }}
          />
        </div>
      </Spin>
    </div>
  );
};

import { CButton } from '@/library/button';
import { CDataTable } from '@/library/data-table';
import { KEY_ROLE } from '@/utils';
const Main = () => {
  const sCrud = new SCrud<IMUser, IMUserRole>('User', 'UserRole');
  const sGlobal = SGlobal();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  return (
    <div className='card'>
      <div className='body'>
        <CDataTable
          defaultRequest={{ include: 'position' }}
          facade={sCrud}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination user', { from, to, total })}
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_STORE) && (
              <CButton
                icon={<CSvgIcon name='plus' size={12} />}
                text={t('Add new User', {
                  name: sCrud.typeResult?.data?.find(item => item.code === request.roleCode)?.name,
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
