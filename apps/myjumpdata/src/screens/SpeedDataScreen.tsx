import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import GroupsService from '../services/groups.service';
import ScoreDataService from '../services/scoredata.service';

import { H5 } from '../components/Text';
import Flex from '../components/Flex';
import Alert from '../components/Alert';
import Card from '../components/Card';
import Seperator from '../components/Seperator';
import { SelectInput, TextInput } from '../components/Input';
import { ButtonIcon } from '../components/Button';
import AuthVerify from '../common/AuthVerify';
import { useParams } from 'react-router';
import Main from '../components/Main';
import { ScreenNav } from '../parts/ScreenNav';
import PageSpacer from '../components/PageSpacer';
import WaveSeperator from '../components/WaveSeperator';
import { MainFooter } from '../parts/MainFooter';
import { Section } from '../components/Section';
import { useTranslation } from 'react-i18next';

export default function SpeedDataScreen() {
  AuthVerify();
  const params = useParams();

  const [groupName, setGroupName] = useState('');
  const { t } = useTranslation();
  const [groupScores, setGroupScores] = useState([]);
  const [groupHigh, setGroupHigh] = useState([]);
  const [scoreDataTypes, setScoreDataTypes] = useState([]);
  const [typesOptions, setTypesOptions] = useState([]);
  const [scoreDataType, setScoreDataType] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    GroupsService.getGroup(params.id).then(
      (response: any) => {
        setGroupName(response.data.group.name);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
    ScoreDataService.getScoreDataTypes().then(
      (response: any) => {
        setScoreDataTypes(response.data.scoreDataTypes);
        setScoreDataType(response.data.scoreDataTypes[0]._id);
        getScoreDataHigh(params.id, response.data.scoreDataTypes[0]._id);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }, [params]);

  useEffect(() => {
    if (scoreDataType) {
      getScoreDataHigh(params.id, scoreDataType);
    }
  }, [scoreDataType, params]);

  useEffect(() => {
    const options: any = scoreDataTypes.map((type: any) => {
      return { value: type._id, name: type.name };
    });
    setTypesOptions(options);
  }, [scoreDataTypes]);

  function getScoreDataHigh(id: any, type: any) {
    ScoreDataService.getScoreDataHigh(id, type).then(
      (response: any) => {
        setGroupScores(response.data.scores);
        setGroupHigh(response.data.high);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  function handleRecordDataSubmit(e: any) {
    e.preventDefault();
    const score = e.target.elements.score.value;
    const id = e.target.elements.id.value;
    ScoreDataService.saveScoreData(id, scoreDataType, score);
    e.target.elements.score.value = null;
    getScoreDataHigh(params.id, scoreDataType);
  }

  return (
    <Main>
      <ScreenNav name={t('speeddata.title') + ' ' + groupName} />
      <PageSpacer />
      {message && <Alert design="warning" text={message} />}

      <WaveSeperator />
      <Section heading={t('speeddata.title') + ' ' + groupName}>
        <Flex>
          <SelectInput
            options={typesOptions}
            inline
            stateChange={setScoreDataType}
          />
          <span className="text-xs whitespace-nowrap uppercase">
            {t('common:stats.high')}: {groupHigh}
          </span>
        </Flex>
        <Seperator />
        {groupScores &&
          groupScores.map((score: any) => (
            <Card design="light" key={score.user._id}>
              <Flex>
                <H5 full>{score.user.username}</H5>
                <span className="text-xs whitespace-nowrap uppercase">
                  {t('common:stats.high')}: {score.score}
                </span>
              </Flex>
              <form onSubmit={handleRecordDataSubmit}>
                <input type="hidden" name="id" value={score.user._id} />
                <Flex>
                  <TextInput type="number" inline min="0" inputName="score" />
                  <ButtonIcon
                    design="success"
                    component={<FaPlus />}
                    type="submit"
                  />
                </Flex>
              </form>
            </Card>
          ))}
      </Section>
      <WaveSeperator rotated />
      <MainFooter />
    </Main>
  );
}