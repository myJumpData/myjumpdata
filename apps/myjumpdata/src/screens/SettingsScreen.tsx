import { setRoute, setUser } from "@myjumpdata/redux";
import { deleteUser, updateUser } from "@myjumpdata/service";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCheck } from "react-icons/hi";
import { useSelector } from "react-redux";
import AuthVerify from "../common/AuthVerify";
import Logout from "../common/Logout";
import Button from "../components/Button";
import { SelectInput, TextInput } from "../components/Input";

export default function SettingsScreen() {
  useEffect(() => {
    setRoute("settings");
  }, []);

  AuthVerify();

  const user = useSelector((state: any) => state.user);
  const { t, i18n } = useTranslation();

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
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">{t("common:nav_settings")}</span>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <span className="text-base font-bold">{t("settings_data")}: </span>
          <TextInput
            type="text"
            name={t("common:username") + ":"}
            stateChange={setUsername}
            value={username}
          />
          <div className="flex space-x-4">
            <TextInput
              type="text"
              name={t("common:firstname") + ":"}
              stateChange={setFirstname}
              value={firstname}
            />
            <TextInput
              type="text"
              name={t("common:lastname") + ":"}
              stateChange={setLastname}
              value={lastname}
            />
          </div>
          <div className="flex space-x-4">
            <span className="w-full">
              <TextInput
                type="text"
                name={t("common:email") + ":"}
                stateChange={setEmail}
                value={email}
              />
            </span>
            <span className="mb-4 self-end">
              <button
                className="flex h-10 w-10 items-center justify-center rounded bg-yellow-500 text-xl dark:bg-yellow-700"
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
                name={t("common:password") + ":"}
                stateChange={setPassword}
                value={password}
              />
            </span>
            <span className="mb-4 self-end">
              <button
                className="flex h-10 w-10 items-center justify-center rounded bg-yellow-500 text-xl dark:bg-yellow-700"
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
            <span className="text-base font-bold">{t("settings_image")}: </span>
            <span className="text-left">{t("settings_image_text")}</span>
            <span className="py-2 text-blue-800 underline hover:text-blue-500 hover:no-underline dark:text-blue-300">
              <a href="https://gravatar.com/" target="_blank" rel="noreferrer">
                {t("settings_image_action")}
              </a>
            </span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <div
              className="flex flex-row items-center rounded-lg px-2 py-1 outline-blue-500 hover:outline"
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
                {t("settings_image_gravatar")}
              </label>
            </div>
            <div
              className="flex flex-row items-center rounded-lg px-2 py-1 outline-blue-500 hover:outline"
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
                {t("settings_image_none")}
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <span className="text-base font-bold">{t("settings_language")}:</span>
          <SelectInput
            options={[
              { name: "de", value: "de" },
              { name: "en", value: "en" },
            ]}
            stateChange={i18n.changeLanguage}
            current={i18n.language}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold">{t("settings_danger")}: </span>
          <div className="flex flex-col space-y-4">
            <Button
              name={t("settings_logout")}
              design="danger"
              onClick={() => Logout()}
            />
            <span className="block h-16" />
            <Button
              name={t("settings_delete")}
              design="danger"
              onClick={() => {
                setDelStep(1);
              }}
            />
          </div>
        </div>
      </div>
      <DelOverlay />
    </>
  );
  function DelOverlay() {
    return (
      <div
        className={
          "top-0 left-0 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter " +
          (delStep === 1 ? "fixed z-50" : "z-0 hidden")
        }
        onClick={() => {
          setDelStep(0);
        }}
      >
        <div className="mx-auto flex max-w-prose flex-col space-y-4 rounded-lg bg-gray-300/75 p-4 dark:bg-gray-600/75">
          <span className="text-xl font-bold">
            {t("settings_delete_disclaimer_title")}
          </span>
          <span>{t("settings_delete_disclaimer_text")}</span>
          <Button
            name={t("settings_delete_disclaimer_confirm")}
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
