import { Home } from '@/assets/svg';
import React from 'react';

export const Breadcrumbs = ({ title }: { title: string }) => (
  <div className="wrapper-flex">
    <h2 className={'-intro-x'}>{title}</h2>
    <div className={'intro-x breadcrumbs'}>
      <ul>
        <li>
          <Home />
        </li>
        <li>{title}</li>
      </ul>
    </div>
  </div>
);
