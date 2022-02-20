import { setRoute } from "@myjumpdata/redux";
import { useEffect } from "react";
import AuthVerify from "../../common/AuthVerify";

export default function AdminHomeScreen() {
  useEffect(() => {
    setRoute("admin/home");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  return <div>Home</div>;
}
