import AuthVerify from '../common/AuthVerify';

import AuthService from '../services/auth.service';

import Main from '../components/Main';
import PageSpacer from '../components/PageSpacer';
import WaveSeperator from '../components/WaveSeperator';
import { Section } from '../components/Section';

import { MainFooter } from '../parts/MainFooter';
import { ScreenNav } from '../parts/ScreenNav';
import {
  FaCertificate,
  FaCog,
  FaLink,
  FaShareAlt,
  FaUser,
} from 'react-icons/fa';
import Spacer from '../components/Spacer';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Alert from '../components/Alert';
import { useTranslation } from 'react-i18next';
import { getUser } from '../services/user.service.';

export default function ProfileScreen() {
  const params = useParams();

  if (params.username === undefined) {
    AuthVerify();
  }

  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [coach, setCoach] = useState(false);
  const [image, setImage] = useState('');
  const [userOverviewScoreData, setUserOverviewScoreData] = useState([]);
  const [message, setMessage] = useState('');
  const [shareStatus, setShareStatus] = useState(false);

  const { currentUser } = AuthService.getCurrentUser();

  useEffect(() => {
    if (navigator.share !== undefined) {
      setShareStatus(true);
    } else {
      setShareStatus(false);
    }
  }, []);

  useEffect(() => {
    if (params.username === undefined) {
      setUsername(currentUser.username);
    } else {
      setUsername(params.username);
    }
  }, [params, currentUser?.username]);

  useEffect(() => {
    if (username !== '') {
      getUser(username).then(
        (response: any) => {
          setUsername(response.data.data.username);
          setFirstname(response.data.data.firstname);
          setLastname(response.data.data.lastname);
          if (response.data.data.roles.includes('coach')) {
            setCoach(true);
          }
          setUserOverviewScoreData(response.data.data.highdata);
          fetch(response.data.data.picture).then((r) => {
            if (r.status === 200) {
              setImage(response.data.data.picture);
            }
          });
        },
        (error: any) => {
          setMessage(error.response?.data?.message.text);
        }
      );
    }
  }, [username]);

  function handleShare() {
    if (shareStatus) {
      navigator
        .share({
          title: 'myJumpData',
          text: `${t('share.text', {
            name: firstname && lastname ? firstname + ' ' + lastname : username,
          })}`,
          url: window.location.href,
        })
        .then();
    }
  }

  function handleLink() {
    navigator.clipboard.writeText(window.location.href).then();
  }

  return (
    <Main>
      <ScreenNav
        name={username}
        button={[
          {
            icon: <FaCog />,
            name: t('common:nav.settings'),
            to: '/settings',
          },
        ]}
      />
      <PageSpacer />
      {message && <Alert design="warning" text={message} />}

      <Spacer />
      <Spacer />
      <WaveSeperator />
      <div className="bg-white flex justify-center text-black text-9xl pt-8">
        {coach && (
          <div className="items-center flex text-xl transform top-20 left-4 absolute backdrop-filter backdrop-blur px-4 py-2 bg-gray-300 bg-opacity-50 rounded-lg h-12 cursor-pointer hover:bg-gray-100 transition duration-500 ease-in-out">
            <span className="inline-block mr-2 text-blue-600">
              <FaCertificate className="h-6 w-6" />
            </span>
            <span className="inline-block font-bold">
              {t('common:role.coach')}
            </span>
          </div>
        )}
        {shareStatus ? (
          <div
            className="items-center flex justify-center text-xl transform top-20 right-4 absolute backdrop-filter backdrop-blur bg-gray-300 bg-opacity-50 rounded-full h-12 w-12 cursor-pointer hover:bg-gray-100 transition duration-500 ease-in-out"
            onClick={handleShare}
          >
            <span className="inline-block text-gray-600">
              <FaShareAlt className="h-6 w-6" />
            </span>
          </div>
        ) : (
          <div
            className="items-center flex justify-center text-xl transform top-20 right-4 absolute backdrop-filter backdrop-blur bg-gray-300 bg-opacity-50 rounded-full h-12 w-12 cursor-pointer hover:bg-gray-100 transition duration-500 ease-in-out"
            onClick={handleLink}
          >
            <span className="inline-block text-gray-600">
              <FaLink className="h-6 w-6" />
            </span>
          </div>
        )}
        <span className="h-48 w-48 md:h-72 md:w-72 absolute rounded-full flex justify-center items-center bg-opacity-50 backdrop-filter backdrop-blur-sm z-20 transform -translate-y-32 md:-translate-y-56">
          {image !== '' ? (
            <img
              src={image}
              className="rounded-full object-cover"
              alt={
                firstname && lastname ? firstname + ' ' + lastname : username
              }
            />
          ) : (
            <FaUser className="inline fill-current pb-2" />
          )}
        </span>
      </div>
      <Section
        heading={firstname && lastname ? firstname + ' ' + lastname : username}
      >
        <span className="font-bold text-2xl">
          {t('common:stats.highscores')}:
        </span>
        <div className="flex flex-col mt-4 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-4  space-y-4 sm:space-y-0">
          {userOverviewScoreData.map(
            (score: { type: string; score: number; scoreOwn: number }) => (
              <div
                className="w-full bg-gray-300 px-4 py-2 rounded-lg shadow space-x-4 flex items-center justify-between"
                key={score.type}
              >
                <span className="font-bold text-xl w-full">{score.type}</span>
                <div className="flex-col flex whitespace-nowrap">
                  <div className="flex justify-between space-x-2">
                    <span>{t('common:stats.group')}</span>
                    <span>{score.score}</span>
                  </div>
                  <div className="flex justify-between space-x-2">
                    <span>{t('common:stats.own')}</span>
                    <span>{score.scoreOwn}</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Section>
      <WaveSeperator rotated />
      <MainFooter />
    </Main>
  );
}
