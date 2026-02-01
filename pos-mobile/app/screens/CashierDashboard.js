import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import api from "../services/api";

export default function CashierDashboard({ navigation }) {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await api.get("/orders?status=CONFIRMED");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <View style={{ padding: 15 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        💰 Pending Payments
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 15,
              marginVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text>Table: {item.table_no}</Text>
            <Text>Total: UGX {item.total}</Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#0ea5e9",
                padding: 10,
                borderRadius: 8,
                marginTop: 10,
              }}
              onPress={() =>
                navigation.navigate("Payment", {
                  orderId: item.id,
                  total: item.total,
                })
              }
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Receive Payment
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
