import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router';

import { Breadcrumbs } from '@/library/breadcrumbs';
import { SParameter } from '@/services';

const Page = () => {
  const sParameter = SParameter();
  const location = useLocation();
  useEffect(() => {
    if (!sParameter.result?.data) sParameter.get({});
    sParameter.getById({
      id: queryString.parse(location.search, { arrayFormat: 'index' })?.code?.toString() ?? 'ADDRESS',
    });
  }, []);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.parameter' });
  return (
    <Fragment>
      <Breadcrumbs title={t('Parameter')} list={[t('Setting'), t('Parameter')]} />
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

import queryString from 'query-string';
import { Select, Spin, Tree } from 'antd';
import { Arrow } from '@/assets/svg';
const Side = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.parameter' });
  const sParameter = SParameter();
  const request = JSON.parse(sParameter?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Parameter')}</h3>
      </div>
      <Spin spinning={sParameter.isLoading}>
        <div className='desktop'>
          {sParameter.result?.data && (
            <Tree
              blockNode
              showLine
              autoExpandParent
              defaultExpandAll
              switcherIcon={<Arrow className={'size-3'} />}
              selectedKeys={[sParameter.data?.code ?? '']}
              treeData={sParameter.result?.data?.map(item => ({
                title: item?.name,
                key: item?.code,
                isLeaf: true,
                expanded: true,
                children: [],
              }))}
              onSelect={selectedKeys => {
                request.code = selectedKeys[0];
                sParameter.getById({ id: request.code });
                navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
              }}
            />
          )}
        </div>
        <div className='mobile'>
          <Select
            value={sParameter.data?.code}
            className={'w-full'}
            options={sParameter?.result?.data?.map(data => ({ label: data.name, value: data.code }))}
            onChange={e => {
              request.code = e;
              sParameter.getById({ id: e });
              navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
            }}
          />
        </div>
      </Spin>
    </div>
  );
};

import { Form } from '@/library/form';
import { EFormType } from '@/enums';
const Main = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.parameter' });
  const sParameter = SParameter();

  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Edit Parameter', { code: sParameter.data?.name })}</h3>
      </div>
      <div className='desktop has-header'>
        <Spin spinning={sParameter.isLoading}>
          <Form
            values={{ ...sParameter.data }}
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
            handSubmit={values => sParameter.put({ ...values, id: sParameter.data!.code })}
            disableSubmit={sParameter.isLoading}
          />
        </Spin>
      </div>
    </div>
  );
};
