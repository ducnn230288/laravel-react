import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Spin, Tree } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import classNames from 'classnames';
import { createSearchParams } from 'react-router-dom';

import { Arrow } from '@/assets/svg';
import { EFormType } from '@/enums';
import { getQueryStringParams } from '@/library/data-table';
import { Form } from '@/library/form';
import { SParameter } from '@/services';
import { lang, renderTitleBreadcrumbs, routerLinks } from '@/utils';

const Page = () => {
  const sParameter = SParameter();
  const location = useLocation();
  const request = getQueryStringParams(location.search);
  useEffect(() => {
    if (!sParameter.result?.data) sParameter.get({});
    renderTitleBreadcrumbs(t('pages.Parameter'), [
      { title: t('titles.Setting'), link: '' },
      { title: t('titles.Parameter'), link: '' },
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
  console.log(request.code);
  console.log(sParameter.result?.data);
  const { t } = useTranslation();
  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <div className="col-span-12 md:col-span-4 lg:col-span-3 -intro-x">
        <div className="shadow rounded-xl w-full bg-white overflow-hidden">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>{t('titles.Parameter')}</h3>
          </div>
          <Spin spinning={sParameter.isLoading}>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto relative scroll hidden sm:block">
              <Tree
                blockNode
                showLine
                autoExpandParent
                defaultExpandAll
                switcherIcon={<Arrow className={'w-4 h-4'} />}
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
                      className="truncate cursor-pointer flex-1 hover:text-teal-900 item-text px-3 py-1"
                    >
                      {data.title}
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="p-2 sm:p-0 block sm:hidden">
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
      <div className="col-span-12 md:col-span-8 lg:col-span-9 intro-x">
        <div className="shadow rounded-xl w-full overflow-auto bg-white">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>{t('pages.Parameter/Edit', { type: request.code })}</h3>
          </div>
          <div className="sm:min-h-[calc(100vh-12rem)] overflow-y-auto p-3">
            <Spin spinning={sParameter.isLoading}>
              <Form
                values={{ ...sParameter.data }}
                className="intro-x"
                columns={[
                  {
                    title: 'routes.admin.Layout.Vietnam',
                    name: 'vn',
                    formItem: {
                      col: 6,
                      type: EFormType.textarea,
                    },
                  },
                  {
                    title: 'routes.admin.Layout.English',
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
