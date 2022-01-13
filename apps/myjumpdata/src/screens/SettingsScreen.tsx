import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiCheck } from 'react-icons/hi';
import AuthVerify from '../common/AuthVerify';
import Logout from '../common/Logout';
import Button from '../components/Button';
import { TextInput } from '../components/Input';
import Wrapper from '../parts/Wrapper';
import AuthService from '../services/auth.service';
import TokenService from '../services/token.service';
import UsersService from '../services/users.service';

export default function SettingsScreen() {
  AuthVerify();

  const { currentUser, isCoach } = AuthService.getCurrentUser();
  const { t } = useTranslation();

  const [message, setMessage] = useState<null | string>(null);
  const [username, setUsername] = useState(currentUser.username);
  const [firstname, setFirstname] = useState(currentUser.firstname);
  const [lastname, setLastname] = useState(currentUser.lastname);
  const [email, setEmail] = useState(currentUser.email);
  const [picture, setPicture] = useState<undefined | 'gravatar' | 'none'>(
    currentUser.picture
  );
  const [password, setPassword] = useState('');
  const [delStep, setDelStep] = useState(0);

  useEffect(() => {
    UsersService.updateUser({}).then(
      (response: any) => {
        setUsername(response.data.user.username);
        setFirstname(response.data.user.firstname);
        setLastname(response.data.user.lastname);
        setEmail(response.data.user.email);
        setPicture(response.data.user.picture);
        TokenService.updateUserLocalStorage(response.data.user);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username !== currentUser.username) {
        UsersService.updateUser({ username }).then(
          (response: any) => {
            setMessage(response?.data?.message.text);
            setUsername(response.data.user.username);
            TokenService.updateUserLocalStorage(response.data.user);
          },
          (error: any) => {
            setMessage(error.response?.data?.message.text);
            setUsername(currentUser.username);
          }
        );
      }
      if (firstname !== currentUser.firstname) {
        UsersService.updateUser({ firstname }).then(
          (response: any) => {
            setMessage(response?.data?.message.text);
            setFirstname(response.data.user.firstname);
            TokenService.updateUserLocalStorage(response.data.user);
          },
          (error: any) => {
            setMessage(error.response?.data?.message.text);
            setUsername(currentUser.firstname);
          }
        );
      }
      if (lastname !== currentUser.lastname) {
        UsersService.updateUser({ lastname }).then(
          (response: any) => {
            setMessage(response?.data?.message.text);
            setLastname(response.data.user.lastname);
            TokenService.updateUserLocalStorage(response.data.user);
          },
          (error: any) => {
            setMessage(error.response?.data?.message.text);
            setUsername(currentUser.lastname);
          }
        );
      }
      if (picture !== currentUser.picture) {
        UsersService.updateUser({ picture }).then(
          (response: any) => {
            setMessage(response?.data?.message.text);
            setPicture(response.data.user.picture);
            TokenService.updateUserLocalStorage(response.data.user);
          },
          (error: any) => {
            setMessage(error.response?.data?.message.text);
            setPicture(currentUser.picture);
          }
        );
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [username, firstname, lastname, currentUser, picture]);

  const escFunction = useCallback((e: any) => {
    if (e.keyCode === 27) {
      setDelStep(0);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  function emailSubmit() {
    UsersService.updateUser({ email }).then(
      () => {
        Logout();
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
        setEmail(currentUser.email);
      }
    );
  }
  function passwordSubmit() {
    UsersService.updateUser({ password }).then(
      (response: any) => {
        setMessage(response?.data?.message.text);
        setPassword('');
        TokenService.updateUserLocalStorage(response.data.user);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
        setPassword('');
      }
    );
  }
  return (
    <Wrapper current="profile" text={message} state={(e) => setMessage(e)}>
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">{t('common:nav.settings')}</span>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <span className="text-base font-bold">{t('settings.data')}: </span>
          <TextInput
            type="text"
            name={t('common:fields.username') + ':'}
            stateChange={setUsername}
            value={username}
          />
          <div className="flex space-x-4">
            <TextInput
              type="text"
              name={t('common:fields.firstname') + ':'}
              stateChange={setFirstname}
              value={firstname}
            />
            <TextInput
              type="text"
              name={t('common:fields.lastname') + ':'}
              stateChange={setLastname}
              value={lastname}
            />
          </div>
          <div className="flex space-x-4">
            <span className="w-full">
              <TextInput
                type="text"
                name={t('common:fields.email') + ':'}
                stateChange={setEmail}
                value={email}
              />
            </span>
            <span className="self-end mb-4">
              <button
                className="h-10 w-10 bg-yellow-500 dark:bg-yellow-700 flex justify-center items-center text-xl rounded"
                onClick={emailSubmit}
              >
                <HiCheck />
              </button>
            </span>
          </div>
          <div className="flex space-x-4">
            <span className="w-full">
              <TextInput
                type="password"
                name={t('common:fields.password') + ':'}
                stateChange={setPassword}
                value={password}
              />
            </span>
            <span className="self-end mb-4">
              <button
                className="h-10 w-10 bg-yellow-500 dark:bg-yellow-700 flex justify-center items-center text-xl rounded"
                onClick={passwordSubmit}
              >
                <HiCheck />
              </button>
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col">
            <span className="text-base font-bold">{t('settings.image')}: </span>
            <span className="text-left">{t('settings.image_text')}</span>
            <span className="text-blue-900 hover:text-blue-500 underline hover:no-underline">
              <a href="https://gravatar.com/" target="_blank" rel="noreferrer">
                {t('settings.image_action')}
              </a>
            </span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <div
              className="flex flex-row items-center hover:outline outline-blue-500 rounded-lg px-2 py-1"
              onClick={() => {
                setPicture('gravatar');
              }}
            >
              <input
                type="radio"
                name="picture"
                value="gravatar"
                checked={picture === 'gravatar'}
              />
              <label className="ml-1">{t('settings.image_gravatar')}</label>
            </div>
            <div
              className="flex flex-row items-center hover:outline outline-blue-500 rounded-lg px-2 py-1"
              onClick={() => {
                setPicture('none');
              }}
            >
              <input
                type="radio"
                name="picture"
                value=""
                checked={picture !== 'gravatar'}
              />
              <label className="ml-1">{t('settings.image_none')}</label>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold">{t('settings.danger')}: </span>
          <div className="flex flex-col space-y-4">
            {process.env.NODE_ENV === 'development' &&
              (isCoach ? (
                <Button
                  name={t('settings.reset_coach')}
                  design="warning"
                  onClick={() => {
                    UsersService.updateUsersRole(['athlete']).then(
                      () => {
                        Logout();
                      },
                      (error: any) => {
                        setMessage(error.response?.data?.message.text);
                      }
                    );
                  }}
                />
              ) : (
                <Button
                  name={t('settings.become_coach')}
                  design="warning"
                  onClick={() => {
                    UsersService.updateUsersRole(['athlete', 'coach']).then(
                      () => {
                        Logout();
                      },
                      (error: any) => {
                        setMessage(error.response?.data?.message.text);
                      }
                    );
                  }}
                />
              ))}
            <Button
              name={t('settings.logout')}
              design="danger"
              onClick={() => Logout()}
            />
            <span className="block h-16" />
            <Button
              name={t('settings.delete')}
              design="danger"
              onClick={() => {
                setDelStep(1);
              }}
            />
          </div>
        </div>
      </div>
      <DelOverlay />
    </Wrapper>
  );
  function DelOverlay() {
    return (
      <div
        className={
          'top-0 left-0 h-full w-full backdrop-filter backdrop-blur p-4 flex flex-col justify-center ' +
          (delStep === 1 ? 'fixed z-50' : 'hidden z-0')
        }
        onClick={() => {
          setDelStep(0);
        }}
      >
        <div className="max-w-prose p-4 bg-gray-300/75 dark:bg-gray-600/75 rounded-lg mx-auto flex flex-col space-y-4">
          <span className="font-bold text-xl">
            {t('settings.delete_disclaimer_title')}
          </span>
          <span>{t('settings.delete_disclaimer_text')}</span>
          <Button
            name={t('settings.delete_disclaimer_confirm')}
            design="danger"
            onClick={() => {
              UsersService.deleteUser().then(
                (response: any) => {
                  if (response.status === 200) {
                    setDelStep(0);
                    Logout();
                  }
                },
                (error: any) => {
                  setMessage(error.response?.data?.message.text);
                  setDelStep(0);
                }
              );
            }}
          />
        </div>
      </div>
    );
  }
}
