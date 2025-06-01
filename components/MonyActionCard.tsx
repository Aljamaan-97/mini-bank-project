// src/components/TransactionTabs.tsx

import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { depositt, withdrawFunds } from "@/Api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TransactionTabsProps {
  balance: number;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({ balance }) => {
  // --- حالات الواجهة ---
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);

  // أنيميشن الاهتزاز عند حدوث خطأ
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const numericAmount = parseFloat(amount);
  const isSendDisabled = !amount || numericAmount < 1 || isNaN(numericAmount);

  // استدعاء QueryClient لإبطال كاش بيانات الملف الشخصي بعد نجاح أي عملية
  const queryClient = useQueryClient();

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ------------------------------------
  // إعداد useMutation بالإصدار الكائني
  // ------------------------------------
  // 1) دالة الإيداع
  const { mutate: depositMutate, isPending: isDepositPending } = useMutation<
    number,
    Error,
    number
  >({
    mutationKey: ["deposit"],
    mutationFn: (amt: number) => depositt(amt),
    onMutate: () => {
      console.log("بدأت عملية الإيداع...");
    },
    onError: (error) => {
      console.error("خطأ أثناء الإيداع:", error);
      Alert.alert("فشل الإيداع", "حاول مرة أخرى في وقت لاحق.");
    },
    onSuccess: (data) => {
      console.log("تم الإيداع بنجاح:", data);
      Alert.alert("نجاح", "تم إيداع المبلغ بنجاح.");
      // بعد النجاح، نُعِيد جلب بيانات الملف الشخصي (الرصيد)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setAmount("");
    },
    onSettled: () => {
      console.log("انتهت عملية الإيداع.");
    },
  });

  // 2) دالة السحب
  const { mutate: withdrawMutate, isPending: isWithdrawPending } = useMutation<
    number,
    Error,
    number
  >({
    mutationKey: ["withdraw"],
    mutationFn: (amt: number) => withdrawFunds(amt),
    onMutate: () => {
      console.log("بدأت عملية السحب...");
    },
    onError: (error) => {
      console.error("خطأ أثناء السحب:", error);
      Alert.alert("فشل السحب", "حاول مرة أخرى أو تأكد من الرصيد.");
    },
    onSuccess: (data) => {
      console.log("تم السحب بنجاح:", data);
      Alert.alert("نجاح", "تم سحب المبلغ بنجاح.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setAmount("");
    },
    onSettled: () => {
      console.log("انتهت عملية السحب.");
    },
  });

  // ------------------------------------
  // دالة التعامل مع الضغط على "Send"
  // ------------------------------------
  const handleSend = () => {
    setErrorMessage("");
    setHasError(false);

    // 1) التحقق من صلاحية المبلغ
    if (isNaN(numericAmount) || numericAmount < 1) {
      setErrorMessage("أدخل مبلغًا صالحًا أكبر من صفر.");
      setHasError(true);
      triggerShake();
      return;
    }

    // 2) في حالة السحب، نتحقّق من كفاية الرصيد
    if (activeTab === "withdraw" && numericAmount > balance) {
      setErrorMessage("الرصيد غير كافٍ");
      setHasError(true);
      triggerShake();
      return;
    }

    // 3) بناءً على التبويب، نطلق الـ mutate المناسب
    if (activeTab === "deposit") {
      depositMutate(numericAmount);
    } else {
      withdrawMutate(numericAmount);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* تبويبات Deposit / Withdraw */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "deposit" && styles.activeTab]}
          onPress={() => {
            setActiveTab("deposit");
            setErrorMessage("");
            setHasError(false);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "deposit" && styles.activeTabText,
            ]}
          >
            Deposit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "withdraw" && styles.activeTab]}
          onPress={() => {
            setActiveTab("withdraw");
            setErrorMessage("");
            setHasError(false);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "withdraw" && styles.activeTabText,
            ]}
          >
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>

      {/* حقل إدخال المبلغ مع تأثير الاهتزاز */}
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <TextInput
          placeholder="Enter amount"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={amount}
          onChangeText={(value) => {
            setAmount(value);
            setErrorMessage("");
            setHasError(false);
          }}
          style={[styles.input, hasError && styles.inputError]}
        />
      </Animated.View>

      {/* رسالة الخطأ إن وُجدت */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* زر الإرسال */}
      <TouchableOpacity
        onPress={handleSend}
        style={[
          styles.sendButton,
          (isSendDisabled || isDepositPending || isWithdrawPending) &&
            styles.disabledButton,
        ]}
        disabled={isSendDisabled || isDepositPending || isWithdrawPending}
      >
        {isDepositPending || isWithdrawPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.sendButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TransactionTabs;

// ------------------------------ الأنماط ------------------------------
const COLORS = {
  primary: "#1E3D58",
  accent: "#00A8E8",
  lightText: "#FFFFFF",
  border: "#C5CED8",
  card: "#FFFFFF",
};

const styles = StyleSheet.create({
  /* 1. صندوق المكون */
  cardContainer: {
    width: "90%",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    alignSelf: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  /* 2. التبويبات (Tabs) */
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: "#444",
    fontWeight: "600",
  },
  activeTabText: {
    color: COLORS.lightText,
  },
  /* 3. حقل الإدخال */
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  inputError: {
    borderColor: "red",
  },
  /* 4. رسالة الخطأ */
  errorText: {
    color: "red",
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 14,
  },
  /* 5. زر الإرسال */
  sendButton: {
    marginTop: 5,
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  sendButtonText: {
    color: COLORS.lightText,
    fontWeight: "700",
    fontSize: 16,
  },
});
