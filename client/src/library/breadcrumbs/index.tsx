import React, { Fragment } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Arrow } from '@/assets/svg';
import classNames from 'classnames';

export const Breadcrumbs = (title: string, breadcrumbs: { title: string; link: string }[]) => {
  document.title = title;
  document.querySelectorAll('.title-page').forEach((e) => (e.innerHTML = title));
  document.querySelectorAll('.breadcrumbs-page').forEach(
    (e) =>
      (e.innerHTML = ReactDOMServer.renderToStaticMarkup(
        breadcrumbs.map((item, i) => (
          <Fragment key={i}>
            <span className={classNames({ 'text-gray-400': i < breadcrumbs.length - 1 })}>{item.title}</span>{' '}
            {i < breadcrumbs.length - 1 && <Arrow className={'w-2.5 h-2.5 mx-1.5'} />}
          </Fragment>
        )),
      )),
  );
};
