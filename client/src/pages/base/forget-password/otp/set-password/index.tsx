import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Spin } from 'antd';

import { EFormRuleType, EFormType } from '@/enums';
import { Form } from '@/library/form';
import { EStatusGlobal, SGlobal } from '@/services';
import { lang, routerLinks } from '@/utils';

const Page = () => {
  const sGlobal = SGlobal();
  const navigate = useNavigate();
  useEffect(() => {
    if (sGlobal.status === EStatusGlobal.resetPasswordFulfilled) {
      navigate(`/${lang}${routerLinks('Login')}`, { replace: true });
    }
  }, [sGlobal.status]);
  useEffect(() => {
    if (!sGlobal.data?.email) navigate(`/${lang}${routerLinks('ForgetPassword')}`, { replace: true });
  }, []);

  const { t } = useTranslation();
  return (
    <Fragment>
      <div className="text-center mb-8 mx-auto">
        <h1
          className="intro-x text-3xl mb-10 font-bold text-green-900 leading-8 md:text-5xl lg:leading-10"
          id={'title-login'}
        >
          {t('routes.auth.reset-password.title')}
        </h1>
        <h5 className="intro-x font-normal text-green-900">
          {t('routes.auth.reset-password.subReset')}
          <br></br> {t('routes.auth.reset-password.subReset1')}
        </h5>
      </div>
      <Spin spinning={sGlobal.isLoading}>
        <Form
          className="intro-x form-login"
          values={{ ...sGlobal.data }}
          columns={[
            {
              name: 'otp',
              title: 'routes.auth.reset-password.Code OTP',
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
              title: 'columns.auth.login.password',
              formItem: {
                placeholder: 'columns.auth.login.Enter Password',
                type: EFormType.password,
                rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.min, value: 6 }],
              },
            },
            {
              name: 'retypedPassword',
              title: 'columns.auth.register.retypedPassword',
              formItem: {
                placeholder: 'columns.auth.register.retypedPassword',
                type: EFormType.password,
                rules: [
                  { type: EFormRuleType.required },
                  { type: EFormRuleType.min, value: 6 },
                  {
                    type: EFormRuleType.custom,
                    validator: ({ getFieldValue }) => ({
                      validator(rule, value: string) {
                        const errorMsg = t('columns.auth.placeholder.subConfirm');
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
          ]}
          textSubmit={'routes.auth.reset-password.Submit'}
          handSubmit={(values) => sGlobal.resetPassword({ ...values })}
          disableSubmit={sGlobal.isLoading}
        />
      </Spin>
    </Fragment>
  );
};

export default Page;
