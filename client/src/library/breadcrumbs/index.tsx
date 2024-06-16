import React from 'react';
import { CSvgIcon } from '../svg-icon';

export const CBreadcrumbs = ({ title, list }: { title: string; list: string[] }) => (
  <div className='wrapper-flex'>
    <h2 className={'-intro-x'}>{title}</h2>
    <div className={'intro-x breadcrumbs'}>
      <ul>
        <li>
          <CSvgIcon name='home' />
        </li>
        {list.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);
