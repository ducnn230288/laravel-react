import React, { PropsWithChildren, useEffect } from 'react';

import { Logo } from '@/assets/svg';
import { SGlobal } from '@/services';
import { APP_NAME } from '@/utils';

const Layout = ({ children }: PropsWithChildren) => {
  const sGlobal = SGlobal();
  useEffect(() => {
    sGlobal.logout();
  }, []);

  return (
    <div className='l-login'>
      <div />
      <div className='mask'></div>
      <div className='wapper'>
        <div className='content intro-x'>
          <div className='t-head'>
            <div className='block-grap-1'>
              <Logo className='logo' />
              <h4>{APP_NAME}</h4>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
export default Layout;
