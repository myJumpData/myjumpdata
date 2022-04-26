import * as React from "react";
import { ColorValue, useColorScheme } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Pro from "react-native-vector-icons/FontAwesome5Pro";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Zocial from "react-native-vector-icons/Zocial";
import { Colors, Font } from "../../Constants";
import { Sets } from "./Sets.type";
import { AntDesignType } from "./Types/AntDesignType";
import { EntypoType } from "./Types/EntypoType";
import { EvilIconsType } from "./Types/EvilIconsType";
import { FeatherType } from "./Types/FeatherType";
import { FontAwesome5FreeType } from "./Types/FontAwesome5FreeType";
import { FontAwesome5ProType } from "./Types/FontAwesome5ProType";
import { FontAwesomeType } from "./Types/FontAwesomeType";
import { FontistoType } from "./Types/FontistoType";
import { FoundationType } from "./Types/FoundationType";
import { IoniconsType } from "./Types/IoniconsType";
import { MaterialCommunityIconsType } from "./Types/MaterialCommunityIconsType";
import { MaterialIconsType } from "./Types/MaterialIconsType";
import { OcticonsType } from "./Types/OcticonsType";
import { SimpleLineIconsType } from "./Types/SimpleLineIconsType";
import { ZocialType } from "./Types/ZocialType";

export default function StyledIcon({
  name,
  size = Font.size,
  color,
}: {
  name:
    | AntDesignType
    | EntypoType
    | EvilIconsType
    | FeatherType
    | FontAwesomeType
    | FontAwesome5FreeType
    | FontAwesome5ProType
    | FontistoType
    | FoundationType
    | IoniconsType
    | MaterialCommunityIconsType
    | MaterialIconsType
    | OcticonsType
    | SimpleLineIconsType
    | ZocialType;
  size?: number;
  color?: string | ColorValue;
}) {
  const isDarkMode = useColorScheme() === "dark";

  const set: Sets = (name as string).split("/")[0] as Sets;
  const icon = (name as string).split("/")[1];

  const Component = (props: any) => {
    switch (set) {
      case "AntDesign":
        return <AntDesign {...props} />;
      case "Entypo":
        return <Entypo {...props} />;
      case "EvilIcons":
        return <EvilIcons {...props} />;
      case "Feather":
        return <Feather {...props} />;
      case "FontAwesome":
        return <FontAwesome {...props} />;
      case "FontAwesome5":
        return <FontAwesome5 {...props} />;
      case "FontAwesome5Pro":
        return <FontAwesome5Pro {...props} />;
      case "Fontisto":
        return <Fontisto {...props} />;
      case "Foundation":
        return <Foundation {...props} />;
      case "Ionicons":
        return <Ionicons {...props} />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons {...props} />;
      case "MaterialIcons":
        return <MaterialIcons {...props} />;
      case "Octicons":
        return <Octicons {...props} />;
      case "SimpleLineIcons":
        return <SimpleLineIcons {...props} />;
      case "Zocial":
        return <Zocial {...props} />;
      default:
        throw new Error("Unknown icon set");
    }
  };

  return (
    <Component
      name={icon}
      size={size}
      color={color ? String(color) : isDarkMode ? Colors.white : Colors.black}
    />
  );
}
