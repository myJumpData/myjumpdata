import { Disclosure, Transition } from "@headlessui/react";
import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { IoAdd, IoCaretDown, IoSettings } from "react-icons/all";
import { useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { SelectInput, TextInput, TextInputInline } from "../components/Input";
import SocketContext from "../context/SocketContext";
import { setRoute } from "../redux/route.action";
import api from "../service/api";

export default function LiveScreen() {
  useEffect(() => {
    setRoute("live");
  }, []);

  const socket = useContext(SocketContext);

  const [searchParams, setSearchParams] = useSearchParams({
    q: "",
    cols: "2",
  } as any);

  const [ids, setIds] = useState<any>(null);

  useEffect(() => {
    const params = searchParams.get("q") || "";
    if (params === "") {
      setIds(null);
    } else {
      api
        .post(
          "/live/counter/get",
          atob(params)
            ?.split("+")
            .map((key) => {
              return { key };
            })
        )
        .then((res) => {
          setIds(res.data);
        });
    }
  }, [searchParams]);

  const LiveComponent = ({ dataKey, dataId }) => {
    const [count, setcount] = useState(0);

    useEffect(() => {
      socket.emit("GET:LIVE:COUNTER", {
        key: dataKey,
      });
      socket.on("connect", () => {
        socket.emit("GET:LIVE:COUNTER", {
          key: dataKey,
        });
      });
      return () => {
        socket.off("connect");
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataKey]);

    useEffect(() => {
      socket.on("LIVE:COUNTER", (...params) => {
        const [count] = params;
        if (count.id === dataId) {
          setcount(count.count);
        }
      });
      return () => {
        socket.off("LIVE:COUNTER");
      };
    }, [dataId, dataKey]);

    return (
      <div className="rounded-lg bg-gray-500/50 p-4">
        <div className="relative flex h-full flex-col items-center justify-center">
          <span className="absolute left-0 top-0 rounded-full bg-gray-500/50 px-2 py-1">
            {dataKey}
          </span>
          <span className="text-[10vh] font-bold">{count || 0}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <Disclosure>
        <Disclosure.Button className="self-end">
          <IoCaretDown />
        </Disclosure.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Disclosure.Panel className="rounded-lg bg-gray-500/25 p-4">
            {({ close }) => (
              <>
                <div className="flex items-center space-x-2">
                  <IoSettings />
                  <span className="font-bold">Settings</span>
                </div>
                <div className="pb-8">
                  <span className="text-sm opacity-75">Cols:</span>
                  <SelectInput
                    options={[
                      { name: "1", value: 1 },
                      { name: "2", value: 2 },
                      { name: "3", value: 3 },
                      { name: "4", value: 4 },
                      { name: "5", value: 5 },
                      { name: "6", value: 6 },
                      { name: "7", value: 7 },
                      { name: "8", value: 8 },
                      { name: "9", value: 9 },
                      { name: "10", value: 10 },
                      { name: "11", value: 11 },
                      { name: "12", value: 12 },
                    ]}
                    current={Number(searchParams.get("cols") || "2")}
                    stateChange={(e) => {
                      setSearchParams({
                        q: searchParams.get("q") || "",
                        cols: e,
                      });
                    }}
                  />
                </div>
                <div className="pb-8">
                  <span className="text-sm opacity-75">Connection String:</span>
                  <TextInputInline
                    value={atob(searchParams.get("q") || "")}
                    inputName={"q"}
                    onSubmit={(e) => {
                      setSearchParams({
                        q: btoa(e),
                        cols: searchParams.get("cols") || "2",
                      });
                    }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <IoAdd />
                  <span className="font-bold">Create</span>
                </div>
                <div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const key = e.target["key"].value;
                      const code = e.target["code"].value;
                      api
                        .post("/live/counter/create", { key, code })
                        .then((res: any) => {
                          if (res.status === 200) {
                            setSearchParams({
                              q: btoa(
                                [
                                  ...new Set([
                                    ...atob(searchParams.get("q") || "").split(
                                      "+"
                                    ),
                                    key,
                                  ]),
                                ].join("+")
                              ),
                              cols: searchParams.get("cols") || "2",
                            });
                            close();
                          }
                        });
                    }}
                  >
                    <div className="flex flex-col space-x-0 sm:flex-row sm:space-x-2">
                      <TextInput type="text" name="key" inputName="key" />
                      <TextInput type="text" name="code" inputName="code" />
                    </div>
                    <Button name="Submit" design="success" type="submit" />
                  </form>
                </div>
              </>
            )}
          </Disclosure.Panel>
        </Transition>
      </Disclosure>
      <div
        className={classNames(
          "grid gap-4 pb-16",
          { "grid-cols-1": Number(searchParams.get("cols") || "2") === 1 },
          { "grid-cols-2": Number(searchParams.get("cols") || "2") === 2 },
          { "grid-cols-3": Number(searchParams.get("cols") || "2") === 3 },
          { "grid-cols-4": Number(searchParams.get("cols") || "2") === 4 },
          { "grid-cols-5": Number(searchParams.get("cols") || "2") === 5 },
          { "grid-cols-6": Number(searchParams.get("cols") || "2") === 6 },
          { "grid-cols-7": Number(searchParams.get("cols") || "2") === 7 },
          { "grid-cols-8": Number(searchParams.get("cols") || "2") === 8 },
          { "grid-cols-9": Number(searchParams.get("cols") || "2") === 9 },
          { "grid-cols-10": Number(searchParams.get("cols") || "2") === 10 },
          { "grid-cols-11": Number(searchParams.get("cols") || "2") === 11 },
          { "grid-cols-12": Number(searchParams.get("cols") || "2") === 12 }
        )}
      >
        {ids?.map((d, index) => {
          return <LiveComponent key={index} dataKey={d.key} dataId={d.id} />;
        })}
      </div>
    </>
  );
}
