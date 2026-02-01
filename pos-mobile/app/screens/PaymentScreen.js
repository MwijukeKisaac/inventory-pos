import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import api from "../services/api";

export default function PaymentScreen({ route, navigation }) {
  const { orderId, total } = route.params;

  const [method, setMethod] = useState(null);
  const [phone, setPhone] = useState("");

  const submitPayment = async () => {
    if (!method) {
      Alert.alert("Select payment method");
      return;
    }

    if (method === "MOBILE_MONEY" && phone.length < 9) {
      Alert.alert("Enter valid phone number");
      return;
    }

    try {
      await api.post("/payments", {
        order_id: orderId,
        payment_method: method,
        amount: total,
        phone,
      });

      Alert.alert("Payment successful ✅");

      navigation.navigate("Receipt", { orderId });
    } catch (err) {
      Alert.alert("Payment failed ❌");
      console.log(err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        💳 Payment
      </Text>

      <Text style={{ marginVertical: 10 }}>
        Amount: UGX {total}
      </Text>

      {/* CASH */}
      <TouchableOpacity
        style={{
          backgroundColor:
            method === "CASH" ? "#22c55e" : "#e5e7eb",
          padding: 15,
          borderRadius: 10,
          marginVertical: 10,
        }}
        onPress={() => setMethod("CASH")}
      >
        <Text style={{ textAlign: "center" }}>
          💵 Pay with Cash
        </Text>
      </TouchableOpacity>

      {/* MOBILE MONEY */}
      <TouchableOpacity
        style={{
          backgroundColor:
            method === "MOBILE_MONEY"
              ? "#0ea5e9"
              : "#e5e7eb",
          padding: 15,
          borderRadius: 10,
          marginVertical: 10,
        }}
        onPress={() => setMethod("MOBILE_MONEY")}
      >
        <Text style={{ textAlign: "center" }}>
          📱 Pay with Mobile Money
        </Text>
      </TouchableOpacity>

      {method === "MOBILE_MONEY" && (
        <TextInput
          placeholder="Phone number (2567XXXXXXXX)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 12,
            borderRadius: 8,
            marginTop: 10,
          }}
        />
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#111827",
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
        }}
        onPress={submitPayment}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Confirm Payment
        </Text>
      </TouchableOpacity>
    </View>
  );
}
