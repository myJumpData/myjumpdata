import { setRoute } from "@myjumpdata/redux";
import { useEffect } from "react";
import AuthVerify from "../../common/AuthVerify";

export default function AdminGroupsScreen() {
  useEffect(() => {
    setRoute("admin/groups");
    AuthVerify({
      isAdmin: true,
    });
  }, []);

  return <div>Groups</div>;
}
