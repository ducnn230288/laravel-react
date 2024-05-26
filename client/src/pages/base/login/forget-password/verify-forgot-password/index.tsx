import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Spin } from 'antd';

import { EFormRuleType, EFormType } from '@/enums';
import { Form } from '@/library/form';
import { EStatusGlobal, SGlobal } from '@/services';
import { lang, routerLinks } from '@/utils';
import { useTranslation } from 'react-i18next';

const Page = () => {
  const navigate = useNavigate();
  const sGlobal = SGlobal();

  useEffect(() => {
    if (sGlobal.status === EStatusGlobal.otpConfirmationFulfilled) {
      navigate(`/${lang}${routerLinks('SetPassword')}`, { replace: true });
    }
  }, [sGlobal.status]);

  useEffect(() => {
    if (!sGlobal.data?.email) navigate(`/${lang}${routerLinks('ForgetPassword')}`, { replace: true });
  }, []);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.login.forget-password.verify-forgot-password' });
  return (
    <Fragment>
      <div className="text-center mb-8">
        <h1 className="intro-x text-3xl mb-8 font-bold text-green-900 leading-8 md:text-5xl lg:leading-10">
          {t('Forgot Password')}
        </h1>
        <h5 className="intro-x font-normal text-green-900 ">
          {t('Please enter the OTP code that has been sent to your email.')}
        </h5>
      </div>
      <div className="mx-auto lg:w-full">
        <Spin spinning={sGlobal.isLoading}>
          <Form
            values={{ ...sGlobal.data }}
            className="intro-x form-forgetPassword"
            columns={[
              {
                name: 'otp',
                title: 'Code OTP',
                formItem: {
                  rules: [
                    { type: EFormRuleType.required },
                    { type: EFormRuleType.min, value: 6 },
                    { type: EFormRuleType.max, value: 6 },
                  ],
                },
              },
              {
                title: '',
                name: 'email',
                formItem: {
                  type: EFormType.hidden,
                },
              },
            ]}
            textSubmit={t('Send code')}
            handSubmit={(values) => sGlobal.otpConfirmation({ ...values })}
            disableSubmit={sGlobal.isLoading}
          />
        </Spin>
        <div className="mt-3 text-center">
          <button
            className={'text-sky-600 font-normal underline hover:no-underline hover:text-sky-500'}
            onClick={() => navigate(`/${lang}${routerLinks('Login')}`)}
          >
            {' '}
            {t('Go back to login')}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
