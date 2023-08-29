import { ConnectionRecord } from "@aries-framework/core"
import { useConnections } from "@aries-framework/react-hooks"
import { MaterialIcons } from "@expo/vector-icons"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useEffect, useState } from "react"
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import { ContactStackParamList } from "../../navigators/ContactStack"

type Props = StackScreenProps<
  ContactStackParamList,
  "Contacts",
  "ConnectionDetails"
>

const Contacts = ({ navigation, route }: Props) => {
  const [search, setSearch] = useState("")
  const [filteredConnections, setFilteredConnections] = useState<
    ConnectionRecord[]
  >([])
  const connections = useConnections()

  useEffect(() => {
    setFilteredConnections(connections.records)
    console.log(connections.records)
  }, [connections.records])

  const searchFilterFunction = (text: string) => {
    if (text === "") {
      setFilteredConnections(connections.records)
    } else {
      const filteredData = connections.records.filter((connection) => {
        const myDid = connection.theirLabel || "" // Handle undefined value
        return myDid.toLowerCase().includes(text.toLowerCase())
      })
      setFilteredConnections(filteredData)
    }
    setSearch(text)
  }

  const clearSearch = () => {
    setFilteredConnections(connections.records)
    setSearch("")
  }

  const renderItem = ({ item }: { item: ConnectionRecord }) => {
    const createdAt = new Date(item.createdAt)
    const now = new Date()

    const formattedDate = createdAt.toLocaleDateString()
    const formattedTime = createdAt.toLocaleTimeString()

    let dateDisplay = formattedDate

    if (
      createdAt.getDate() === now.getDate() &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    ) {
      dateDisplay = "Today"
    } else if (
      createdAt.getDate() === now.getDate() - 1 &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    ) {
      dateDisplay = "Yesterday"
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
              <Text style={styles.itemText}>{item.theirLabel}</Text>
              <Text style={styles.timeText}>{formattedTime}</Text>
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
      )
    } else {
      return null // Do not render connections with future dates
    }
  }

  const ItemSeparatorView = () => (
    <View style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
  )

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
  )
}

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
    paddingHorizontal: 20,
  },

  leftContent: {
    flexDirection: "column", // Display vertically
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
})
export default Contacts
