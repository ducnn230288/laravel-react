import { Spin } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { CForm } from '@/components/form';
import { EFormRuleType, EFormType, EStatusState } from '@/enums';
import { SGlobal } from '@/services';
import { lang, routerLinks } from '@/utils';

const Page = () => {
  const sGlobal = SGlobal();
  const navigate = useNavigate();
  useEffect(() => {
    if (sGlobal.status === EStatusState.isFulfilled) {
      sGlobal.set({ status: EStatusState.idle });
      navigate(`/${lang}${routerLinks('Login')}`, { replace: true });
    }
  }, [sGlobal.status]);

  useEffect(() => {
    if (!sGlobal.data?.email) navigate(`/${lang}${routerLinks('ForgetPassword')}`, { replace: true });
  }, []);

  const { t } = useTranslation('locale', {
    keyPrefix: 'pages.base.login.forget-password.verify-forgot-password.reset-password',
  });
  const columns = [
    {
      name: 'otp',
      title: '',
      formItem: {
        type: EFormType.hidden,
      },
    },
    {
      title: '',
      name: 'email',
      formItem: {
        type: EFormType.hidden,
      },
    },
    {
      name: 'password',
      title: t('Password'),
      formItem: {
        type: EFormType.password,
        rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.min, value: 6 }],
      },
    },
    {
      name: 'passwordConfirmation',
      title: t('Confirm Password'),
      formItem: {
        type: EFormType.password,
        rules: [
          { type: EFormRuleType.required },
          { type: EFormRuleType.min, value: 6 },
          {
            type: EFormRuleType.custom,
            validator: ({ getFieldValue }) => ({
              validator(_, value: string) {
                const errorMsg = t('Two passwords that you enter is inconsistent!');
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(errorMsg));
              },
            }),
          },
        ],
      },
    },
  ];
  return (
    <div className='intro-x'>
      <h1>{t('Reset Password')}</h1>
      <h5>
        {t(
          'Password requires 8 characters or more, with at least 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character.',
        )}
      </h5>
      <Spin spinning={sGlobal.isLoading}>
        <CForm
          values={{ ...sGlobal.data }}
          columns={columns}
          textSubmit={t('Submit')}
          handSubmit={values => sGlobal.postResetPassword({ ...values })}
          disableSubmit={sGlobal.isLoading}
        />
      </Spin>
    </div>
  );
};

export default Page;
