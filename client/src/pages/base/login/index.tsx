import { Spin } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { CForm } from '@/components/form';
import { EFormRuleType, EFormType, EStatusState } from '@/enums';
import { SGlobal } from '@/services';
import { lang, routerLinks } from '@/utils';

const Page = () => {
  const navigate = useNavigate();
  const sGlobal = SGlobal();

  useEffect(() => {
    if (sGlobal.status === EStatusState.isFulfilled && sGlobal.user && Object.keys(sGlobal.user).length > 0) {
      sGlobal.set({ status: EStatusState.idle });
      navigate('/' + lang + '/dashboard', { replace: true });
    }
  }, [sGlobal.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.login' });
  const columns = [
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
  ];
  const renderExtendForm = () => (
    <div className='-mt-2 text-right'>
      <button
        className='text-base-content/60'
        type='button'
        onClick={() => navigate(`/${lang}${routerLinks('ForgetPassword')}`)}
        title={t('Forgot Password')}
      >
        {t('Forgot Password')}
      </button>
    </div>
  );
  return (
    <div className='intro-x'>
      <h1>{t('Sign In')}</h1>
      <h5>{t('Enter your details to login to your account')}</h5>
      <Spin spinning={sGlobal.isLoading}>
        <CForm
          values={{ ...sGlobal.data }}
          columns={columns}
          extendForm={renderExtendForm}
          textSubmit={t('Log In')}
          handSubmit={sGlobal.postLogin}
          disableSubmit={sGlobal.isLoading}
        />
      </Spin>
    </div>
  );
};

export default Page;
