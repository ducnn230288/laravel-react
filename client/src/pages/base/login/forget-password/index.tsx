import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Spin } from 'antd';

import { EFormRuleType } from '@/enums';
import { CForm } from '@/library/form';
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
    <div className='intro-x'>
      <h1>{t('Forgot Password')}</h1>
      <h5>{t('Please enter your email. An OTP verification code will be sent to you.')}</h5>
      <Spin spinning={sGlobal.isLoading}>
        <CForm
          values={{ ...sGlobal.data }}
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
          handSubmit={values => sGlobal.forgottenPassword({ ...values })}
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
