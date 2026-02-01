import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import api from "../services/api";

export default function ReceiptScreen({ route }) {
  const { orderId } = route.params;
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    generate();
  }, []);

  const generate = async () => {
    const res = await api.post(`/receipts/${orderId}`);
    setReceipt(res.data);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        🧾 Receipt
      </Text>

      {receipt && (
        <>
          <Text>Receipt No: {receipt.receiptNo}</Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#0ea5e9",
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text
              style={{ color: "#fff", textAlign: "center" }}
            >
              Download PDF
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
