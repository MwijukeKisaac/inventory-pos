import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function QRScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleScan = ({ data }) => {
    setScanned(true);

    // Example QR data: shop_id=1&table_no=5
    navigation.navigate("Menu", {
      qrData: data,
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleScan}
        style={{ flex: 1 }}
      />
      {scanned && (
        <Button
          title="Scan Again"
          onPress={() => setScanned(false)}
        />
      )}
    </View>
  );
}
