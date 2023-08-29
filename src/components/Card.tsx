import React from "react"
import { View, Text, StyleSheet, Image } from "react-native"

interface CardProps {
  title: string
  content: string
  imageSource?: any // Image source for the image overlay
}

const Card: React.FC<CardProps> = ({ title, content, imageSource }) => {
  return (
    <View style={styles.card}>
      {imageSource && (
        <Image source={imageSource} style={styles.imageOverlay} />
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text>{content}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative", // Required for positioning the overlay
  },
  contentContainer: {
    zIndex: 1, // Ensure content is above the overlay
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.2,
  },
})

export default Card
