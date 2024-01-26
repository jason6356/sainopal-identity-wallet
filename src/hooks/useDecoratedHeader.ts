import { useNavigation } from "@react-navigation/native"
import { useLayoutEffect } from "react"

export default function useDecoratedHeader() {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    //change header color to #09182d and text to white
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#09182d",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      headerTintColor: "white",
    })
  })
}
