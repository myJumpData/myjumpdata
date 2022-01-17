import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { TextInput } from "../components/Input";
import Wrapper from "../parts/Wrapper";
import AuthService from "../services/auth.service";

export default function RegisterScreen() {
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
    AuthService.register(
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
    <Wrapper current="register" type="main">
      <div className="max-w-screen-sm">
        <div className="w-full space-y-2">
          <span className="font-bold text-xl">{t("common:entry.signup")}</span>
        </div>
        <form onSubmit={handleRegisterSubmit}>
          <TextInput
            type="text"
            name={t("common:fields.username") + ":"}
            inputName="username"
          />
          <TextInput
            type="text"
            name={t("common:fields.firstname") + ":"}
            inputName="firstname"
          />
          <TextInput
            type="text"
            name={t("common:fields.lastname") + ":"}
            inputName="lastname"
          />
          <TextInput
            name={t("common:fields.email") + ":"}
            type="text"
            inputName="email"
          />
          <TextInput
            name={t("common:fields.password") + ":"}
            type="password"
            inputName="password"
          />
          <Button
            name={t("common:entry.signup")}
            type="submit"
            design="success"
          />
        </form>
      </div>
    </Wrapper>
  );
}
