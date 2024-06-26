import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Spin } from 'antd';

import { EFormRuleType, EFormType } from '@/enums';
import { CForm } from '@/library/form';
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
    <div className='intro-x'>
      <h1>{t('Forgot Password')}</h1>
      <h5>{t('Please enter the OTP code that has been sent to your email.')}</h5>
      <Spin spinning={sGlobal.isLoading}>
        <CForm
          values={{ ...sGlobal.data }}
          columns={[
            {
              name: 'otp',
              title: t('Code OTP'),
              formItem: {
                type: EFormType.otp,
                rules: [{ type: EFormRuleType.required }],
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
          handSubmit={values => sGlobal.otpConfirmation({ ...values })}
          disableSubmit={sGlobal.isLoading}
        />
      </Spin>
      <div className='mt-3 text-center'>
        <button onClick={() => navigate(`/${lang}${routerLinks('Login')}`)}>{t('Go back to login')}</button>
      </div>
    </div>
  );
};

export default Page;
