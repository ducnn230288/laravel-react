import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Spin } from 'antd';

import { EFormRuleType, EFormType } from '@/enums';
import { CForm } from '@/library/form';
import { EStatusGlobal, SGlobal } from '@/services';
import { lang, routerLinks } from '@/utils';

const Page = () => {
  const navigate = useNavigate();
  const sGlobal = SGlobal();

  useEffect(() => {
    if (sGlobal.status === EStatusGlobal.loginFulfilled && sGlobal.user && Object.keys(sGlobal.user).length > 0) {
      navigate('/' + lang + '/dashboard', { replace: true });
      sGlobal.profile();
    }
  }, [sGlobal.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.login' });

  return (
    <Fragment>
      <h1>{t('Sign In')}</h1>
      <h5>{t('Enter your details to login to your account')}</h5>
      <Spin spinning={sGlobal.isLoading}>
        <CForm
          values={{ ...sGlobal.data }}
          columns={[
            {
              name: 'email',
              title: t('Username'),
              formItem: {
                rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.email }],
              },
            },
            {
              name: 'password',
              title: t('Password'),
              formItem: {
                type: EFormType.password,
                notDefaultValid: true,
                rules: [{ type: EFormRuleType.required }],
              },
            },
          ]}
          extendForm={() => (
            <div className='-mt-2 text-right'>
              <button
                className='text-base-content/60'
                type='button'
                onClick={() => navigate(`/${lang}${routerLinks('ForgetPassword')}`)}
              >
                {t('Forgot Password')}
              </button>
            </div>
          )}
          textSubmit={t('Log In')}
          handSubmit={sGlobal.login}
          disableSubmit={sGlobal.isLoading}
        />
      </Spin>
    </Fragment>
  );
};

export default Page;
