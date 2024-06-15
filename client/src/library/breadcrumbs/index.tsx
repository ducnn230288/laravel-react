import { Home } from '@/assets/svg';
import React from 'react';

export const Breadcrumbs = ({ title, list }: { title: string; list: string[] }) => (
  <div className='wrapper-flex'>
    <h2 className={'-intro-x'}>{title}</h2>
    <div className={'intro-x breadcrumbs'}>
      <ul>
        <li>
          <Home />
        </li>
        {list.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);
