import { Spin } from 'antd';
import React, { Suspense } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { KEY_TOKEN, lang, routerLinks } from '@/utils';

const pages = [
  {
    layout: React.lazy(() => import('@/layouts/auth')),
    isPublic: true,
    child: [
      {
        path: routerLinks('Login'),
        component: React.lazy(() => import('@/pages/base/login')),
      },
      {
        path: routerLinks('ForgetPassword'),
        component: React.lazy(() => import('@/pages/base/login/forget-password')),
      },
      {
        path: routerLinks('VerifyForotPassword'),
        component: React.lazy(() => import('@/pages/base/login/forget-password/verify-forgot-password')),
      },
      {
        path: routerLinks('SetPassword'),
        component: React.lazy(() => import('@/pages/base/login/forget-password/verify-forgot-password/set-password')),
      },
    ],
  },
  {
    layout: React.lazy(() => import('@/layouts/admin')),
    isPublic: false,
    child: [
      {
        path: '/',
        component: routerLinks('Dashboard'),
      },
      {
        path: routerLinks('MyProfile'),
        component: React.lazy(() => import('@/pages/base/my-profile')),
      },
      {
        path: routerLinks('Dashboard'),
        component: React.lazy(() => import('@/pages/dashboard')),
      },
      {
        path: routerLinks('Parameter'),
        component: React.lazy(() => import('@/pages/base/parameter')),
      },
      {
        path: routerLinks('Code'),
        component: React.lazy(() => import('@/pages/base/code')),
      },
      {
        path: routerLinks('Content'),
        component: React.lazy(() => import('@/pages/base/content')),
      },
      {
        path: routerLinks('Post'),
        component: React.lazy(() => import('@/pages/base/post')),
      },
      {
        path: routerLinks('User'),
        component: React.lazy(() => import('@/pages/base/user')),
      },
    ], // 💬 generate link to here
  },
];

const Layout = ({
  layout: Layout,
  isPublic = false,
}: {
  layout: React.LazyExoticComponent<({ children }: { children?: React.ReactNode }) => JSX.Element>;
  isPublic: boolean;
}) => {
  if (isPublic || !!localStorage.getItem(KEY_TOKEN))
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  return <Navigate to={`/${lang}${routerLinks('Login')}`} />;
};

const Page = ({ component: Comp }: { component: React.LazyExoticComponent<() => JSX.Element | undefined> }) => <Comp />;
const Pages = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={'/:lang'}>
          {pages.map(({ layout, isPublic, child }, index) => (
            <Route key={'menu' + index} element={<Layout layout={layout} isPublic={isPublic} />}>
              {child.map(({ path = '', component }, subIndex: number) => (
                <Route
                  key={path + subIndex}
                  path={'/:lang' + path}
                  element={
                    <Suspense
                      fallback={
                        <Spin>
                          <div className='h-screen w-screen' />
                        </Spin>
                      }
                    >
                      {typeof component === 'string' ? (
                        <Navigate to={'/' + lang + component} />
                      ) : (
                        <Page component={component} />
                      )}
                    </Suspense>
                  }
                />
              ))}
            </Route>
          ))}
        </Route>
        <Route path='*' element={<Navigate to={'/' + lang + '/'} />} />
      </Routes>
    </HashRouter>
  );
};

export default Pages;
