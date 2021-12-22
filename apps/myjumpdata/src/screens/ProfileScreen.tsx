import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import User from '../assets/user.svg';
import AuthVerify from '../common/AuthVerify';
import Wrapper from '../parts/Wrapper';
import AuthService from '../services/auth.service';
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
  const [image, setImage] = useState('');
  const [userOverviewScoreData, setUserOverviewScoreData] = useState([]);
  const [message, setMessage] = useState('');

  const { currentUser } = AuthService.getCurrentUser();

  useEffect(() => {
    if (params.username === undefined) {
      setUsername(currentUser.username);
    } else {
      setUsername(params.username);
    }
  }, [params, currentUser?.username]);

  useEffect(() => {
    console.log(message);
  }, [message]);

  useEffect(() => {
    if (username !== '') {
      getUser(username).then(
        (response: any) => {
          setUsername(response.data.data.username);
          setFirstname(response.data.data.firstname);
          setLastname(response.data.data.lastname);
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

  return (
    <Wrapper current="profile">
      <div className="w-full space-y-2">
        <div className="flex justify-start space-x-4">
          {image !== '' ? (
            <div className="aspect-square h-24 sm:h-32 md:h-48 flex justify-center">
              <img
                src={image}
                className="rounded-full object-cover"
                alt={username}
              />
            </div>
          ) : (
            <div className="bg-gray-300 aspect-square h-24 sm:h-32 md:h-48 flex items-center justify-center text-gray-700 rounded-full text-3xl sm:text-5xl md:text-9xl p-4 md:p-8">
              <img src={User} alt="user" />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <span className="font-bold text-xl md:text-2xl">{username}</span>
            <span className="text-lg md:text-2xl capitalize">
              {firstname && lastname ? firstname + ' ' + lastname : username}
            </span>
          </div>
        </div>
        <div>
          <span className="font-bold text-lg md:text-xl">
            {t('common:stats.highscores')}:
          </span>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {userOverviewScoreData.map(
              (score: { type: string; score: number; scoreOwn: number }) => (
                <div
                  className="w-full bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg shadow space-x-4 flex items-center justify-between"
                  key={score.type}
                >
                  <span className="font-bold text-base w-full">
                    {score.type}
                  </span>
                  <div className="flex-col flex whitespace-nowrap text-sm">
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
        </div>
      </div>
    </Wrapper>
  );
}
