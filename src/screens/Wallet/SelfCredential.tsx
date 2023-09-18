import React, { useLayoutEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { StackScreenProps } from "@react-navigation/stack"
import { WalletStackParamList } from "../../navigators/WalletStack"

// import { Picker } from "@react-native-picker/picker"

type Props = StackScreenProps<WalletStackParamList, "SelfCredential">

const SelfCredential = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Self Credential",
    })
  })
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("John Doe")
  const [cgpa, setCGPA] = useState("3.5")
  const [study, setStudy] = useState("Computer Science")
  const [birthDate, setBirthDate] = useState(new Date())
  const [address, setAddress] = useState("123 Main St, City")

  const handleUpdate = () => {
    setIsEditing(!isEditing) // Toggle edit mode
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.heading}>Profile Information</Text>

        <View style={[styles.containerImage]}>
          <Image
            source={require("../../assets/profile.png")}
            style={styles.image}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          ) : (
            <Text style={styles.text}>{name}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>CGPA:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={cgpa}
              onChangeText={(text) => setCGPA(text)}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.text}>{cgpa}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Address:</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={address}
              onChangeText={(text) => setAddress(text)}
              multiline
            />
          ) : (
            <Text style={styles.text}>{address}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>{isEditing ? "Save" : "Edit"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sharebutton}>
            <Text style={styles.buttonText}>{"Share"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 150,
    height: 150,
  },
  containerImage: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  text: {
    fontSize: 16,
  },
  datePicker: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#90b4fc",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  sharebutton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#90b4fc",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default SelfCredential
