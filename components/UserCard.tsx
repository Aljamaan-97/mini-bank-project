import { useTheme } from "@/assets/theme/ThemeProvider";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface User {
  _id: string;
  username: string;
  balance: number;
  image?: string;
}

interface UserCardProps {
  user: User;
  onTransfer: (username: string, amount: number) => void;
}

export default function UserCard({ user, onTransfer }: UserCardProps) {
  const COLORS = useTheme();

  const [amount, setAmount] = useState("");
  const [showInput, setShowInput] = useState(false);

  const isValidImage = user.image && !user.image.startsWith("C:\\fakepath");
  const imageUrl = isValidImage
    ? `https://react-bank-project.eapi.joincoded.com/${user.image}`
    : "https://via.placeholder.com/60";

  const handlePress = () => {
    if (!showInput) {
      setShowInput(true);
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount)) {
      onTransfer(user.username, parsedAmount);
      setAmount("");
      setShowInput(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: COLORS.colors.card,
          borderColor: COLORS.colors.border,
        },
      ]}
    >
      <Image
        source={{ uri: imageUrl }}
        style={[styles.avatar, { borderColor: COLORS.colors.border }]}
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: COLORS.colors.primaryText }]}>
          {user.username}
        </Text>
        <Text style={[styles.balance, { color: COLORS.colors.secondaryText }]}>
          Balance: {user.balance.toFixed(3)}
        </Text>

        {showInput && (
          <TextInput
            style={[
              styles.input,
              {
                borderColor: COLORS.colors.border,
                color: COLORS.colors.primaryText,
              },
            ]}
            placeholder="Enter amount"
            placeholderTextColor={COLORS.colors.secondaryText}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        )}

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.colors.primaryAccent },
          ]}
          onPress={handlePress}
        >
          <Text style={[styles.buttonText, { color: COLORS.colors.surface }]}>
            Transfer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  balance: {
    marginTop: 4,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 6,
    borderRadius: 4,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontWeight: "600",
  },
});
