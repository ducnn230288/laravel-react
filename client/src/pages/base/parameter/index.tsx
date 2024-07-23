import queryString from 'query-string';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CSideTree } from '@/components/slide-tree';
import { SCrud } from '@/services';
import type { IMParameter } from '@/types/model';

const Page = () => {
  const sCrud = SCrud<IMParameter>('Parameter');
  const location = useLocation();
  useEffect(() => {
    sCrud.get({});
    return () => {
      sCrud.reset();
    };
  }, []);

  const request = JSON.parse(sCrud?.queryParams ?? '{}');
  const navigate = useNavigate();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.parameter' });
  const value =
    sCrud.data?.code ?? queryString.parse(location.search, { arrayFormat: 'index' })?.code?.toString() ?? 'ADDRESS';
  const onSelect = e => {
    request.code = e;
    sCrud.getById({ id: request.code });
    navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
  };
  return (
    <Fragment>
      <CBreadcrumbs title={t('Parameter')} list={[t('Setting'), t('Parameter')]} />
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <CSideTree
            label={t('Parameter')}
            isLoading={sCrud.isLoading}
            listData={sCrud.result?.data}
            value={value}
            onSelect={onSelect}
          />
        </div>
        <div className='intro-x right'>
          <Main />
        </div>
      </div>
    </Fragment>
  );
};
export default Page;

import { CForm } from '@/components/form';
import { EFormType } from '@/enums';
import { Spin } from 'antd';
const Main = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.parameter' });
  const sCrud = SCrud<IMParameter>('Parameter');
  const data =
    sCrud.data ??
    sCrud.result?.data?.find(
      item =>
        item.code === (queryString.parse(location.search, { arrayFormat: 'index' })?.code?.toString() ?? 'ADDRESS'),
    );
  const columns = [
    {
      title: t('Vietnamese parameter'),
      name: 'vi',
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
  ];
  return (
    <div className='card'>
      <div className='header'>
        <h3>{t('Edit Parameter', { code: data?.name })}</h3>
      </div>
      <div className='desktop has-header'>
        <Spin spinning={sCrud.isLoading}>
          <CForm
            values={{ ...data }}
            className='intro-x'
            columns={columns}
            handSubmit={values => sCrud.put({ ...values, id: data!.code })}
            disableSubmit={sCrud.isLoading}
          />
        </Spin>
      </div>
    </div>
  );
};
