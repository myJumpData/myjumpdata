import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiCog } from 'react-icons/hi';
import { Link, useParams } from 'react-router-dom';
import AuthVerify from '../common/AuthVerify';
import Button from '../components/Button';
import { TextInput } from '../components/Input';
import randomColorClass from '../helper/randomColorClass';
import Wrapper from '../parts/Wrapper';
import AuthService from '../services/auth.service';
import GroupsService from '../services/groups.service';

export default function GroupScreen() {
  AuthVerify();
  let params = useParams();

  const { currentUser, isCoach } = AuthService.getCurrentUser();
  const { t } = useTranslation();
  const [message, setMessage] = useState<null | string>(null);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupCoaches, setGroupCoaches] = useState([]);
  const [groupAthletes, setGroupAthletes] = useState([]);

  useEffect(() => {
    if (params.id) {
      getGroup();
    } else {
      getGroups();
    }
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

  function getGroups() {
    GroupsService.getGroups().then(
      (response: any) => {
        setGroups(response.data.groups);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  function handleCreateGroup() {
    GroupsService.createGroup(groupName.trim()).then(
      () => {
        getGroups();
        setGroupName('');
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
          className="flex flex-col items-center max-w-20 group"
        >
          <span
            className={
              'h-8 w-8 md:h-12 md:w-12 rounded-full block transition duration-500 ease-in-out bg-opacity-75 shadow ' +
              randomColorClass()
            }
          />
          <span className="overflow-hidden whitespace-nowrap overflow-ellipsis max-w-20 text-sm text-center">
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
        <span className="text-base font-bold pr-4">{name}</span>
        <div className="w-full overflow-x-auto flex space-x-4 sm:overflow-x-visible sm:flex-wrap">
          {list.map((item: any) => (
            <UserBlock username={item.username} key={item.username} />
          ))}
        </div>
      </div>
    );
  }

  if (params.id) {
    return (
      <Wrapper current="group" text={message} state={(e) => setMessage(e)}>
        <div className="flex">
          <div className="w-full space-y-2">
            <span className="font-bold text-xl">{groupName}</span>
          </div>
          <Link
            to={`/group/${params.id}/settings`}
            className="focus:ring-white dark:focus:ring-offset-white focus:ring-offset-gray-800 dark:focus:ring-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full flex items-center justify-center text-2xl aspect-square h-8 w-8"
          >
            <HiCog />
          </Link>
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
        <Link to={`/group`}>
          <Button name={t('common:interact.back')} design="link" />
        </Link>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper current="groups" text={message} state={(e) => setMessage(e)}>
        <div className="w-full space-y-2">
          <span className="font-bold text-xl">
            {t('common:action.train_group')}
          </span>
        </div>
        <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 space-y-4 sm:space-y-0">
          {groups.map((group: any) => (
            <Link
              to={`/group/${group._id}`}
              key={group._id}
              className="w-full bg-gray-300 px-4 py-2 md:px-8 md:py-4 rounded-lg shadow overflow-ellipsis overflow-hidden items-center flex md:justify-center hover:bg-gray-200 dark:hover:bg-gray-800 outline-gray-700 dark:outline-gray-200 dark:outline dark:bg-transparent"
            >
              <span className="font-bold text-lg md:text-xl">{group.name}</span>
            </Link>
          ))}
        </div>
        {isCoach && (
          <>
            <div className="w-full space-y-2">
              <span className="font-bold text-xl">
                {t('common:action.create_group')}
              </span>
            </div>
            <div className="max-w-screen-sm">
              <TextInput
                name={t('common:fields.group_name') + ':'}
                type="text"
                value={groupName}
                stateChange={setGroupName}
              />
              <Button
                name={t('common:action.create_group')}
                onClick={handleCreateGroup}
                design="success"
              />
            </div>
          </>
        )}
      </Wrapper>
    );
  }
}
