import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';
import AuthVerify from '../common/AuthVerify';
import Logout from '../common/Logout';
import Alert from '../components/Alert';
import Button, { ButtonIcon } from '../components/Button';
import { TextInput } from '../components/Input';
import Main from '../components/Main';
import PageSpacer from '../components/PageSpacer';
import { Section } from '../components/Section';
import WaveSeperator from '../components/WaveSeperator';
import { MainFooter } from '../parts/MainFooter';
import { ScreenNav } from '../parts/ScreenNav';
import AuthService from '../services/auth.service';
import TokenService from '../services/token.service';
import UsersService from '../services/users.service';

export default function SettingsScreen() {
  AuthVerify();

  const { currentUser, isCoach } = AuthService.getCurrentUser();
  const { t } = useTranslation();

  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(currentUser.username);
  const [firstname, setFirstname] = useState(currentUser.firstname);
  const [lastname, setLastname] = useState(currentUser.lastname);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('');
  const [delStep, setDelStep] = useState(0);

  useEffect(() => {
    UsersService.updateUser({}).then(
      (response: any) => {
        setUsername(response.data.user.username);
        setFirstname(response.data.user.firstname);
        setLastname(response.data.user.lastname);
        setEmail(response.data.user.email);
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
      if (email !== currentUser.email) {
        UsersService.updateUser({ email }).then(
          (response: any) => {
            setMessage(response?.data?.message.text);
            setEmail(response.data.user.email);
            TokenService.updateUserLocalStorage(response.data.user);
          },
          (error: any) => {
            setMessage(error.response?.data?.message.text);
            setUsername(currentUser.email);
          }
        );
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [username, firstname, lastname, email, currentUser]);

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
    <Main>
      <ScreenNav name={t('common:nav.settings')} />
      <PageSpacer />
      {message && <Alert design="warning" text={message} />}

      <WaveSeperator />
      <Section heading={t('common:nav.settings')}>
        <div className="max-w-prose mx-auto">
          <div className="mb-8 flex flex-col space-y-4">
            <span className="text-2xl font-bold">{t('settings.data')}: </span>
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
            <TextInput
              type="text"
              name={t('common:fields.email') + ':'}
              stateChange={setEmail}
              value={email}
            />
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
                <ButtonIcon
                  design="success"
                  component={<FaCheck />}
                  onClick={passwordSubmit}
                />
              </span>
            </div>
          </div>
          <div className="mb-8 flex justify-between items-center">
            <div className="flex-col flex justify-between pr-4">
              <span className="text-2xl font-bold">{t('settings.image')}:</span>
              <span className="text-justify">{t('settings.image_text')}</span>
              <span className="text-blue-900 hover:text-blue-500 underline hover:no-underline">
                <a
                  href="https://gravatar.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('settings.image_action')}
                </a>
              </span>
            </div>
          </div>
        </div>
      </Section>
      <Section heading={t('settings.danger')}>
        <div className="max-w-prose mx-auto">
          {isCoach ? (
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
          )}
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
          <div
            className={
              'top-0 left-0 h-full w-full backdrop-filter backdrop-blur p-4 flex flex-col justify-center ' +
              (delStep === 1 ? 'fixed z-50' : 'hidden z-0')
            }
            onClick={() => {
              setDelStep(0);
            }}
          >
            <div className="max-w-prose p-4 bg-gray-300 rounded-lg bg-opacity-50 mx-auto flex flex-col space-y-4">
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
        </div>
      </Section>
      <WaveSeperator rotated />
      <MainFooter />
    </Main>
  );
}
