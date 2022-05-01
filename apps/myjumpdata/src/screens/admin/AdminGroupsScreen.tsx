import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import { setRoute } from "../../redux/route.action";

export default function AdminGroupsScreen() {
  useEffect(() => {
    setRoute("admin/groups");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const { t } = useTranslation();

  return (
    <>
      <AdminActionBar text={t("common:nav_groups")} />
    </>
  );
}
