import { Fragment, useEffect } from 'react';

import { EStatusState } from '@/enums';
import { CBreadcrumbs } from '@/library/breadcrumbs';
import { SCrud, SGlobal } from '@/services';
import type { IMCode, IMCodeType } from '@/types/model';

const Page = () => {
  const sCrud = new SCrud<IMCode, IMCodeType>('Code', 'CodeType');

  useEffect(() => {
    return () => {
      sCrud.reset();
    };
  }, []);

  useEffect(() => {
    if (sCrud.result && !sCrud?.typeResult) sCrud.getType({});
  }, [sCrud.result]);

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
  const sCrud = new SCrud<IMCode, IMCodeType>('Code', 'CodeType');
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  useEffect(() => {
    if (sCrud.status === EStatusState.reGet) {
      sCrud.get(request);
    }
  }, [sCrud.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  return (
    <CDrawerForm
      facade={sCrud}
      columns={_column.useForm()}
      title={t(sCrud.data?.id ? 'Edit Code' : 'Add new Code', {
        name: sCrud.typeResult?.data?.find(item => item.code === request.typeCode)?.name,
      })}
      onSubmit={values => {
        if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, typeCode: request.typeCode });
        else sCrud.post({ ...values, typeCode: request.typeCode });
      }}
    />
  );
};

import { Scrollbar } from '@/library/scrollbar';
import { CSvgIcon } from '@/library/svg-icon';
import { Select, Spin, Tree } from 'antd';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router';
const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });

  const sCrud = new SCrud<IMCode, IMCodeType>('Code', 'CodeType');
  const request = JSON.parse(sCrud?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Type code')}</h3>
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
                  request.typeCode = selectedKeys[0];
                  sCrud.get(request);
                  navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
                }}
              />
            </Scrollbar>
          )}
        </div>
        <div className='mobile'>
          <Select
            value={request.typeCode}
            className={'w-full'}
            options={sCrud.typeResult?.data?.map(data => ({ label: data.name, value: data.code }))}
            onChange={e => {
              request.typeCode = e;
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
  const sCrud = new SCrud<IMCode, IMCodeType>('Code', 'CodeType');
  const sGlobal = SGlobal();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  return (
    <div className='card'>
      <div className='body'>
        <CDataTable
          facade={sCrud}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination code', { from, to, total })}
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_STORE) && (
              <CButton
                icon={<CSvgIcon name='plus' size={12} />}
                text={t('Add new Code', {
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
