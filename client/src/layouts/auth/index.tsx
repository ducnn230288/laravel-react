import type { PropsWithChildren } from 'react';

import { CSvgIcon } from '@/library/svg-icon';
import { APP_NAME } from '@/utils';

const Layout = ({ children }: PropsWithChildren) => {
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
