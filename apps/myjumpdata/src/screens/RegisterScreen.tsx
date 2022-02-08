import { setRoute } from "@myjumpdata/redux";
import { register } from "@myjumpdata/service";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { TextInput } from "../components/Input";

export default function RegisterScreen() {
  useEffect(() => {
    setRoute("register");
  }, []);

  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();

  const navigate = useNavigate();

  function handleRegisterSubmit(e: any) {
    e.preventDefault();
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
      password
    ).then(() => {
      navigate("/login");
    });
  }

  if (Object.keys(user).length > 0) {
    return <Navigate to={`/u/${user.username}`} />;
  }

  return (
    <div className="max-w-screen-sm">
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">{t("common:nav_signup")}</span>
      </div>
      <form onSubmit={handleRegisterSubmit}>
        <TextInput
          type="text"
          name={t("common:username") + ":"}
          inputName="username"
        />
        <TextInput
          type="text"
          name={t("common:firstname") + ":"}
          inputName="firstname"
        />
        <TextInput
          type="text"
          name={t("common:lastname") + ":"}
          inputName="lastname"
        />
        <TextInput
          name={t("common:email") + ":"}
          type="text"
          inputName="email"
        />
        <TextInput
          name={t("common:password") + ":"}
          type="password"
          inputName="password"
        />
        <Button name={t("common:nav_signup")} type="submit" design="success" />
      </form>
    </div>
  );
}
