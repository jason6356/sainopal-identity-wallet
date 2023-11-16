import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const tabBarStyle = {
  position: "absolute",
  bottom: 0,
  right: 0,
  left: 0,
  elevation: 0,
  height: 70,
  backgroundColor: "#fff",
  paddingBottom: 20,
  paddingTop: 20,
};

export default function useHideBottomTabBar() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      navigation.setOptions({
        tabBarVisible: false,
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });

    return () =>
      navigation.getParent()?.setOptions({ tabBarStyle: tabBarStyle });
  }, [navigation]);
}
