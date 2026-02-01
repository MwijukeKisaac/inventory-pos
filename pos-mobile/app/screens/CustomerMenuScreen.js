import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

export default function CustomerMenuScreen({ route }) {
  const qrData = route?.params?.qrData; // Optional QR data from navigation

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useContext MUST be inside the component
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log("Error loading menu", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {item.name}
      </Text>
      <Text style={{ color: "#555", marginVertical: 5 }}>
        UGX {item.price}
      </Text>
      {/* ADD TO CART LOGIC */}
      <TouchableOpacity
        style={{
          backgroundColor: "#0ea5e9",
          padding: 10,
          borderRadius: 8,
          marginTop: 10,
        }}
        onPress={() => addToCart(item)}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Add to Order
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ padding: 15 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 15,
        }}
      >
        🍹 Drinks Menu
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
