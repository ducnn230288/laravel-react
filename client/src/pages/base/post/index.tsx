import queryString from 'query-string';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CSideTree } from '@/components/slide-tree';
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

  const sGlobal = SGlobal();
  const request = JSON.parse(sCrud?.queryParams ?? '{}');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
  return (
    <Fragment>
      <CBreadcrumbs title={t('Post')} list={[t('Setting'), t('Post')]} />
      <FormPost />
      <FormPostType />
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <CSideTree
            label={t('Type Post')}
            isLoading={sCrud.isLoadingType}
            listData={sCrud.resultType?.data}
            value={request.typeCode}
            onAdd={sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_STORE) && sCrud.set}
            onEdit={sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_UPDATE) && sCrud.getByIdType}
            onDelete={sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_DESTROY) && sCrud.deleteType}
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

import { CDrawerForm } from '@/components/drawer';
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

import { CDataTable } from '@/components/data-table';
import { KEY_ROLE } from '@/utils';
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
            onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_UPDATE) && sCrud.put,
            onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_UPDATE) && sCrud.getById,
            onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_DESTROY) && sCrud.delete,
            label: t('Post'),
            name: data =>
              data.languages?.length
                ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng')).name
                : '',
            onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_STORE) && sCrud.set,
            labelAdd: t('Add new Post', {
              name: sCrud.resultType?.data?.find(item => item.code === request.typeCode)?.name,
            }),
          }}
          defaultRequest={{ include: 'languages' }}
          facade={sCrud}
          paginationDescription={(from: number, to: number, total: number) => t('Pagination post', { from, to, total })}
          columns={_column.useTable()}
        />
      </div>
    </div>
  );
};

export default Page;
