import { useEffect } from "react";
import AuthVerify from "../../common/AuthVerify";
import { setRoute } from "../../redux/route.action";

export default function AdminHomeScreen() {
  useEffect(() => {
    setRoute("admin/home");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  return <div>Home</div>;
}
