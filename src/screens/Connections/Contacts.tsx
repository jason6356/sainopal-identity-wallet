import { ConnectionRecord } from "@aries-framework/core";
import { useConnections } from "@aries-framework/react-hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
} from "react-native";
import { ContactStackParamList } from "../../navigators/ContactStack";

type Props = StackScreenProps<
  ContactStackParamList,
  "Contacts",
  "ConnectionDetails"
>;

const defaultUserAvatar = `data:image/png;base64,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`;

const Contacts = ({ navigation, route }: Props) => {
  const [search, setSearch] = useState("");
  const [filteredConnections, setFilteredConnections] = useState<
    ConnectionRecord[]
  >([]);
  const connections = useConnections();

  useEffect(() => {
    setFilteredConnections(connections.records);
    console.log(connections.records);
    //console.log(connections.records);
  }, [connections.records]);

  const searchFilterFunction = (text: string) => {
    if (text === "") {
      setFilteredConnections(connections.records);
    } else {
      const filteredData = connections.records.filter((connection) => {
        const myDid = connection.theirLabel || ""; // Handle undefined value
        return myDid.toLowerCase().includes(text.toLowerCase());
      });
      setFilteredConnections(filteredData);
    }
    setSearch(text);
  };

  const clearSearch = () => {
    setFilteredConnections(connections.records);
    setSearch("");
  };

  const renderItem = ({ item }: { item: ConnectionRecord }) => {
    const createdAt = new Date(item.createdAt);
    const now = new Date();

    const formattedDate = createdAt.toLocaleDateString();
    const formattedTime = createdAt.toLocaleTimeString();

    let dateDisplay = formattedDate;

    if (
      createdAt.getDate() === now.getDate() &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    ) {
      dateDisplay = "Today";
    } else if (
      createdAt.getDate() === now.getDate() - 1 &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    ) {
      dateDisplay = "Yesterday";
    }

    if (createdAt < now) {
      return (
        <Pressable
          onPress={() =>
            navigation.push("ConnectionDetails", {
              connection_id: item.id,
            })
          }
        >
          <View style={styles.itemContainer}>
            <View style={styles.leftContent}>
              <View>
                <Image
                  style={{ width: 40, height: 40 }}
                  source={{
                    uri: item.imageUrl ? item.imageUrl : defaultUserAvatar,
                  }}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.itemText}>{item.theirLabel}</Text>
                <Text style={styles.timeText}>{formattedTime}</Text>
              </View>
            </View>
            <View style={styles.rightContent}>
              <Text style={styles.dateText}>{dateDisplay}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="#555"
              />
            </View>
          </View>
        </Pressable>
      );
    } else {
      return null; // Do not render connections with future dates
    }
  };

  const ItemSeparatorView = () => (
    <View style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.textInputContainer}>
          <View style={styles.searchIcon}>
            <MaterialIcons name="search" size={20} color="#999" />
          </View>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={searchFilterFunction}
            value={search}
            placeholder="Search ..."
            placeholderTextColor="#999"
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <View style={styles.clearIcon}>
              <MaterialIcons
                name="clear"
                size={20}
                color="#999"
                onPress={clearSearch}
              />
            </View>
          )}
        </View>

        <Text style={styles.title}>Established contacts</Text>
        <View>
          <FlatList
            data={filteredConnections}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "white",
  },

  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  textInputStyle: {
    height: 40,
    margin: 5,
    backgroundColor: "#f8f8f8",
  },

  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  leftContent: {
    flexDirection: "row", // Display vertically
  },

  rightContent: {
    flexDirection: "row", // Display horizontally
    alignItems: "center", // Align items vertically
  },

  arrowAndDateContainer: {
    flexDirection: "row", // Display horizontally
    alignItems: "center", // Align arrow and date vertically
  },

  dateText: {
    fontSize: 14,
    color: "#b0b5bb",
  },
  timeText: {
    fontSize: 14,
    color: "#b0b5bb",
    marginBottom: 5,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 20,
    position: "relative",
  },

  searchIcon: {
    marginRight: 10,
    backgroundColor: "#f8f8f8",
  },

  clearIcon: {
    position: "absolute",
    right: 10,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#b0b5bb",
  },

  separator: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#C8C8C8",
  },
});
export default Contacts;
