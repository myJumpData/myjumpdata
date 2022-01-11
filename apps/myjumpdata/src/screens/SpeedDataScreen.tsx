import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa';
import { useParams } from 'react-router';
import AuthVerify from '../common/AuthVerify';
import { ButtonIcon } from '../components/Button';
import { SelectInput, TextInput } from '../components/Input';
import Wrapper from '../parts/Wrapper';
import GroupsService from '../services/groups.service';
import ScoreDataService from '../services/scoredata.service';

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
  const [message, setMessage] = useState<null | string>(null);

  useEffect(() => {
    console.log(message);
  }, [message]);

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
    <Wrapper
      current="speeddata_group"
      text={message}
      state={(e) => setMessage(e)}
    >
      <span className="font-bold text-xl">
        {t('speeddata.title') + ' ' + groupName}
      </span>
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-full">
          <SelectInput
            options={typesOptions}
            current={scoreDataType}
            stateChange={setScoreDataType}
          />
        </div>
        <span className="text-xs whitespace-nowrap uppercase">
          {t('common:stats.high')}: {groupHigh}
        </span>
      </div>
      {groupScores &&
        groupScores.map((score: any) => (
          <div
            key={score._id}
            className="border-t border-gray-300 dark:border-gray-700 py-2"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold mr-auto leading-none translate-y-2">
                {score.user.firstname && score.user.lastname
                  ? score.user.firstname + ' ' + score.user.lastname
                  : score.user.username}
              </span>
              <span className="text-xs whitespace-nowrap uppercase">
                {t('common:stats.high')}: {score.score}
              </span>
            </div>
            <form onSubmit={handleRecordDataSubmit}>
              <input type="hidden" name="id" value={score.user._id} />
              <div className="flex items-center space-x-2">
                <TextInput type="number" inline min="0" inputName="score" />
                <ButtonIcon
                  design="success"
                  component={<FaPlus />}
                  type="submit"
                />
              </div>
            </form>
          </div>
        ))}
    </Wrapper>
  );
}
