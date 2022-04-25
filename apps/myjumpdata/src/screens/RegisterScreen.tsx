import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { TextInput } from "../components/Input";
import { setRoute } from "../redux/route.action";
import { register } from "../service/auth.service";

export default function RegisterScreen() {
  useEffect(() => {
    setRoute("register");
  }, []);

  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();

  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  function handleRegisterSubmit(e: any) {
    e.preventDefault();
    if (checked) {
      const username = e.target.elements.username.value;
      const email = e.target.elements.email.value;
      const password = e.target.elements.password.value;
      const firstname = e.target.elements.firstname.value;
      const lastname = e.target.elements.lastname.value;
      register(
        username.trim(),
        firstname.trim(),
        lastname.trim(),
        email.trim(),
        password,
        checked
      ).then(() => {
        navigate("/login");
      });
    }
  }

  if (Object.keys(user).length > 0) {
    return <Navigate to={`/u/${user.username}`} />;
  }

  return (
    <div className="max-w-screen-sm">
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t<string>("common:nav_signup")}
        </span>
      </div>
      <form onSubmit={handleRegisterSubmit}>
        <TextInput
          type="text"
          name={t<string>("common:username") + ":"}
          inputName="username"
        />
        <TextInput
          type="text"
          name={t<string>("common:firstname") + ":"}
          inputName="firstname"
        />
        <TextInput
          type="text"
          name={t<string>("common:lastname") + ":"}
          inputName="lastname"
        />
        <TextInput
          name={t<string>("common:email") + ":"}
          type="text"
          inputName="email"
        />
        <TextInput
          name={t<string>("common:password") + ":"}
          type="password"
          inputName="password"
        />
        <div className="flex items-center space-x-2">
          <div>
            <Switch
              checked={checked}
              onChange={setChecked}
              className={`${
                checked ? "bg-blue-600" : "bg-gray-500/50"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  checked ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </Switch>
          </div>
          <span>
            <Trans i18nKey="common:legal_aprove">
              <Link to="/terms" className="text-yellow-500"></Link>
              <Link to="/legal" className="text-yellow-500"></Link>
            </Trans>
          </span>
        </div>
        <Button
          name={t<string>("common:nav_signup")}
          type="submit"
          design={checked ? "success" : "secondary"}
        />
      </form>
    </div>
  );
}
