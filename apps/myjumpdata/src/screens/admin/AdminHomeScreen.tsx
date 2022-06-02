import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import { setRoute } from "../../redux/route.action";
import SocketContext from "../../context/SocketContext";

export default function AdminHomeScreen() {
  useEffect(() => {
    setRoute("admin/home");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const { t } = useTranslation();
  const socket = useContext(SocketContext);

  const [time, setTime] = useState("");

  useEffect(() => {
    socket.emit("GET:TIME");
    socket.on("TIME", (...params) => {
      const [time] = params;
      setTime(time);
    });
    return () => {
      socket.off("TIME");
    };
  }, [socket]);

  return (
    <>
      <AdminActionBar text={t("common:nav_home")} />
      <div>
        <span className="text-2xl font-bold">{time}</span>
      </div>
    </>
  );
}
