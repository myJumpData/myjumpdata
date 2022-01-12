import { Dispatch, useEffect } from 'react';
import {
  HiCheckCircle,
  HiExclamation,
  HiInformationCircle,
  HiX,
} from 'react-icons/hi';
import classNames from '../helper/classNames';

export default function Alert({
  text,
  state,
  design = 'primary',
  icon = true,
}: {
  text: string | null;
  state: Dispatch<string | null>;
  design?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  icon?: boolean;
}) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      state(null);
    }, 20000);
    return () => clearTimeout(timeoutId);
  }, [text]);
  if (text) {
    return (
      <div
        className={classNames(
          'outline outline-2 outline-offset-2 rounded-lg flex py-1 px-2 items-center justify-between transition w-full',
          design === 'primary' && 'outline-yellow-500',
          design === 'secondary' && 'outline-gray-500',
          design === 'success' && 'outline-green-500',
          design === 'danger' && 'outline-red-500',
          design === 'warning' && 'outline-orange-500',
          design === 'info' && 'outline-blue-500'
        )}
      >
        {icon && (
          <div
            className={classNames(
              'mr-2 text-2xl',
              'flex items-center justify-center',
              design === 'primary' && 'text-yellow-500',
              design === 'secondary' && 'text-gray-500',
              design === 'success' && 'text-green-500',
              design === 'danger' && 'text-red-500',
              design === 'warning' && 'text-orange-500',
              design === 'info' && 'text-blue-500'
            )}
          >
            {design === 'primary' && <HiInformationCircle />}
            {design === 'secondary' && <HiInformationCircle />}
            {design === 'success' && <HiCheckCircle />}
            {design === 'danger' && <HiExclamation />}
            {design === 'warning' && <HiExclamation />}
            {design === 'info' && <HiInformationCircle />}
          </div>
        )}

        <div className="leading-none w-full">{text}</div>
        <div
          className="text-gray-600 dark:Text-gray-400 hover:text-black dark:hover:text-white transition ml-2 self-start"
          onClick={() => {
            state(null);
          }}
        >
          <HiX />
        </div>
      </div>
    );
  }
  return <div />;
}
