import { setRoute } from "@myjumpdata/redux";
import { useEffect } from "react";

export default function AdminScreen() {
  useEffect(() => {
    setRoute("admin");
  }, []);
  return <div>test</div>;
}
