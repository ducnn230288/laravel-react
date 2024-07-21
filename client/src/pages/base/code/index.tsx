import queryString from 'query-string';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CSideTree } from '@/components/slide-tree';
import { EStatusState } from '@/enums';
import { SCrud, SGlobal } from '@/services';
import type { IMCode, IMCodeType } from '@/types/model';

const Page = () => {
  const sCrud = SCrud<IMCode, IMCodeType>('Code', 'CodeType');

  useEffect(() => {
    return () => {
      sCrud.reset();
    };
  }, []);

  useEffect(() => {
    if (sCrud.result && !sCrud?.resultType) sCrud.getType({});
  }, [sCrud.result]);

  const request = JSON.parse(sCrud?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  return (
    <Fragment>
      <CBreadcrumbs title={t('Code')} list={[t('Setting'), t('Code')]} />
      <Form />
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <CSideTree
            label={t('Type code')}
            isLoading={sCrud.isLoadingType}
            listData={sCrud.resultType?.data}
            value={request.typeCode}
            onSelect={e => {
              request.typeCode = e;
              sCrud.get(request);
              navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
            }}
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

import { CDrawerForm } from '@/components/drawer';
import _column from './column';
const Form = () => {
  const sCrud = SCrud<IMCode, IMCodeType>('Code', 'CodeType');
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  useEffect(() => {
    if (sCrud.status === EStatusState.isFulfilled) {
      sCrud.get(request);
    }
  }, [sCrud.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  return (
    <CDrawerForm
      facade={sCrud}
      columns={_column.useForm()}
      title={t(sCrud.data?.id ? 'Edit Code' : 'Add new Code', {
        name: sCrud.resultType?.data?.find(item => item.code === request.typeCode)?.name,
      })}
      onSubmit={values => {
        if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, typeCode: request.typeCode });
        else sCrud.post({ ...values, typeCode: request.typeCode });
      }}
    />
  );
};

import { CDataTable } from '@/components/data-table';
import { KEY_ROLE } from '@/utils';
const Main = () => {
  const sCrud = SCrud<IMCode, IMCodeType>('Code', 'CodeType');
  const sGlobal = SGlobal();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.code' });
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  return (
    <div className='card'>
      <div className='body'>
        <CDataTable
          action={{
            disable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_UPDATE) && sCrud.put,
            edit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_UPDATE) && sCrud.getById,
            delete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_DESTROY) && sCrud.delete,
            label: t('Code'),
            name: data => data.name,
            add: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_STORE) && sCrud.set,
            labelAdd: t('Add new Code', {
              name: sCrud.resultType?.data?.find(item => item.code === request.typeCode)?.name,
            }),
          }}
          facade={sCrud}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination code', { from, to, total })}
          columns={_column.useTable()}
        />
      </div>
    </div>
  );
};
