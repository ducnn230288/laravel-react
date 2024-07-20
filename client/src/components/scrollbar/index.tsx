import classNames from 'classnames';
import React, { useEffect, useRef, type PropsWithChildren } from 'react';

export const Scrollbar = ({
  children,
  className = '',
  id = '',
  style = undefined,
  options = {},
  containerRef = () => {},
  onSync = ps => ps.update(),
  ...props
}: PropsWithChildren<{
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  options?: Options;
  containerRef?: (container: HTMLElement) => void;
  onScrollY?: (container: HTMLElement) => void;
  onScrollX?: (container: HTMLElement) => void;
  onScrollUp?: (container: HTMLElement) => void;
  onScrollDown?: (container: HTMLElement) => void;
  onScrollLeft?: (container: HTMLElement) => void;
  onScrollRight?: (container: HTMLElement) => void;
  onYReachStart?: (container: HTMLElement) => void;
  onYReachEnd?: (container: HTMLElement) => void;
  onXReachStart?: (container: HTMLElement) => void;
  onXReachEnd?: (container: HTMLElement) => void;
  onSync?: (ps: typeof PerfectScrollbar) => void;
}>) => {
  const _container = useRef<HTMLElement | null>(null);
  const _ps = useRef<any>(null);
  const _handlerByEvent = useRef<any>({});

  useEffect(() => {
    return () => {
      Object.keys(_handlerByEvent.current).forEach(key => {
        const value = _handlerByEvent.current[key];

        if (value && _container.current) {
          _container.current.removeEventListener(key, value, false);
        }
      });
      _handlerByEvent.current = {};
      _ps.current.destroy();
      _ps.current = null;
    };
  }, []);

  useEffect(() => {
    if (_container.current) {
      _ps.current = new PerfectScrollbar(_container.current, { wheelSpeed: 1, minScrollbarLength: 20, ...options });
      _updateEventHook();
      _updateClassName();
      onSync(_ps.current);
    }
  }, [_container.current]);

  const _updateEventHook = (prevProps = {}) => {
    Object.keys(handlerNameByEvent).forEach(key => {
      const callback = props[handlerNameByEvent[key]];
      const prevCallback = prevProps[handlerNameByEvent[key]];
      if (_container.current && callback !== prevCallback) {
        if (prevCallback) {
          const prevHandler = _handlerByEvent.current[key];
          _container.current.removeEventListener(key, prevHandler, false);
          _handlerByEvent.current[key] = null;
        }
        if (callback) {
          const handler = () => callback(_container.current);
          _container.current.addEventListener(key, handler, false);
          _handlerByEvent.current[key] = handler;
        }
      }
    });
  };

  const _updateClassName = () => {
    if (_container.current) {
      const psClassNames = _container.current.className
        .split(' ')
        .filter(name => /^ps([-_].+|)$/.exec(name))
        .join(' ');
      _container.current.className = classNames('scrollbar-container', className, psClassNames);
    }
  };

  const handleRef = ref => {
    _container.current = ref;
    containerRef(ref);
  };

  return (
    <div id={id} style={style} ref={handleRef}>
      {children}
    </div>
  );
};
const handlerNameByEvent = {
  'ps-scroll-y': 'onScrollY',
  'ps-scroll-x': 'onScrollX',
  'ps-scroll-up': 'onScrollUp',
  'ps-scroll-down': 'onScrollDown',
  'ps-scroll-left': 'onScrollLeft',
  'ps-scroll-right': 'onScrollRight',
  'ps-y-reach-start': 'onYReachStart',
  'ps-y-reach-end': 'onYReachEnd',
  'ps-x-reach-start': 'onXReachStart',
  'ps-x-reach-end': 'onXReachEnd',
};
interface Options {
  handlers?: string[];
  maxScrollbarLength?: number;
  minScrollbarLength?: number;
  scrollingThreshold?: number;
  scrollXMarginOffset?: number;
  scrollYMarginOffset?: number;
  suppressScrollX?: boolean;
  suppressScrollY?: boolean;
  swipeEasing?: boolean;
  useBothWheelAxes?: boolean;
  wheelPropagation?: boolean;
  wheelSpeed?: number;
}
