import { Form, Tabs, type FormInstance } from 'antd';
import { Fragment, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { EFormRuleType, EFormType } from '@/enums';
import { CBreadcrumbs } from '@/library/breadcrumbs';
import { EStatusGlobal, SGlobal } from '@/services';
import { lang, routerLinks } from '@/utils';
import './index.less';

const Page = () => {
  const sGlobal = SGlobal();
  useEffect(() => {
    sGlobal.profile();
  }, []);

  useEffect(() => {
    if (sGlobal.status === EStatusGlobal.putProfileFulfilled) sGlobal.profile();
  }, [sGlobal.status]);

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const activeKey = useRef<string>(tab ?? '1');

  const navigate = useNavigate();
  const onChangeTab = (key: string) => {
    activeKey.current = key;
    navigate(`/${lang}${routerLinks('MyProfile')}?tab=${key}`);
  };

  const [form] = Form.useForm();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.my-profile' });
  return (
    <Fragment>
      <CBreadcrumbs title={t('My Profile')} list={[t('My Profile')]} />
      <div className='wrapper-grid profile'>
        <div className='-intro-x left'>
          <Side form={form} />
        </div>
        <div className='intro-x right'>
          <div className='card'>
            <div className='body'>
              <Tabs
                className='-mt-3'
                onTabClick={(key: string) => onChangeTab(key)}
                activeKey={activeKey.current}
                size='large'
                items={[
                  {
                    key: '1',
                    label: t('My Profile'),
                    children: <FormProfile form={form} />,
                  },
                  {
                    key: '2',
                    label: t('Change Password'),
                    children: <FormChangePassword />,
                  },
                ]}
              ></Tabs>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;

import { CForm } from '@/library/form';
import { CSvgIcon } from '@/library/svg-icon';
const Side = ({ form }: { form: FormInstance }) => {
  const sGlobal = SGlobal();

  return (
    <div className='card'>
      <div className='body'>
        <CForm
          values={{ ...sGlobal.data }}
          formAnt={form}
          columns={[
            {
              title: '',
              name: 'avatar',
              formItem: {
                type: EFormType.upload,
              },
            },
            {
              title: 'routes.admin.user.Full name',
              name: 'name',
              formItem: {
                render: (_, values) => (
                  <Fragment>
                    <h2 className='text-center'>{values.name}</h2>
                    <div className='line'></div>
                    <div className='wrapper-flex'>
                      <CSvgIcon name='user-circle' size={20} />
                      <h3>{sGlobal.user?.role?.name}</h3>
                    </div>
                  </Fragment>
                ),
              },
            },
          ]}
          disableSubmit={sGlobal.isLoading}
        />
      </div>
    </div>
  );
};

const FormProfile = ({ form }: { form: FormInstance }) => {
  const sGlobal = SGlobal();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.my-profile' });

  return (
    <CForm
      values={{ ...sGlobal.data }}
      columns={[
        {
          title: t('Full name'),
          name: 'name',
          formItem: {
            col: 12,
            rules: [{ type: EFormRuleType.required }],
          },
        },
        {
          title: 'Email',
          name: 'email',
          formItem: {
            col: 6,
            rules: [
              { type: EFormRuleType.required },
              { type: EFormRuleType.email },
              { type: EFormRuleType.min, value: 6 },
            ],
          },
        },
        {
          title: t('Phone Number'),
          name: 'phoneNumber',
          formItem: {
            col: 6,
            rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.phone, min: 10, max: 15 }],
          },
        },
        {
          title: t('Date of birth'),
          name: 'dob',
          formItem: {
            col: 6,
            type: EFormType.date,
            rules: [{ type: EFormRuleType.required }],
          },
        },
        {
          title: t('Position'),
          name: 'positionCode',
          formItem: {
            col: 6,
            type: EFormType.selectTable,
            rules: [{ type: EFormRuleType.required }],
            get: {
              keyApi: 'Code',
              params: (fullTextSearch: string, value) => ({
                fullTextSearch,
                typeCode: 'position',
                extend: value('positionCode') && [['code', value('positionCode')]],
              }),
              format: item => ({
                label: item?.name,
                value: item?.code,
              }),
              data: () => sGlobal.data?.position,
              column: [
                {
                  title: t('Code'),
                  name: 'code',
                  tableItem: {
                    width: 100,
                  },
                },
                {
                  title: t('Name Code'),
                  name: 'name',
                  tableItem: {},
                },
              ],
            },
          },
        },
        {
          title: t('Description'),
          name: 'description',
          formItem: {
            type: EFormType.textarea,
          },
        },
      ]}
      disableSubmit={sGlobal.isLoading}
      handSubmit={values => sGlobal.putProfile({ ...values, avatar: form.getFieldValue('avatar')[0].url })}
    />
  );
};

const FormChangePassword = () => {
  const sGlobal = SGlobal();
  const { t } = useTranslation('locale', { keyPrefix: 'pages.base.my-profile' });
  return (
    <CForm
      values={{ ...sGlobal.data }}
      columns={[
        {
          title: t('Password'),
          name: 'passwordOld',
          formItem: {
            notDefaultValid: true,
            col: 12,
            type: EFormType.password,
            rules: [{ type: EFormRuleType.required }],
          },
        },
        {
          title: t('New password'),
          name: 'password',
          formItem: {
            col: 12,
            type: EFormType.password,
            rules: [{ type: EFormRuleType.required }],
          },
        },
        {
          title: t('Confirm Password'),
          name: 'passwordConfirmation',
          formItem: {
            notDefaultValid: true,
            col: 12,
            type: EFormType.password,
            rules: [
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
              { type: EFormRuleType.required },
            ],
          },
        },
      ]}
      disableSubmit={sGlobal.isLoading}
      textSubmit={t('Change Password')}
      handSubmit={values => {
        const { name, email, phoneNumber, dob, positionCode, description } = sGlobal.user!;
        sGlobal.putProfile({ name, email, phoneNumber, dob, positionCode, description, ...values });
      }}
    />
  );
};
