import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Spin } from 'antd';

import { EFormRuleType } from '@/enums';
import { Form } from '@/library/form';
import { EStatusGlobal, SGlobal } from '@/services';
import { lang, routerLinks } from '@/utils';

const Page = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sGlobal = SGlobal();
  useEffect(() => {
    if (sGlobal.status === EStatusGlobal.forgottenPasswordFulfilled) {
      navigate(`/${lang}${routerLinks('VerifyForotPassword')}`);
    }
  }, [sGlobal.status]);

  return (
    <Fragment>
      <div className="text-center mb-8">
        <h1
          className="intro-x text-3xl mb-8 font-bold text-green-900 leading-8 md:text-5xl lg:leading-10"
          id={'title-login'}
        >
          {t('routes.auth.login.Forgot Password')}
        </h1>
        <h5 className="intro-x font-normal text-green-900 ">{t('routes.auth.reset-password.subTitle')}</h5>
      </div>
      <div className="mx-auto lg:w-3/4">
        <Spin spinning={sGlobal.isLoading}>
          <Form
            values={{ ...sGlobal.data }}
            className="intro-x form-forgetPassword"
            columns={[
              {
                name: 'email',
                title: t('columns.auth.reset-password.Recovery Email'),
                formItem: {
                  placeholder: 'columns.auth.reset-password.Recovery Email',
                  rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.email }],
                },
              },
            ]}
            textSubmit={'routes.auth.reset-password.OTP'}
            handSubmit={(values) => sGlobal.forgottenPassword({ ...values })}
            disableSubmit={sGlobal.isLoading}
          />
        </Spin>
        <div className="text-center mt-3">
          <button
            className={'text-sky-600 font-normal underline hover:no-underline hover:text-sky-500'}
            onClick={() => navigate(`/${lang}${routerLinks('Login')}`)}
          >
            {' '}
            {t('routes.auth.reset-password.Go back to login')}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
