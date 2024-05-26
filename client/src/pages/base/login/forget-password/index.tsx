import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Spin } from 'antd';

import { EFormRuleType } from '@/enums';
import { Form } from '@/library/form';
import { EStatusGlobal, SGlobal } from '@/services';
import { lang, routerLinks } from '@/utils';

const Page = () => {
  const navigate = useNavigate();
  const sGlobal = SGlobal();

  useEffect(() => {
    if (sGlobal.status === EStatusGlobal.forgottenPasswordFulfilled) {
      navigate(`/${lang}${routerLinks('VerifyForotPassword')}`);
    }
  }, [sGlobal.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.login.forget-password' });
  return (
    <Fragment>
      <div className="text-center mb-8">
        <h1
          className="intro-x text-3xl mb-8 font-bold text-green-900 leading-8 md:text-5xl lg:leading-10"
          id={'title-login'}
        >
          {t('Forgot Password')}
        </h1>
        <h5 className="intro-x font-normal text-green-900 ">
          {t('Please enter your email. An OTP verification code will be sent to you.')}
        </h5>
      </div>
      <div className="mx-auto lg:w-3/4">
        <Spin spinning={sGlobal.isLoading}>
          <Form
            values={{ ...sGlobal.data }}
            className="intro-x form-forgetPassword"
            columns={[
              {
                name: 'email',
                title: t('Recovery Email'),
                formItem: {
                  rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.email }],
                },
              },
            ]}
            textSubmit={t('Get OTP')}
            handSubmit={(values) => sGlobal.forgottenPassword({ ...values })}
            disableSubmit={sGlobal.isLoading}
          />
        </Spin>
        <div className="text-center mt-3">
          <button
            className={'text-sky-600 font-normal underline hover:no-underline hover:text-sky-500'}
            onClick={() => navigate(`/${lang}${routerLinks('Login')}`)}
          >
            {t('Go back to login')}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
