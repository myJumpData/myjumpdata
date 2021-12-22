import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiCog, HiUser } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import AuthService from '../services/auth.service';
import { getUser } from '../services/user.service.';

export function Nav({
  current,
}: {
  current: 'home' | 'speeddata' | 'group' | string;
}) {
  const { t } = useTranslation();
  const { currentUser } = AuthService.getCurrentUser();
  const [image, setImage] = useState('');

  const navigation = [
    {
      name: t('common:nav.speeddata'),
      to: '/speeddata/own',
      current: current === 'speeddata',
    },
    {
      name: t('common:nav.freestyle'),
      to: '/freestyle',
      current: current === 'freestyle',
    },
    {
      name: t('common:nav.groups'),
      to: '/group',
      current: current === 'group',
    },
  ];
  const dropdown = [
    {
      icon: <HiUser />,
      name: t('common:nav.profile'),
      to: `/u/${currentUser.username}`,
    },
    { icon: <HiCog />, name: t('common:nav:settings'), to: '/settings' },
  ];

  useEffect(() => {
    getUser(currentUser.username).then((response: any) => {
      fetch(response.data.data.picture).then((r) => {
        if (r.status === 200) {
          setImage(response.data.data.picture);
        }
      });
    });
  }, []);

  return (
    <Navbar
      navigation={navigation}
      dropdown={dropdown}
      dropdownButton={
        image === '' ? (
          <HiUser className="h-8 w-8 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 p-1.5 rounded-full" />
        ) : (
          <img
            src={image}
            alt="Profile"
            className="object-cover h-8 w-8 rounded-full"
          />
        )
      }
    />
  );
}

export function NavMain({
  current,
}: {
  current: 'login' | 'register' | 'home' | string;
}) {
  const { t } = useTranslation();
  const { currentUser } = AuthService.getCurrentUser();
  let navigation: { name: string; to: string; current: boolean }[] = [];
  if (currentUser) {
    navigation = [
      {
        name: t('common:nav.home'),
        to: '/',
        current: current === 'home',
      },
      {
        name: t('common:interact.open'),
        to: `/u/${currentUser.username}`,
        current: current === 'profile',
      },
    ];
  } else {
    navigation = [
      {
        name: t('common:nav.home'),
        to: '/',
        current: current === 'home',
      },
      {
        name: t('common:entry.login'),
        to: '/login',
        current: current === 'login',
      },
      {
        name: t('common:entry.signup'),
        to: '/register',
        current: current === 'register',
      },
    ];
  }
  return <Navbar navigation={navigation} />;
}
