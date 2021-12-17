import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Button from '../components/Button';
import { TextInput } from '../components/Input';
import Main from '../components/Main';
import PageSpacer from '../components/PageSpacer';
import { Section } from '../components/Section';
import Spacer from '../components/Spacer';
import WaveSeperator from '../components/WaveSeperator';
import { MainFooter } from '../parts/MainFooter';
import { MainNav } from '../parts/MainNav';
import AuthService from '../services/auth.service';

export default function LoginScreen() {
  const { currentUser } = AuthService.getCurrentUser();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function handleLoginSubmit(e: any) {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    AuthService.login(username.trim(), password).then(
      (response: any) => {
        if (response.message.key === 'success.user.login') {
          navigate('/home');
        }
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  if (currentUser) {
    return <Navigate to="/home" />;
  }

  return (
    <Main>
      <MainNav page="login" />
      <PageSpacer />
      {message && <Alert design="warning" text={message} />}
      <WaveSeperator />
      <Section heading={t('common:entry.login')}>
        <form className="max-w-prose mx-auto" onSubmit={handleLoginSubmit}>
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
          <Spacer />
          <Link to="/register">
            <Button name={t('common:entry.signup')} design="link" />
          </Link>
        </form>
      </Section>
      <WaveSeperator rotated />
      <MainFooter />
    </Main>
  );
}
