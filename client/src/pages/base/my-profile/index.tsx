import React, { Fragment, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Form as AntForm, Tabs } from 'antd';
import { useSearchParams } from 'react-router-dom';

import { User } from '@/assets/svg';
import { EFormRuleType, EFormType, ETableFilterType } from '@/enums';
import { Form } from '@/library/form';
import { Button } from '@/library/button';
import { SCode, EStatusGlobal, SGlobal } from '@/services';
import { lang, renderTitleBreadcrumbs, routerLinks } from '@/utils';

const Page = () => {
  const sGlobal = SGlobal();
  useEffect(() => {
    sGlobal.profile();
    renderTitleBreadcrumbs(t('pages.MyProfile'), []);
  }, []);
  useEffect(() => {
    switch (sGlobal.status) {
      case EStatusGlobal.putProfileFulfilled:
        sGlobal.profile();
        break;
    }
  }, [sGlobal.status]);

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const activeKey = useRef<string>(tab || '1');
  useEffect(() => {
    if (tab) activeKey.current = tab;
    const navList = document.querySelector<HTMLElement>('.ant-tabs-nav-list')!;
    const mediaQuery = window.matchMedia('(max-width: 375px)');

    if (tab === '2' && mediaQuery.matches) navList.style.transform = 'translate(-49px, 0px)';
    else navList.style.transform = 'translate(0px, 0px)';
  }, [tab]);

  const navigate = useNavigate();
  const onChangeTab = (key: string) => {
    activeKey.current = key;
    navigate(`/${lang}${routerLinks('MyProfile')}?tab=${key}`);
  };

  const [forms] = AntForm.useForm();

  const { t } = useTranslation();
  const roleName = useRef('');
  if (sGlobal.user?.role?.name) roleName.current = sGlobal.user.role.name;
  return (
    <Fragment>
      <div className="max-w-5xl mx-auto flex lg:flex-row flex-col w-full">
        <div className="flex-initial lg:w-[250px] mr-5 lg:rounded-xl w-full bg-white pt-6">
          <Form
            values={{ ...sGlobal.data }}
            formAnt={forms}
            className="text-center items-centers text-xl font-bold text-slate-700 profile"
            columns={[
              {
                title: '',
                name: 'avatar',
                formItem: {
                  type: EFormType.upload,
                },
              },
              {
                title: 'routes.admin.user.Full name',
                name: 'name',
                formItem: {
                  render: (_, values) => (
                    <div>
                      {values.name}
                      <div className="flex w-full flex-row justify-center pt-2 font-normal pb-3">
                        <User className="w-5 h-5 mr-2 fill-slate-500" />
                        <div className="text-base text-gray-500">{roleName.current}</div>
                      </div>
                    </div>
                  ),
                },
              },
            ]}
            disableSubmit={sGlobal.isLoading}
          />
        </div>
        <div className="flex-1 lg:rounded-xl w-auto">
          <Tabs
            onTabClick={(key: string) => onChangeTab(key)}
            activeKey={activeKey.current}
            size="large"
            className="profile"
            items={[
              {
                key: '1',
                label: t('routes.admin.Layout.My Profile'),
                children: (
                  <div className={'bg-white rounded-b-xl p-5'}>
                    <Form
                      values={{ ...sGlobal.data }}
                      columns={[
                        {
                          title: 'routes.admin.user.Full name',
                          name: 'name',
                          formItem: {
                            col: 12,
                            rules: [{ type: EFormRuleType.required }],
                          },
                        },
                        {
                          title: 'Email',
                          name: 'email',
                          formItem: {
                            col: 6,
                            rules: [
                              { type: EFormRuleType.required },
                              { type: EFormRuleType.email },
                              { type: EFormRuleType.min, value: 6 },
                            ],
                          },
                        },
                        {
                          title: 'routes.admin.user.Phone Number',
                          name: 'phoneNumber',
                          formItem: {
                            col: 6,
                            rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.phone, min: 10, max: 15 }],
                          },
                        },
                        {
                          title: 'routes.admin.user.Date of birth',
                          name: 'dob',
                          formItem: {
                            col: 6,
                            type: EFormType.date,
                            rules: [{ type: EFormRuleType.required }],
                          },
                        },
                        {
                          title: 'routes.admin.user.Position',
                          name: 'positionCode',
                          formItem: {
                            col: 6,
                            type: EFormType.selectTable,
                            rules: [{ type: EFormRuleType.required }],
                            get: {
                              facade: SCode,
                              params: (fullTextSearch: string) => ({
                                fullTextSearch,
                                typeCode: 'position',
                              }),
                              format: (item) => ({
                                label: item?.name,
                                value: item?.code,
                              }),
                              data: () => sGlobal.data?.position,
                              column: [
                                {
                                  title: 'titles.Code',
                                  name: 'code',
                                  tableItem: {
                                    width: 100,
                                    filter: { type: ETableFilterType.search },
                                    sorter: true,
                                  },
                                },
                                {
                                  title: 'routes.admin.Code.Name',
                                  name: 'name',
                                  tableItem: {
                                    filter: { type: ETableFilterType.search },
                                    sorter: true,
                                  },
                                },
                              ],
                            },
                          },
                        },
                        {
                          title: 'routes.admin.user.Description',
                          name: 'description',
                          formItem: {
                            type: EFormType.textarea,
                          },
                        },
                      ]}
                      disableSubmit={sGlobal.isLoading}
                      handSubmit={(values) =>
                        sGlobal.putProfile({ ...values, avatar: forms.getFieldValue('avatar')[0].url })
                      }
                      extendButton={() => (
                        <Button
                          text={t('components.datatable.cancel')}
                          className={'md:w-32 justify-center out-line max-sm:w-3/5'}
                          onClick={() => {
                            navigate(`/${lang}${routerLinks('MyProfile')}`);
                          }}
                        />
                      )}
                    />
                  </div>
                ),
              },
              {
                key: '2',
                label: t('routes.admin.Layout.Change Password'),
                children: (
                  <div className={'bg-white rounded-b-xl p-5'}>
                    <Form
                      values={{ ...sGlobal.data }}
                      columns={[
                        {
                          title: 'columns.auth.login.password',
                          name: 'passwordOld',
                          formItem: {
                            notDefaultValid: true,
                            col: 12,
                            type: EFormType.password,
                            rules: [{ type: EFormRuleType.required }],
                          },
                        },
                        {
                          title: 'columns.auth.login.New password',
                          name: 'password',
                          formItem: {
                            col: 12,
                            type: EFormType.password,
                            rules: [{ type: EFormRuleType.required }],
                          },
                        },
                        {
                          title: 'columns.auth.login.Confirm Password',
                          name: 'retypedPassword',
                          formItem: {
                            notDefaultValid: true,
                            col: 12,
                            type: EFormType.password,
                            rules: [
                              {
                                type: EFormRuleType.custom,
                                validator: ({ getFieldValue }) => ({
                                  validator(_, value: string) {
                                    const errorMsg = t('components.form.ruleConfirmPassword');
                                    if (!value || getFieldValue('password') === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(errorMsg));
                                  },
                                }),
                              },
                              { type: EFormRuleType.required },
                            ],
                          },
                        },
                      ]}
                      disableSubmit={sGlobal.isLoading}
                      extendButton={() => (
                        <Button
                          text={t('components.datatable.cancel')}
                          className={'md:min-w-32 justify-center out-line max-sm:w-3/5'}
                          onClick={() => {
                            navigate(`/${lang}${routerLinks('MyProfile')}`);
                          }}
                        />
                      )}
                      textSubmit="routes.admin.Layout.Change Password"
                      handSubmit={(values) => {
                        const { name, email, phoneNumber, dob, positionCode, description } = sGlobal.user!;
                        sGlobal.putProfile({ name, email, phoneNumber, dob, positionCode, description, ...values });
                      }}
                    />
                  </div>
                ),
              },
            ]}
          ></Tabs>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
