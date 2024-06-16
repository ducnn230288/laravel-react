import React, { type PropsWithChildren, useEffect } from 'react';

import { SGlobal } from '@/services';
import { APP_NAME } from '@/utils';
import { CSvgIcon } from '@/library/svg-icon';

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
              <CSvgIcon name='logo' size={24} className='fill-primary' />
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
