import { useTranslation } from 'react-i18next';
import AuthVerify from '../common/AuthVerify';
import Main from '../components/Main';
import OptionBox from '../components/OptionBox';
import PageSpacer from '../components/PageSpacer';
import { Section } from '../components/Section';
import WaveSeperator from '../components/WaveSeperator';
import { MainFooter } from '../parts/MainFooter';
import { ScreenNav } from '../parts/ScreenNav';

export default function TrainScreen() {
  AuthVerify();

  const { t } = useTranslation();

  return (
    <Main>
      <ScreenNav name={t('common:action.train_own')} />
      <PageSpacer />

      <WaveSeperator />
      <Section heading={t('common:action.speeddata')}>
        <div className="flex flex-col md:flex-row space-x-0 space-y-4 md:space-x-4 md:space-y-0">
          <OptionBox
            link="/speeddata/own"
            heading={t('common:action.train_own')}
          />
        </div>
      </Section>
      <WaveSeperator rotated />
      <MainFooter />
    </Main>
  );
}
