import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Spin } from 'antd';

import { EFormRuleType, EFormType } from '@/enums';
import { Form } from '@/library/form';
import { EStatusGlobal, SGlobal } from '@/services';
import { lang, routerLinks } from '@/utils';

const Page = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sGlobal = SGlobal();

  useEffect(() => {
    if (sGlobal.status === EStatusGlobal.loginFulfilled && sGlobal.user && Object.keys(sGlobal.user).length > 0) {
      navigate('/' + lang + '/dashboard', { replace: true });
      sGlobal.profile();
    }
  }, [sGlobal.status]);

  return (
    <Fragment>
      <div className="text-center mb-8">
        <h1
          className="intro-x text-3xl mb-8 font-bold text-teal-900 leading-8 md:text-5xl md:leading-10 lg:leading-10"
          id={'title-login'}
        >
          {t('routes.auth.login.title')}
        </h1>
        <h5 className="intro-x font-normal text-teal-900 ">{t('routes.auth.login.subTitle')}</h5>
      </div>
      <div className="mx-auto lg:w-3/4 relative">
        <Spin spinning={sGlobal.isLoading}>
          <Form
            values={{ ...sGlobal.data }}
            className="intro-x form-login"
            columns={[
              {
                name: 'email',
                title: t('columns.auth.login.Username'),
                formItem: {
                  placeholder: 'columns.auth.login.Enter Username',
                  rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.email }],
                },
              },
              {
                name: 'password',
                title: t('columns.auth.login.password'),
                formItem: {
                  placeholder: 'columns.auth.login.Enter Password',
                  type: EFormType.password,
                  notDefaultValid: true,
                  rules: [{ type: EFormRuleType.required }],
                },
              },
            ]}
            textSubmit={'routes.auth.login.Log In'}
            handSubmit={sGlobal.login}
            disableSubmit={sGlobal.isLoading}
          />
        </Spin>
        <div className="absolute  top-2/3 right-0 text-right">
          <button
            className={'text-teal-900 font-normal underline hover:no-underline mt-2'}
            onClick={() => navigate(`/${lang}${routerLinks('ForgetPassword')}`)}
          >
            {t('routes.auth.login.Forgot Password')}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
