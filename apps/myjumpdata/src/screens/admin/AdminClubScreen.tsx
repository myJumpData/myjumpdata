import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import { setRoute } from "../../redux/route.action";
import { useNavigate, useSearchParams } from "react-router-dom";
import Flag from "react-world-flags";
import Table from "../../components/Table";
import { getClubs } from "../../service/admin.service";

export default function AdminClubScreen() {
  useEffect(() => {
    setRoute("admin/club");
    AuthVerify({
      isAdmin: true,
    });
  }, []);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limti: 10,
  } as any);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    getClubs(page, limit).then((response) => {
      response.data.data = response.data.clubs.map((item) => {
        item.name = (
          <span className="flex items-center space-x-2">
            <span className="h-8 w-8">
              <img
                src={item.logo}
                alt={`Logo-${item.name}`}
                className="h-full w-full object-contain"
              />
            </span>
            <span>{item.name}</span>
          </span>
        );
        item.country = (
          <span className="flex h-full h-8 w-12 items-center">
            <Flag code={item.country} />
          </span>
        );
        item.members = (
          <span className="tabular-nums">
            {[...item.coaches, ...item.athletes, ...item.admins].length}
          </span>
        );
        return item;
      });
      setData(response.data);
    });
  }, [limit, page]);

  return (
    <>
      <AdminActionBar
        text={t("common:nav_club")}
        actions={[
          {
            icon: FaPlus,
            onClick: () => {
              navigate("/admin/club/create");
            },
          },
        ]}
      />
      <Table
        limit={limit}
        page={page}
        setLimit={(e) => {
          setSearchParams({ limit: e, page } as any);
        }}
        setPage={(e) => {
          setSearchParams({ page: e, limit } as any);
        }}
        pages={data?.pages || 0}
        structure={[
          { name: "Name", key: "name", options: { align: "text-left" } },
          { name: "Country", key: "country", options: { align: "text-left" } },
          { name: "State", key: "state", options: { align: "text-left" } },
          { name: "City", key: "city", options: { align: "text-left" } },
          { name: "Members", key: "members", options: { align: "text-right" } },
        ]}
        data={data?.data}
        total={data?.items || 0}
      />
    </>
  );
}
