import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa';
import AuthVerify from '../common/AuthVerify';
import Alert from '../components/Alert';
import { ButtonIcon } from '../components/Button';
import Card from '../components/Card';
import Flex from '../components/Flex';
import { TextInput } from '../components/Input';
import Main from '../components/Main';
import PageSpacer from '../components/PageSpacer';
import { Section } from '../components/Section';
import { H5 } from '../components/Text';
import WaveSeperator from '../components/WaveSeperator';
import { MainFooter } from '../parts/MainFooter';
import { ScreenNav } from '../parts/ScreenNav';
import ScoreDataService from '../services/scoredata.service';

export default function SpeedDataOwnScreen() {
  AuthVerify();

  const [message, setMessage] = useState('');
  const [scoreData, setScoreData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    ScoreDataService.getScoreDataOwn().then(
      (response: any) => {
        setScoreData(response.data.data);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  function handleRecordDataSubmit(e: any) {
    e.preventDefault();
    const score = e.target.elements.score.value;
    const type = e.target.elements.id.value;
    if (score !== '') {
      ScoreDataService.saveScoreDataOwn(type, score);
      e.target.elements.score.value = null;
      getData();
    }
  }

  return (
    <Main>
      <ScreenNav name={t('common:action.speeddataown')} />
      <PageSpacer />
      {message && <Alert design="warning" text={message} />}

      <WaveSeperator />
      <Section heading={t('common:action.speeddataown')}>
        {scoreData &&
          scoreData.map((score: any) => {
            return (
              score !== null && (
                <Card design="light" key={score._id}>
                  <Flex>
                    <H5 full>{score.type.name}</H5>
                    <span className="text-xs whitespace-nowrap uppercase">
                      {t('common:stats.high')}: {score.score}
                    </span>
                  </Flex>
                  <form onSubmit={handleRecordDataSubmit}>
                    <input type="hidden" name="id" value={score.type._id} />
                    <Flex>
                      <TextInput
                        type="number"
                        inline
                        min="0"
                        inputName="score"
                      />
                      <ButtonIcon
                        design="success"
                        component={<FaPlus />}
                        type="submit"
                      />
                    </Flex>
                  </form>
                </Card>
              )
            );
          })}
      </Section>
      <WaveSeperator rotated />
      <MainFooter />
    </Main>
  );
}
