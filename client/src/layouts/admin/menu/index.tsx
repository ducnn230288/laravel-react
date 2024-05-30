import { Collapse } from 'antd';
import React, { Fragment, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'react-router-dom';

import { SGlobal } from '@/services';
import { routerLinks, lang, uuidv4 } from '@/utils';
import listMenu from '../menus';

const Layout = ({ permission = [] }: { permission?: string[] }) => {
  const { t } = useTranslation('locale', { keyPrefix: 'menu' });
  const navigate = useNavigate();
  const location = useLocation();
  const clearTime = useRef<NodeJS.Timeout>();
  const sGlobal = SGlobal();

  const menuActive = useRef<string[]>([]);
  useEffect(() => {
    clearTimeout(clearTime.current);
    let linkActive = '';
    listMenu.forEach((item) => {
      if (!linkActive && !!item.child && location.hash.substring(1).indexOf(`/${lang}${routerLinks(item.name)}`) > -1) {
        linkActive = `/${lang}${routerLinks(item.name)}`;
      }
    });
    clearTime.current = setTimeout(() => (menuActive.current = [linkActive]), 200);
  }, [location.hash]);

  const subMenu = (child: any[]) =>
    child
      .filter((subItem) => !subItem.permission || permission?.includes(subItem.permission))
      .map((subItem, index: number) => (
        <button
          key={index + uuidv4()}
          className={classNames(
            'flex items-center w-full gap-2 py-2 px-3 hover:text-primary hover:bg-primary/10 rounded-r-btn border-l group border-base-content/20 text-base-content',
            {
              'text-primary bg-primary/5': location.pathname.indexOf(`/${lang}${routerLinks(subItem.name)}`) > -1,
            },
          )}
          onClick={() =>
            location.pathname.indexOf(`/${lang}${routerLinks(subItem.name)}`) === -1 &&
            navigate({
              pathname: `/${lang}${routerLinks(subItem.name)}`,
              search: `?${createSearchParams(subItem.queryParams)}`,
            })
          }
        >
          <span className="size-1 rounded-lg bg-base-content/20 transition-all duration-300 ease-in-out group-hover:w-2"></span>
          <span>{t(subItem.name)}</span>
        </button>
      ));

  return (
    <div className="main-menu">
      {listMenu
        .filter((item) => {
          return (
            !item.child ||
            item.child.filter((subItem) => !subItem.permission || permission?.includes(subItem.permission)).length > 0
          );
        })
        .map((item) => {
          if (!item.child) {
            return (
              <button
                className={classNames(
                  'flex items-center w-full hover:text-primary hover:bg-primary/10 rounded-btn py-1.5',
                  {
                    'text-primary bg-primary/5': location.pathname === `/${lang}${routerLinks(item.name)}`,
                    'px-3 gap-2': !sGlobal.isCollapseMenu,
                    'px-1': sGlobal.isCollapseMenu,
                  },
                )}
                onClick={() =>
                  location.pathname !== `/${lang}${routerLinks(item.name)}` &&
                  navigate({
                    pathname: `/${lang}${routerLinks(item.name)}`,
                    search: `?${createSearchParams(item.queryParams)}`,
                  })
                }
                key={item.name}
              >
                {item.icon}
                <span
                  className={classNames('font-medium ease-in-out transition-all', {
                    'text-[0px] duration-300': sGlobal.isCollapseMenu,
                    'text-sm duration-500': !sGlobal.isCollapseMenu,
                  })}
                >
                  {t(item.name)}
                </span>
              </button>
            );
          } else {
            return (
              <Fragment key={item.name}>
                {/* <div>
                  <Popover placement="rightTop" trigger={'hover'} content={subMenu(item.child)}>
                    <li className="flex items-center justify-center h-12 m-2 px-2 text-gray-300 fill-gray-300 ">
                      <div>{item.icon}</div>
                    </li>
                  </Popover>
                </div> */}
                <Collapse
                  accordion
                  bordered={false}
                  defaultActiveKey={menuActive.current}
                  items={[
                    {
                      key: `/${lang}${routerLinks(item.name)}`,
                      showArrow: false,
                      label: (
                        <button
                          className={classNames(
                            'flex items-center w-full hover:text-primary hover:bg-primary/10 rounded-btn py-1.5 text-base-content',
                            {
                              'text-primary bg-primary/5':
                                location.pathname.indexOf(`/${lang}${routerLinks(item.name)}`) > -1,
                              'px-3 gap-2': !sGlobal.isCollapseMenu,
                              'px-1': sGlobal.isCollapseMenu,
                            },
                          )}
                        >
                          {item.icon}
                          <span
                            className={classNames('font-medium ease-in-out transition-all', {
                              'text-[0px] duration-300': sGlobal.isCollapseMenu,
                              'text-sm duration-500': !sGlobal.isCollapseMenu,
                            })}
                          >
                            {t(item.name)}
                          </span>
                        </button>
                      ),
                      children: subMenu(item.child),
                    },
                  ]}
                />
              </Fragment>
            );
          }
        })}
    </div>
  );
};

export default Layout;
