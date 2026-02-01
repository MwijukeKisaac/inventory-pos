import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import api from "../services/api";

export default function WaiterDashboard() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await api.get("/orders?status=PENDING");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const confirmOrder = async (id) => {
    await api.put(`/orders/${id}/confirm`);
    loadOrders();
  };

  return (
    <View style={{ padding: 15 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        🍽️ New Orders
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
                backgroundColor: "#22c55e",
                padding: 10,
                borderRadius: 8,
                marginTop: 10,
              }}
              onPress={() => confirmOrder(item.id)}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Confirm Order
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
