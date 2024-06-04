import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Spin, Tree } from 'antd';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import { createSearchParams } from 'react-router-dom';

import { Arrow } from '@/assets/svg';
import { EFormType } from '@/enums';
import { Breadcrumbs } from '@/library/breadcrumbs';
import { Form } from '@/library/form';
import { SParameter } from '@/services';
import { lang, routerLinks } from '@/utils';

const Page = () => {
  const sParameter = SParameter();
  const request = JSON.parse(sParameter?.queryParams ?? '{}');
  useEffect(() => {
    if (!sParameter.result?.data) sParameter.get({});
    Breadcrumbs(t('Parameter'), [
      { title: t('Setting'), link: '' },
      { title: t('Parameter'), link: '' },
    ]);
    sParameter.getById({ id: request.code });
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (
      sParameter?.result?.data?.length &&
      !sParameter?.result?.data?.filter((item) => item.code === request.code).length
    ) {
      navigate({
        pathname: `/${lang}${routerLinks('Parameter')}`,
        search: `?${createSearchParams({ code: 'ADDRESS' })}`,
      });
    }
  }, [sParameter.result]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.parameter' });
  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <div className="-intro-x col-span-12 md:col-span-4 lg:col-span-3">
        <div className="w-full overflow-hidden rounded-xl bg-white shadow">
          <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4 py-2">
            <h3 className={'text-lg font-bold'}>{t('Parameter')}</h3>
          </div>
          <Spin spinning={sParameter.isLoading}>
            <div className="relative hidden h-[calc(100vh-12rem)] overflow-y-auto sm:block">
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<Arrow className={'size-4'} />}
                treeData={sParameter.result?.data?.map((item: any) => ({
                  title: item?.name,
                  key: item?.code,
                  value: item?.code,
                  isLeaf: true,
                  expanded: true,
                  children: [],
                }))}
                titleRender={(data: any) => (
                  <div
                    className={classNames(
                      { 'bg-gray-100': request.code === data.key },
                      'item text-gray-700 font-medium hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 w-full text-left  group',
                    )}
                  >
                    <div
                      onClick={() => {
                        navigate({
                          pathname: `/${lang}${routerLinks('Parameter')}`,
                          search: `?${createSearchParams({ code: data.value! })}`,
                        });
                        sParameter.getById({ id: data.value! });
                      }}
                      className="flex-1 cursor-pointer truncate px-3 py-1 hover:text-teal-900"
                    >
                      {data.title}
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="block p-2 sm:hidden sm:p-0">
              <Select
                value={request.code}
                className={'w-full'}
                options={sParameter.result?.data?.map((data) => ({ label: data.code, value: data.code }))}
                onChange={(code) => {
                  navigate({
                    pathname: `/${lang}${routerLinks('Parameter')}`,
                    search: `?${createSearchParams({ code })}`,
                  });
                  sParameter.getById({ id: code });
                }}
              />
            </div>
          </Spin>
        </div>
      </div>
      <div className="intro-x col-span-12 md:col-span-8 lg:col-span-9">
        <div className="w-full overflow-auto rounded-xl bg-white shadow">
          <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4 py-2">
            <h3 className={'text-lg font-bold'}>{t('Edit Parameter', { code: request.code })}</h3>
          </div>
          <div className="overflow-y-auto p-3 sm:min-h-[calc(100vh-12rem)]">
            <Spin spinning={sParameter.isLoading}>
              <Form
                values={{ ...sParameter.data }}
                className="intro-x"
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
                handSubmit={(values) => sParameter.put({ ...values, id: sParameter.data!.code })}
                disableSubmit={sParameter.isLoading}
              />
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
