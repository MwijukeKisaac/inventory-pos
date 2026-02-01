import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomerMenuScreen from "../screens/CustomerMenuScreen";
import CartScreen from "../screens/CartScreen";
import QRScanScreen from "../screens/QRScanScreen";
import PaymentScreen from "../screens/PaymentScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Menu"
        component={CustomerMenuScreen}
        options={{ title: "Menu" }}
      />
      <Stack.Screen name="Waiter" component={WaiterDashboard} />
<Stack.Screen name="Cashier" component={CashierDashboard} />
      <Stack.Screen name="Receipt" component={ReceiptScreen} />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
      />
      <Stack.Screen
        name="Scan"
        component={QRScanScreen}
        options={{ title: "Scan Menu QR" }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
      />
    </Stack.Navigator>
  );
}
