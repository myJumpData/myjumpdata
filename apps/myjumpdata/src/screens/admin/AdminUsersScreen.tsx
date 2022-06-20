import classNames from "classnames";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCheck, HiX } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import Table from "../../components/Table";
import { setRoute } from "../../redux/route.action";
import { getUsers } from "../../service/admin.service";
import initials from "../../utils/initials";

export default function AdminUsersScreen() {
  useEffect(() => {
    setRoute("admin/users");
    AuthVerify({
      isAdmin: true,
    });
  }, []);

  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limti: 10,
  } as any);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [usersData, setUsersData] = useState<
    | {
        items: number;
        data: any[];
        page: number;
        pages: number;
        count: number;
      }
    | undefined
  >();
  const { t } = useTranslation();

  useEffect(() => {
    getUsers(page, limit).then((response) => {
      response.data.data = response.data.data.map((item) => {
        item.picture = item.picture ? (
          <div className="m-1 h-8 w-8">
            <img
              className="h-full w-full rounded-full object-contain"
              height="3rem"
              width="3rem"
              src={item.picture}
              alt={item.username}
            />
          </div>
        ) : (
          <div className="m-1 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 font-bold text-black">
            {initials(item)}
          </div>
        );
        item.active = (
          <span
            className={classNames(
              "flex w-full items-center justify-center text-2xl",
              { "text-green-500": item.active },
              { "text-red-500": !item.active }
            )}
          >
            {item.active ? <HiCheck /> : <HiX />}
          </span>
        );
        item.roles = (
          <div className="flex flex-row space-x-1">
            {item.roles.map((role, index) => (
              <Fragment key={index}>
                <span
                  className={classNames(
                    "flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border-2 text-sm",
                    { "border-orange-500": role === "athlete" },
                    { "border-blue-500": role === "coach" },
                    { "border-red-500": role === "admin" }
                  )}
                  data-for={role}
                  data-tip={role}
                >
                  {role[0].toUpperCase()}
                </span>
                <ReactTooltip id={role} effect="solid" />
              </Fragment>
            ))}
          </div>
        );
        item.firstname = <span className="capitalize">{item.firstname}</span>;
        item.lastname = <span className="capitalize">{item.lastname}</span>;
        return item;
      });
      setUsersData(response.data);
    });
  }, [page, limit]);

  return (
    <>
      <AdminActionBar text={t("common:nav_users")} />

      <Table
        page={page}
        pages={usersData?.pages || 0}
        limit={limit}
        setLimit={(e) => {
          setSearchParams({ limit: e, page } as any);
        }}
        setPage={(e) => {
          setSearchParams({ page: e, limit } as any);
        }}
        total={usersData?.items || 0}
        structure={[
          { name: "", key: "picture" },
          {
            name: "Username",
            key: "username",
            options: { align: "text-left" },
          },
          {
            name: "Firstname",
            key: "firstname",
            options: { align: "text-left" },
          },
          {
            name: "Lastname",
            key: "lastname",
            options: { align: "text-left" },
          },
          { name: "Email", key: "email", options: { align: "text-left" } },
          { name: "Active", key: "active", options: { align: "text-center" } },
          { name: "Roles", key: "roles", options: { align: "text-left" } },
        ]}
        data={usersData?.data}
      />
    </>
  );
}
