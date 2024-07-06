import { Fragment, useEffect } from 'react';

import { EStatusState } from '@/enums';
import { CBreadcrumbs } from '@/library/breadcrumbs';
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
      <CBreadcrumbs title={t('Content')} list={[t('Setting'), t('Content')]} />
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
    <CDrawerForm
      facade={sContent}
      columns={_column.useForm()}
      title={t(sContent.data?.id ? 'Edit Content' : 'Add new Content', {
        name: sContentType.result?.data?.find(item => item.code === request.typeCode)?.name,
      })}
      onSubmit={values => {
        if (sContent.data?.id) sContent.put({ ...values, id: sContent.data.id, typeCode: request.typeCode });
        else sContent.post({ ...values, typeCode: request.typeCode });
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
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });
  const sContentType = SContentType();

  const sContent = SContent();
  const request = JSON.parse(sContent?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Type content')}</h3>
      </div>
      <Spin spinning={sContentType.isLoading}>
        <div className='desktop'>
          <PerfectScrollbar options={{ wheelSpeed: 1 }}>
            {sContentType.result?.data && (
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<CSvgIcon name='arrow' size={12} />}
                defaultSelectedKeys={[request.typeCode]}
                treeData={sContentType.result?.data?.map((item: any) => ({
                  title: item?.name,
                  key: item?.code,
                  isLeaf: true,
                  expanded: true,
                  children: [],
                }))}
                onSelect={selectedKeys => {
                  request.typeCode = selectedKeys[0];
                  sContent.get(request);
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
            options={sContentType?.result?.data?.map(data => ({ label: data.name, value: data.code }))}
            onChange={e => {
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

import { CButton } from '@/library/button';
import { CDataTable } from '@/library/data-table';
import { KEY_ROLE } from '@/utils';
const Main = () => {
  const sContent = SContent();
  const sGlobal = SGlobal();
  const sContentType = SContentType();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.content' });
  const request = JSON.parse(sContent?.queryParams ?? '{}');

  return (
    <div className='card'>
      <div className='body'>
        <CDataTable
          defaultRequest={{ include: 'languages' }}
          facade={sContent}
          paginationDescription={(from: number, to: number, total: number) =>
            t('Pagination content', { from, to, total })
          }
          columns={_column.useTable()}
          rightHeader={
            sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CONTENT_STORE) && (
              <CButton
                icon={<CSvgIcon name='plus' size={12} />}
                text={t('Add new Content', {
                  name: sContentType.result?.data?.find(item => item.code === request.typeCode)?.name,
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
