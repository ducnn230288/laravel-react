import { CSvgIcon } from '../svg-icon';

export const CBreadcrumbs = ({ title, list }: { title: string; list?: string[] }) => (
  <div className='wrapper-flex'>
    <h2 className={'-intro-x'}>{title}</h2>
    <div className={'intro-x breadcrumbs'}>
      {!!list && (
        <ul>
          <li>
            <CSvgIcon name='home' />
          </li>
          {list.map(item => (
            <li key={item}>
              <CSvgIcon name='arrow' size={8} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
