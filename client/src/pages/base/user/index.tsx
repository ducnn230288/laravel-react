import queryString from 'query-string';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CSideTree } from '@/components/slide-tree';
import { EStatusState } from '@/enums';
import { SCrud, SGlobal } from '@/services';
import type { IMUser, IMUserRole } from '@/types/model';

const Page = () => {
  const sCrud = SCrud<IMUser, IMUserRole>('User', 'UserRole');
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
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  const onSelect = e => {
    request.roleCode = e;
    sCrud.get(request);
    navigate(location.pathname + '?' + queryString.stringify(request, { arrayFormat: 'index' }));
  };
  return (
    <Fragment>
      <CBreadcrumbs title={t('User')} list={[t('User')]} />
      <Form />
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <CSideTree
            label={t('Role')}
            isLoading={sCrud.isLoadingType}
            listData={sCrud.resultType?.data}
            value={request.roleCode}
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

import { CDrawerForm } from '@/components/drawer';
import { KEY_ROLE, searchTree } from '@/utils';
import _column from './column';
const Form = () => {
  const sCrud = SCrud<IMUser, IMUserRole>('User', 'UserRole');
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  useEffect(() => {
    if (sCrud.status === EStatusState.isFulfilled) {
      sCrud.get(request);
    }
  }, [sCrud.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  const onSubmit = values => {
    if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, roleCode: request.roleCode });
    else sCrud.post({ ...values, roleCode: request.roleCode });
  };
  return (
    <CDrawerForm
      facade={sCrud}
      columns={_column.useForm()}
      title={t(sCrud.data?.id ? 'Edit User' : 'Add new User', {
        name: searchTree({ array: sCrud.resultType?.data, value: request.roleCode, key: 'code' })?.name,
      })}
      onSubmit={onSubmit}
    />
  );
};

import { CDataTable } from '@/components/data-table';
const Main = () => {
  const sCrud = SCrud<IMUser, IMUserRole>('User', 'UserRole');
  const sGlobal = SGlobal();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.user' });
  const request = JSON.parse(sCrud?.queryParams ?? '{}');

  return (
    <div className='card'>
      <div className='body'>
        <CDataTable
          action={{
            onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_UPDATE) && sCrud.put,
            onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_UPDATE) && sCrud.getById,
            onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_DESTROY) && sCrud.delete,
            label: t('User'),
            name: data => data.name,
            onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_STORE) && sCrud.set,
            labelAdd: t('Add new User', {
              name: searchTree({ array: sCrud.resultType?.data, value: request.roleCode, key: 'code' })?.name,
            }),
          }}
          defaultRequest={{ include: 'position' }}
          facade={sCrud}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination user', { from, to, total })}
          columns={_column.useTable()}
        />
      </div>
    </div>
  );
};
