import { Link } from 'react-router-dom';
import { GiSkippingRope } from 'react-icons/gi';

import AuthService from '../services/auth.service';

import Main from '../components/Main';
import PageSpacer from '../components/PageSpacer';
import WaveSeperator from '../components/WaveSeperator';
import { Section } from '../components/Section';
import { MainFooter } from '../parts/MainFooter';

import AuthVerify from '../common/AuthVerify';
import { ScreenNav } from '../parts/ScreenNav';
import { FaUser, FaUsers } from 'react-icons/fa';
import OptionBox from '../components/OptionBox';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  AuthVerify();

  const { currentUser } = AuthService.getCurrentUser();
  const { t } = useTranslation();

  return (
    <Main>
      <ScreenNav
        name="myJumpData"
        icon={<GiSkippingRope className="h-8 inline fill-current" />}
      />
      <PageSpacer />
      <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full md:w-3/5 justify-center items-start text-center md:text-left">
          <h1 className="my-4 lg:text-4xl text-2xl font-bold leading-tight w-full capitalize">
            {t('home.jumbotron.great') +
              ' ' +
              (currentUser.firstname && currentUser.lastname
                ? currentUser.firstname + ' ' + currentUser.lastname
                : currentUser.username) +
              '!'}
          </h1>
          <p className="leading-normal lg:text-2xl text-xl mb-8 w-full">
            {t('home.jumbotron.bottom')}
          </p>
        </div>
      </div>
      <WaveSeperator />
      <Section heading="What do you want to do?">
        <div className="flex flex-col md:flex-row space-x-0 space-y-4 md:space-x-4 md:space-y-0">
          <OptionBox
            link="/train"
            heading={t('common:action.train_own')}
            icon={<FaUser />}
          />
          <OptionBox
            link="/groups"
            heading={t('common:action.train_group')}
            icon={<FaUsers />}
          />
        </div>
      </Section>
      <WaveSeperator rotated />
      <MainFooter />
    </Main>
  );
}
