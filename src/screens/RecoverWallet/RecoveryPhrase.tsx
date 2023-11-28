import { StackScreenProps } from "@react-navigation/stack";
import * as SQLite from "expo-sqlite";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  Clipboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import RecoveryPhraseTable from "../../../sqlite/recoveryPhrase";
import { SettingStackParamList } from "@navigation/SettingStack";
import useHideBottomTabBar from "@hooks/useHideBottomTabBar";
type Props = StackScreenProps<SettingStackParamList, "RecoveryPhrase">;
const db = SQLite.openDatabase("db.db");

const RecoveryPhrase = ({ navigation }: Props) => {
  useHideBottomTabBar();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Recover Wallet",
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      },
    });
  }, [navigation]);

  const [storedRecoveryPhrase, setStoredRecoveryPhrase] = useState<string[]>(
    []
  );

  useEffect(() => {
    // db.transaction(
    //   (tx) => {
    //     tx.executeSql("SELECT * FROM recoveryPhrase;", [], (_, { rows }) => {
    //       const recoveryPhraseData: any[] = rows._array
    //       const decodedWords = recoveryPhraseData.map((item) => {
    //         return item.word ? item.word : null
    //       })

    //       const wordsString = decodedWords.join(" ")
    //       console.log(wordsString)

    //       if (recoveryPhraseData.length > 0) {
    //         setStoredRecoveryPhrase(decodedWords)
    //       }
    //     })
    //   },
    //   (error) => {
    //     console.log("Transaction Error: " + error.message)
    //   }
    // )
    RecoveryPhraseTable.getAllPhrasesArray((phrases) => {
      console.log("Retrieved Phrases:", phrases);
      const decodedWords = phrases.map((item) =>
        item.word ? item.word : null
      );
      setStoredRecoveryPhrase(decodedWords);
    });
  }, []);

  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleCopyToClipboard = async () => {
    const recoveryPhraseText = storedRecoveryPhrase.join(" ");
    Clipboard.setString(recoveryPhraseText);
    startShakeAnimation();
  };

  const textColorInterpolation = shakeAnimation.interpolate({
    inputRange: [-10, 0, 10],
    outputRange: ["#465360", "#465360", "lightgreen"],
  });

  return (
    <View style={styles.container}>
      <Toast position="bottom" bottomOffset={20} />

      <View>
        <Text style={styles.title}>Please secure your recovery phrase</Text>
      </View>
      <View>
        <Text style={styles.subtitle}>
          You should store these 12 secret words in the right order in a safe
          place.
        </Text>
      </View>

      <Animated.View
        style={[
          styles.subtitleContainer,
          {
            borderColor: textColorInterpolation,
          },
        ]}
      >
        {storedRecoveryPhrase.map((word, index) => (
          <Animated.Text
            key={index}
            style={[styles.subtitleText, { color: textColorInterpolation }]}
          >
            {index > 0 ? " " : ""}
            {word}
          </Animated.Text>
        ))}
      </Animated.View>

      <View style={styles.containerButton}>
        <TouchableOpacity
          style={styles.importButton}
          onPress={handleCopyToClipboard}
        >
          <Text style={styles.importButtonText}>Copy to clipboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    lineHeight: 35,
    fontWeight: "bold",
    marginTop: 20,
    color: "#243853",
  },
  subtitle: {
    marginTop: 10,
    lineHeight: 25,
    fontSize: 16,
    fontWeight: "bold",
    color: "#aaafb8",
  },
  selectedFileText: {
    marginTop: 15,
    fontSize: 16,
    color: "#243853",
  },
  importButton: {
    marginTop: 20,
    backgroundColor: "#90b4fc",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  importButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  containerButton: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 90,
  },

  subtitleContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d0cccc",
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#475361",
    textAlign: "center",
    marginHorizontal: 5,
    marginBottom: 5,
    paddingTop: 10,
  },
});

export default RecoveryPhrase;
