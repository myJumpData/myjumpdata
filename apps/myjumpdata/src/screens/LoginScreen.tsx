import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { TextInput } from '../components/Input';
import Wrapper from '../parts/Wrapper';
import AuthService from '../services/auth.service';

export default function LoginScreen() {
  const { currentUser } = AuthService.getCurrentUser();
  const { t } = useTranslation();
  const [message, setMessage] = useState<null | string>(null);
  const navigate = useNavigate();

  function handleLoginSubmit(e: any) {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    AuthService.login(username.trim(), password).then(
      (response: any) => {
        if (response.message.key === 'success.user.login') {
          navigate(`/u/${username}`);
        }
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  if (currentUser) {
    return <Navigate to={`/u/${currentUser.username}`} />;
  }

  return (
    <Wrapper
      current="login"
      type="main"
      text={message}
      state={(e) => setMessage(e)}
    >
      <div className="max-w-screen-sm">
        <div className="w-full space-y-2">
          <span className="font-bold text-xl">{t('common:entry.login')}</span>
        </div>
        <form onSubmit={handleLoginSubmit} className="w-full">
          <TextInput
            type="text"
            name={t('common:fields.username') + ':'}
            inputName="username"
          />
          <TextInput
            name={t('common:fields.password') + ':'}
            type="password"
            inputName="password"
          />
          <Button
            name={t('common:entry.login')}
            type="submit"
            design="success"
          />
        </form>
      </div>
    </Wrapper>
  );
}
