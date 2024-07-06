import { Fragment, useEffect } from 'react';

import { EStatusState } from '@/enums';
import { CBreadcrumbs } from '@/library/breadcrumbs';
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
      <CBreadcrumbs title={t('Code')} list={[t('Setting'), t('Code')]} />
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
    <CDrawerForm
      facade={sCode}
      columns={_column.useForm()}
      title={t(sCode.data?.id ? 'Edit Code' : 'Add new Code', {
        name: sCodeType.result?.data?.find(item => item.code === request.typeCode)?.name,
      })}
      onSubmit={values => {
        if (sCode.data?.id) sCode.put({ ...values, id: sCode.data.id, typeCode: request.typeCode });
        else sCode.post({ ...values, typeCode: request.typeCode });
      }}
    />
  );
};

import { CSvgIcon } from '@/library/svg-icon';
import { Select, Spin, Tree } from 'antd';
import queryString from 'query-string';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLocation, useNavigate } from 'react-router';
const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  const sCodeType = SCodeType();

  const sCode = SCode();
  const request = JSON.parse(sCode?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Type code')}</h3>
      </div>
      <Spin spinning={sCodeType.isLoading}>
        <div className='desktop'>
          <PerfectScrollbar options={{ wheelSpeed: 1 }}>
            {sCodeType.result?.data && (
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<CSvgIcon name='arrow' size={12} />}
                defaultSelectedKeys={[request.typeCode]}
                treeData={sCodeType.result?.data?.map((item: any) => ({
                  title: item?.name,
                  key: item?.code,
                  isLeaf: true,
                  expanded: true,
                  children: [],
                }))}
                onSelect={selectedKeys => {
                  request.typeCode = selectedKeys[0];
                  sCode.get(request);
                  navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
                }}
              />
            )}
          </PerfectScrollbar>
        </div>
        <div className='mobile'>
          <Select
            value={request.typeCode}
            className={'w-full'}
            options={sCodeType?.result?.data?.map(data => ({ label: data.name, value: data.code }))}
            onChange={e => {
              request.typeCode = e;
              sCode.get(request);
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
  const sCode = SCode();
  const sGlobal = SGlobal();
  const sCodeType = SCodeType();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  const request = JSON.parse(sCode?.queryParams ?? '{}');

  return (
    <div className='card'>
      <div className='body'>
        <CDataTable
          facade={sCode}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination code', { from, to, total })}
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_STORE) && (
              <CButton
                icon={<CSvgIcon name='plus' size={12} />}
                text={t('Add new Code', {
                  name: sCodeType.result?.data?.find(item => item.code === request.typeCode)?.name,
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
