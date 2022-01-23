import {
  deleteUser,
  updateUser,
  updateUsersRole,
} from "@myjumpdata/api-client";
import { setUser } from "@myjumpdata/store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCheck } from "react-icons/hi";
import { useSelector } from "react-redux";
import AuthVerify from "../common/AuthVerify";
import Logout from "../common/Logout";
import Button from "../components/Button";
import { TextInput } from "../components/Input";
import Wrapper from "../parts/Wrapper";

export default function SettingsScreen() {
  AuthVerify();

  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();

  const [username, setUsername] = useState(user.username);
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [picture, setPicture] = useState<undefined | "gravatar" | "none">(
    user.picture
  );
  const [password, setPassword] = useState("");
  const [delStep, setDelStep] = useState(0);

  useEffect(() => {
    updateUser({}).then((response) => {
      setUsername(response.data.username);
      setFirstname(response.data.firstname);
      setLastname(response.data.lastname);
      setEmail(response.data.email);
      setPicture(response.data.picture);
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username !== user.username) {
        updateUser({ username }).then((response) => {
          setUsername(response.data.username);
          setUser(response.data);
        });
      }
      if (firstname !== user.firstname) {
        updateUser({ firstname }).then((response) => {
          setFirstname(response.data.firstname);
          setUser(response.data);
        });
      }
      if (lastname !== user.lastname) {
        updateUser({ lastname }).then((response) => {
          setLastname(response.data.lastname);
          setUser(response.data);
        });
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [username, firstname, lastname, user]);

  const escFunction = useCallback((e: any) => {
    if (e.keyCode === 27) {
      setDelStep(0);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  function emailSubmit() {
    updateUser({ email }).then(() => {
      Logout();
    });
  }
  function passwordSubmit() {
    updateUser({ password }).then((response: any) => {
      setPassword("");
      setUser(response.data);
    });
  }
  return (
    <Wrapper current="profile">
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">{t("common:nav.settings")}</span>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <span className="text-base font-bold">{t("settings.data")}: </span>
          <TextInput
            type="text"
            name={t("common:fields.username") + ":"}
            stateChange={setUsername}
            value={username}
          />
          <div className="flex space-x-4">
            <TextInput
              type="text"
              name={t("common:fields.firstname") + ":"}
              stateChange={setFirstname}
              value={firstname}
            />
            <TextInput
              type="text"
              name={t("common:fields.lastname") + ":"}
              stateChange={setLastname}
              value={lastname}
            />
          </div>
          <div className="flex space-x-4">
            <span className="w-full">
              <TextInput
                type="text"
                name={t("common:fields.email") + ":"}
                stateChange={setEmail}
                value={email}
              />
            </span>
            <span className="self-end mb-4">
              <button
                className="h-10 w-10 bg-yellow-500 dark:bg-yellow-700 flex justify-center items-center text-xl rounded"
                onClick={emailSubmit}
                aria-label="submit"
              >
                <HiCheck />
              </button>
            </span>
          </div>
          <div className="flex space-x-4">
            <span className="w-full">
              <TextInput
                type="password"
                name={t("common:fields.password") + ":"}
                stateChange={setPassword}
                value={password}
              />
            </span>
            <span className="self-end mb-4">
              <button
                className="h-10 w-10 bg-yellow-500 dark:bg-yellow-700 flex justify-center items-center text-xl rounded"
                onClick={passwordSubmit}
                aria-label="submit"
              >
                <HiCheck />
              </button>
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col">
            <span className="text-base font-bold">{t("settings.image")}: </span>
            <span className="text-left">{t("settings.image_text")}</span>
            <span className="text-blue-800 dark:text-blue-300 hover:text-blue-500 underline hover:no-underline py-2">
              <a href="https://gravatar.com/" target="_blank" rel="noreferrer">
                {t("settings.image_action")}
              </a>
            </span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <div
              className="flex flex-row items-center hover:outline outline-blue-500 rounded-lg px-2 py-1"
              onClick={() => {
                updateUser({ picture: "gravatar" }).then((response) => {
                  setPicture(response.data.picture);
                  setUser(response.data);
                });
              }}
            >
              <input
                id="select-gravatar"
                type="radio"
                name="picture"
                value="gravatar"
                checked={picture === "gravatar"}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onChange={() => {}}
              />
              <label className="ml-1" htmlFor="select-gravatar">
                {t("settings.image_gravatar")}
              </label>
            </div>
            <div
              className="flex flex-row items-center hover:outline outline-blue-500 rounded-lg px-2 py-1"
              onClick={() => {
                updateUser({ picture: "none" }).then((response) => {
                  setPicture(response.data.picture);
                  setUser(response.data);
                });
              }}
            >
              <input
                type="radio"
                name="picture"
                id="select-none"
                value=""
                checked={picture !== "gravatar"}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onChange={() => {}}
              />
              <label className="ml-1" htmlFor="select-none">
                {t("settings.image_none")}
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold">{t("settings.danger")}: </span>
          <div className="flex flex-col space-y-4">
            {process.env.NODE_ENV === "development" &&
              (user.roles.includes("coach") ? (
                <Button
                  name={t("settings.reset_coach")}
                  design="warning"
                  onClick={() => {
                    updateUsersRole(["athlete"]).then(() => {
                      Logout();
                    });
                  }}
                />
              ) : (
                <Button
                  name={t("settings.become_coach")}
                  design="warning"
                  onClick={() => {
                    updateUsersRole(["athlete", "coach"]).then(() => {
                      Logout();
                    });
                  }}
                />
              ))}
            <Button
              name={t("settings.logout")}
              design="danger"
              onClick={() => Logout()}
            />
            <span className="block h-16" />
            <Button
              name={t("settings.delete")}
              design="danger"
              onClick={() => {
                setDelStep(1);
              }}
            />
          </div>
        </div>
      </div>
      <DelOverlay />
    </Wrapper>
  );
  function DelOverlay() {
    return (
      <div
        className={
          "top-0 left-0 h-full w-full backdrop-filter backdrop-blur p-4 flex flex-col justify-center " +
          (delStep === 1 ? "fixed z-50" : "hidden z-0")
        }
        onClick={() => {
          setDelStep(0);
        }}
      >
        <div className="max-w-prose p-4 bg-gray-300/75 dark:bg-gray-600/75 rounded-lg mx-auto flex flex-col space-y-4">
          <span className="font-bold text-xl">
            {t("settings.delete_disclaimer_title")}
          </span>
          <span>{t("settings.delete_disclaimer_text")}</span>
          <Button
            name={t("settings.delete_disclaimer_confirm")}
            design="danger"
            onClick={() => {
              deleteUser().then((response: any) => {
                if (response.status === 200) {
                  setDelStep(0);
                  Logout();
                }
              });
            }}
          />
        </div>
      </div>
    );
  }
}
