import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { TextInput } from "../components/Input";
import { setRoute } from "../redux/route.action";
import { login } from "../service/auth.service";

export default function LoginScreen() {
  useEffect(() => {
    setRoute("login");
  }, []);

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
    <div className="max-w-screen-sm">
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t<string>("common:nav_login")}
        </span>
      </div>
      <form onSubmit={handleLoginSubmit} className="w-full">
        <TextInput
          type="text"
          name={t("common:username") + ":"}
          inputName="username"
        />
        <TextInput
          name={t("common:password") + ":"}
          type="password"
          inputName="password"
        />
        <Button name={t("common:nav_login")} type="submit" design="success" />
      </form>
    </div>
  );
}
