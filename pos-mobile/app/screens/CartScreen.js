import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { CartContext } from "../context/CartContext";

export default function CartScreen({ route, navigation }) {
  const { cart, updateQty, total } = useContext(CartContext);

  // Get QR data passed from Menu screen (optional for now)
  const qrData = route?.params?.qrData;

  // TEMP: hard-coded values (we'll improve this next)
  const shop_id = 1;
  const table_no = 1;

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        {item.name}
      </Text>

      <Text>UGX {item.price}</Text>

      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => updateQty(item.id, item.qty - 1)}
        >
          <Text style={{ fontSize: 22 }}>➖</Text>
        </TouchableOpacity>

        <Text style={{ marginHorizontal: 15 }}>
          {item.qty}
        </Text>

        <TouchableOpacity
          onPress={() => updateQty(item.id, item.qty + 1)}
        >
          <Text style={{ fontSize: 22 }}>➕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ padding: 15 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 15,
        }}
      >
        🧾 Order Summary
      </Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 15,
        }}
      >
        Total: UGX {total}
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#22c55e",
          padding: 15,
          borderRadius: 10,
          marginTop: 15,
        }}
        onPress={() =>
          navigation.navigate("Payment", {
            orderId: 1, // replace with real orderId from backend
            total,
          })
        }
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Submit Order
        </Text>
      </TouchableOpacity>
    </View>
  );
}
