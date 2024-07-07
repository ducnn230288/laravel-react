import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { CBreadcrumbs } from '@/library/breadcrumbs';
import { SCrud } from '@/services';
import type { IMParameter } from '@/types/model';

const Page = () => {
  const sCrud = new SCrud<IMParameter>('Parameter');
  const location = useLocation();
  useEffect(() => {
    sCrud.get({});
    sCrud.getById({
      id: queryString.parse(location.search, { arrayFormat: 'index' })?.code?.toString() ?? 'ADDRESS',
    });
    return () => {
      sCrud.reset();
    };
  }, []);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.parameter' });
  return (
    <Fragment>
      <CBreadcrumbs title={t('Parameter')} list={[t('Setting'), t('Parameter')]} />
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

import { Select, Spin, Tree } from 'antd';
import queryString from 'query-string';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { CSvgIcon } from '@/library/svg-icon';
const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.parameter' });
  const sCrud = new SCrud<IMParameter>('Parameter');
  const request = JSON.parse(sCrud?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Parameter')}</h3>
      </div>
      <Spin spinning={sCrud.isLoading}>
        <div className='desktop'>
          <PerfectScrollbar options={{ wheelSpeed: 1 }}>
            {sCrud.result?.data && (
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<CSvgIcon name='arrow' size={12} />}
                selectedKeys={[sCrud.data?.code ?? '']}
                treeData={sCrud.result?.data?.map(item => ({
                  title: item?.name,
                  key: item?.code,
                  isLeaf: true,
                  expanded: true,
                  children: [],
                }))}
                onSelect={selectedKeys => {
                  request.code = selectedKeys[0];
                  sCrud.getById({ id: request.code });
                  navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
                }}
              />
            )}
          </PerfectScrollbar>
        </div>
        <div className='mobile'>
          <Select
            value={sCrud.data?.code}
            className={'w-full'}
            options={sCrud?.result?.data?.map(data => ({ label: data.name, value: data.code }))}
            onChange={e => {
              request.code = e;
              sCrud.getById({ id: e });
              navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
            }}
          />
        </div>
      </Spin>
    </div>
  );
};

import { EFormType } from '@/enums';
import { CForm } from '@/library/form';
const Main = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.parameter' });
  const sCrud = new SCrud<IMParameter>('Parameter');

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Edit Parameter', { code: sCrud.data?.name })}</h3>
      </div>
      <div className='desktop has-header'>
        <Spin spinning={sCrud.isLoading}>
          <CForm
            values={{ ...sCrud.data }}
            className='intro-x'
            columns={[
              {
                title: t('Vietnamese parameter'),
                name: 'vn',
                formItem: {
                  col: 6,
                  type: EFormType.textarea,
                },
              },
              {
                title: t('English parameter'),
                name: 'en',
                formItem: {
                  col: 6,
                  type: EFormType.textarea,
                },
              },
            ]}
            handSubmit={values => sCrud.put({ ...values, id: sCrud.data!.code })}
            disableSubmit={sCrud.isLoading}
          />
        </Spin>
      </div>
    </div>
  );
};
