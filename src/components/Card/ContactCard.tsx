import { Image, StyleSheet, Text, View } from "react-native";
import { ConnectionRecord } from "@aries-framework/core";
import { MaterialIcons } from "@expo/vector-icons";
import { defaultUserAvatar } from "@constants/index";

type ContactCardProps = {
  connectionInvitation: ConnectionRecord | undefined;
};

export function ContactCard({ connectionInvitation }: ContactCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          <Image
            style={{ width: 70, height: 70 }}
            source={{
              uri: connectionInvitation?.imageUrl
                ? connectionInvitation?.imageUrl
                : defaultUserAvatar,
            }}
          />
        </View>

        <View style={styles.rightContent}>
          <Text style={styles.connectionLabel}>
            {connectionInvitation?.theirLabel}
          </Text>
          <View>
            <Text style={styles.verifiedStatus}>
              Contact is Verified
              <MaterialIcons name="verified-user" size={14} color="green" />
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
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
    flexDirection: "row",
    zIndex: 1, // Ensure content is above the overlay
  },
  leftContent: {
    flexDirection: "row",
    paddingRight: 15,
  },
  rightContent: {
    marginLeft: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  connectionLabel: {
    textAlign: "left",
    fontSize: 18,
  },
  verifiedStatus: {
    marginTop: 10,
    fontSize: 14,
    color: "green",
  },
});
