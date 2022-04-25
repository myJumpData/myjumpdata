import { useEffect } from "react";
import AuthVerify from "../../common/AuthVerify";
import { setRoute } from "../../redux/route.action";

export default function AdminGroupsScreen() {
  useEffect(() => {
    setRoute("admin/groups");
    AuthVerify({
      isAdmin: true,
    });
  }, []);

  return <div>Groups</div>;
}
