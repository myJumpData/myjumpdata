import { login } from "@myjumpdata/api-client";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { TextInput } from "../components/Input";
import Wrapper from "../parts/Wrapper";

export default function LoginScreen() {
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const navigate = useNavigate();

  async function handleLoginSubmit(e: any) {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    const response: any = await login(username.trim(), password);
    if (response.key === "success.login.user") {
      navigate(`/u/${response.data.username}`);
    }
  }

  if (Object.keys(user).length > 0) {
    return <Navigate to={`/u/${user.username}`} />;
  }

  return (
    <Wrapper current="login">
      <div className="max-w-screen-sm">
        <div className="w-full space-y-2">
          <span className="font-bold text-xl">{t("common:entry.login")}</span>
        </div>
        <form onSubmit={handleLoginSubmit} className="w-full">
          <TextInput
            type="text"
            name={t("common:fields.username") + ":"}
            inputName="username"
          />
          <TextInput
            name={t("common:fields.password") + ":"}
            type="password"
            inputName="password"
          />
          <Button
            name={t("common:entry.login")}
            type="submit"
            design="success"
          />
        </form>
      </div>
    </Wrapper>
  );
}
