import { Dispatch, ReactNode, useEffect } from 'react';
import ReactGA from 'react-ga';
import { useLocation } from 'react-router-dom';
import Alert from '../components/Alert';
import Footer from './Footer';
import { Nav, NavMain } from './Nav';

export default function Wrapper({
  current,
  type,
  children,
  text,
  state,
  design = 'primary',
  icon = true,
}: {
  type?: 'main';
  current: string;
  children: ReactNode;
  text: string | null;
  state: Dispatch<string | null>;
  design?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  icon?: boolean;
}) {
  const location = useLocation();
  const pathname = location.pathname;
  useEffect(() => {
    ReactGA.pageview(pathname);
  }, [pathname]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen overflow-x-hidden">
      {type === 'main' ? (
        <NavMain current={current} />
      ) : (
        <Nav current={current} />
      )}
      <div className="bg-white text-black dark:bg-black dark:text-white w-full rounded-tl-3xl p-4 sm:p-8 lg:p-12 flex flex-col space-y-8">
        <Alert text={text} state={state} design={design} icon={icon} />
        {children}
      </div>
      <Footer />
    </div>
  );
}
