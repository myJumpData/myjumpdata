import StyledBottomSheet from "./StyledBottomSheet";
import { StyledText } from "./StyledText";
import DeviceInfo from "react-native-device-info";
import * as React from "react";
import getApi from "../utils/getApi";
import { AppState, ToastAndroid } from "react-native";
import { useTranslation } from "react-i18next";
import BottomSheet from "@gorhom/bottom-sheet";

export default function Update() {
  const bottomSheetRefUpdate = React.useRef<BottomSheet>(null);
  const snapPointsUpdate = React.useMemo(() => [200], []);

  const { newVersion, currentVersion, reloadVersion } = useUpdate();

  const { ready } = useTranslation();
  const { isActive } = useActive();

  React.useEffect(() => {
    if (currentVersion && newVersion && currentVersion !== newVersion) {
      bottomSheetRefUpdate.current?.snapToIndex(0);
    }
  }, [currentVersion, newVersion]);

  React.useEffect(() => {
    if (ready && isActive) {
      if (currentVersion && newVersion && currentVersion !== newVersion) {
        bottomSheetRefUpdate.current?.snapToIndex(0);
      }
      reloadVersion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isActive]);

  return (
    <StyledBottomSheet ref={bottomSheetRefUpdate} snapPoints={snapPointsUpdate}>
      <StyledText style={{ fontSize: 24, fontWeight: "900" }}>
        Update Available
      </StyledText>

      <StyledText style={{ fontSize: 20, fontWeight: "900" }}>
        {`${currentVersion} => ${newVersion}`}
      </StyledText>
    </StyledBottomSheet>
  );
}

export function useUpdate() {
  const [newVersion, setNewVersion] = React.useState<string | undefined>();
  const [currentVersion, setCurrentVersion] = React.useState<
    string | undefined
  >();

  function reloadVersion() {
    setCurrentVersion(DeviceInfo.getVersion().replace("v", ""));
    fetch(getApi() + "/admin/version", { cache: "no-store" })
      .then((res: Response) => {
        return res.json();
      })
      .then((res: { v: string }) => {
        setNewVersion(res.v);
      })
      .catch((err) => {
        ToastAndroid.show(JSON.stringify(err), ToastAndroid.SHORT);
      });
  }

  return { reloadVersion, newVersion, currentVersion };
}

export function useActive() {
  const [isActive, setIsActive] = React.useState(
    AppState.currentState === "active"
  );

  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        setIsActive(nextAppState === "active");
      }
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  return { isActive };
}
