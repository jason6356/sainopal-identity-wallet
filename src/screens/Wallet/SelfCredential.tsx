import useHideBottomTabBar from "@hooks/useHideBottomTabBar";
import { WalletStackParamList } from "@navigation/WalletStack";
import { StackScreenProps } from "@react-navigation/stack";
import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

const db = SQLite.openDatabase("db.db");

type Props = StackScreenProps<WalletStackParamList, "SelfCredential">;
const SelfCredential = ({ navigation }: Props) => {
  useHideBottomTabBar();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fields, setFields] = useState([{ value: "" }]);

  const [editingIndex, setEditingIndex] = useState(-1);

  const handleUpdate = () => {
    setIsEditing(!isEditing);
    setEditingIndex(-1);

    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE selfCredential SET name=?, email=? WHERE id=?",
          [name, email, 1],
          () => {
            console.log("selfCredential table updated successfully!");
          },
          (error) => {
            console.log(
              "Error updating selfCredential table: " + error.message
            );
          }
        );

        tx.executeSql(
          "SELECT * FROM hardSkills WHERE selfCredentialId=?",
          [1],
          (_, result) => {
            const rows = (result.rows && result.rows._array) || [];

            fields.forEach((field, index) => {
              if (index + 1 <= rows.length) {
                tx.executeSql(
                  "UPDATE hardSkills SET value=? WHERE id=?",
                  [field.value, rows[index].id],
                  () => {
                    console.log("hardSkills table updated successfully!");
                  },
                  (error) => {
                    console.log(
                      "Error updating hardSkills table: " + error.message
                    );
                  }
                );
              } else {
                tx.executeSql(
                  "INSERT INTO hardSkills (selfCredentialId, value) VALUES (?, ?)",
                  [1, field.value],
                  () => {
                    console.log("hardSkills table inserted successfully!");
                  },
                  (error) => {
                    console.log(
                      "Error inserting into hardSkills table: " + error.message
                    );
                  }
                );
              }
            });
          },
          (error) => {
            console.log(
              "Error reading from hardSkills table: " + error.message
            );
          }
        );
      },
      (error) => {
        console.log("Transaction Error: " + error.message);
      }
    );
  };

  const handleEditField = (index: number) => {
    setEditingIndex(index);
  };

  const handleAddField = () => {
    const newField = { label: "", value: "" };
    setFields([...fields, newField]);
    setEditingIndex(fields.length);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleFieldClick = (index: number) => {
    setEditingIndex(index);
  };

  useEffect(() => {
    // Create tables if they don't exist
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS selfCredential (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);"
        );

        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS hardSkills (id INTEGER PRIMARY KEY AUTOINCREMENT, selfCredentialId INTEGER, value TEXT, FOREIGN KEY(selfCredentialId) REFERENCES selfCredential(id));"
        );
      },
      (error) => {
        console.log("Transaction Error: " + error.message);
      },
      () => {
        // Read data from SQLite when component mounts
        db.transaction(
          (tx) => {
            tx.executeSql(
              "SELECT * FROM selfCredential WHERE id=?",
              [1], // Assuming the id is 1, you might need to change this based on your table structure
              (_, result) => {
                const dataRows = (result.rows && result.rows._array) || [];

                if (dataRows.length === 0) {
                  // Insert default data when the table is empty
                  tx.executeSql(
                    "INSERT INTO selfCredential (name, email) VALUES (?, ?)",
                    ["Name", "Email"]
                  );
                } else {
                  const { name, email } = dataRows[0];
                  setName(name);
                  setEmail(email);
                }
              },
              (error) => {
                console.log(
                  "Error reading from selfCredential table: " + error.message
                );
              }
            );

            tx.executeSql(
              "SELECT * FROM hardSkills WHERE selfCredentialId=?",
              [1], // Assuming the id is 1, you might need to change this based on your table structure
              (_, result) => {
                const dataRows = (result.rows && result.rows._array) || [];

                const skills = dataRows.map((row) => ({ value: row.value }));
                setFields(skills);
              },
              (error) => {
                console.log(
                  "Error reading from hardSkills table: " + error.message
                );
              }
            );
          },
          (error) => {
            console.log("Transaction Error: " + error.message);
          }
        );
      }
    );
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.heading}>Profile Information</Text>
        <View style={styles.containerImage}>
          <Image
            source={require("../../assets/profile.png")}
            style={styles.image}
          />
        </View>
        <Text style={styles.labelTitle}>Name:</Text>
        <View style={styles.fieldRow}>
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
        <Text style={styles.labelTitle}>Email:</Text>
        <View style={styles.fieldRow}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.text}>{email}</Text>
          )}
        </View>
        <Text style={styles.labelTitle}>Hard Skill</Text>
        {fields.map((field, index) => (
          <TouchableOpacity key={index} onPress={() => handleFieldClick(index)}>
            <View key={index} style={styles.fieldRow}>
              {isEditing && editingIndex === index ? (
                <TextInput
                  key={index}
                  style={styles.input}
                  value={field.value}
                  onChangeText={(text) => {
                    const updatedFields = [...fields];
                    updatedFields[index].value = text;
                    setFields(updatedFields);
                  }}
                />
              ) : (
                <Text key={index} style={styles.text}>
                  {field.value}{" "}
                </Text>
              )}
              {isEditing && (
                <TouchableOpacity
                  key={`edit_${index}`}
                  onPress={() => handleEditField(index)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              )}
              {isEditing && (
                <View key={`delete_${index}`} style={styles.deleteCon}>
                  <TouchableOpacity onPress={() => handleRemoveField(index)}>
                    <Icon name="close" size={15} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {/* Plus Button outside of the field rows */}
      {isEditing && (
        <TouchableOpacity onPress={handleAddField} style={styles.addButton}>
          <Icon name="plus" size={20} color="#90b4fc" />
        </TouchableOpacity>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
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
    color: "#0c2c44",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0c2c44",
  },
  labelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#0c2c44",
  },
  input: {
    width: "100%",
    fontSize: 16,
    borderColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    color: "#0c2c44",
  },
  buttonContainer: {
    marginBottom: 500,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    width: 200,
  },
  button: {
    flex: 1,
    marginRight: 10,
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
  addButton: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderColor: "#90b4fc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: 40,
    justifyContent: "center",
  },

  fieldRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },

  deleteCon: {
    marginLeft: "auto",
  },
});

export default SelfCredential;
