import { setRoute } from "@myjumpdata/redux";
import { useEffect } from "react";
import AuthVerify from "../common/AuthVerify";

export default function AdminLocalizationScreen() {
  useEffect(() => {
    setRoute("admin/localization");
    AuthVerify({
      isAdmin: true,
    });
  }, []);

  return <div>Localization</div>;
}
