import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import AuthVerify from '../common/AuthVerify';
import Button from '../components/Button';
import randomColorClass from '../helper/randomColorClass';
import Wrapper from '../parts/Wrapper';
import AuthService from '../services/auth.service';
import GroupsService from '../services/groups.service';

export default function GroupScreen() {
  AuthVerify();
  let params = useParams();

  const { currentUser } = AuthService.getCurrentUser();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupCoaches, setGroupCoaches] = useState([]);
  const [groupAthletes, setGroupAthletes] = useState([]);

  useEffect(() => {
    getGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function getGroup() {
    GroupsService.getGroup(params.id).then(
      (response: any) => {
        setGroupName(response.data.group.name);
        setGroupCoaches(response.data.group.coaches);
        setGroupAthletes(response.data.group.athletes);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  function UserBlock({ username }: { username: String }) {
    return (
      <div className="flex flex-col items-center w-20 group">
        <Link
          to={`/u/${username}`}
          className="flex flex-col items-center w-20 group"
        >
          <span
            className={
              'h-12 w-12 rounded-full block transition duration-500 ease-in-out bg-opacity-75 shadow ' +
              randomColorClass()
            }
          />
          <span className="overflow-hidden whitespace-nowrap overflow-ellipsis w-20 text-sm text-center">
            {username}
          </span>
        </Link>
        <div className="absolute hidden group-hover:block group-focus:block">
          <span className="backdrop-filter backdrop-blur bg-gray-800 bg-opacity-40 text-white text-xs rounded-lg py-1 px-2 right-0 bottom-full m-4">
            {username}
          </span>
        </div>
      </div>
    );
  }

  function UserRow({ list, name }: { list: any; name: string }) {
    return (
      <div className="flex items-center">
        <span className="text-xl font-bold pr-4">{name}</span>
        <div className="w-full overflow-x-auto flex space-x-2 sm:overflow-x-visible sm:flex-wrap">
          {list.map((item: any) => (
            <UserBlock username={item.username} key={item.username} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Wrapper current="group">
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">{groupName}</span>
      </div>
      <div className="space-y-4">
        <UserRow name={t('common:role.coaches')} list={groupCoaches} />
        <UserRow name={t('common:role.athletes')} list={groupAthletes} />
      </div>
      {groupCoaches.some((i: any) => i._id === currentUser.id) && (
        <Link to={`/speeddata/group/${params.id}`}>
          <Button name={t('common:action.speeddata')} design="primary" />
        </Link>
      )}
    </Wrapper>
  );
}
