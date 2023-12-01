// NumberPad.tsx
import React from "react"
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native"

interface NumberPadProps {
  onKeyPress: (value: number) => void
  onDelete: () => void
}

const NumberPad: React.FC<NumberPadProps> = ({ onKeyPress, onDelete }) => {
  const renderKey = (value: number) => (
    <TouchableOpacity
      key={value}
      style={styles.key}
      onPress={() => onKeyPress(value)}
    >
      <Text style={styles.keyText}>{value}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.row}>{[1, 2, 3].map(renderKey)}</View>
      <View style={styles.row}>{[4, 5, 6].map(renderKey)}</View>
      <View style={styles.row}>{[7, 8, 9].map(renderKey)}</View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.displayNone}
          onPress={() => onKeyPress(0)}
        ></TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={() => onKeyPress(0)}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconKey} onPress={onDelete}>
          <Image
            style={styles.icon}
            source={require("../../assets/delete.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  displayNone: {
    width: 70,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  key: {
    width: 70,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  keyText: {
    fontSize: 20,
    color: "#2a3d54",
    fontWeight: "bold",
  },
  iconKey: {
    width: 70,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  icon: {
    width: "40%",
    height: "50%",
  },
})

export default NumberPad
