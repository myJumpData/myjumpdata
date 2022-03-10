import { NAMESPACES } from "@myjumpdata/const";
import { setRoute } from "@myjumpdata/redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthVerify from "../../common/AuthVerify";

export default function AdminLocalizationScreen() {
  useEffect(() => {
    setRoute("admin/localization");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t("common:nav_localization")}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {NAMESPACES.map((namespace) => (
          <Link
            key={namespace}
            className="rounded-lg bg-gray-500/50 px-4 py-2 capitalize"
            to={`/admin/localization/namespace/${namespace}`}
          >
            <span className="text-lg font-bold">{namespace}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
