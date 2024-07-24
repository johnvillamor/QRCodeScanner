import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Clipboard } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(""); // State for scanned data

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedData(data); // Set only the raw scanned data
  };

  const copyToClipboard = () => {
    Clipboard.setString(scannedData); // Copy the scanned data to clipboard
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={styles.camera}
        />
      </View>
      <View style={styles.infoContainer}>
        {scanned && <Text style={styles.scannedText}>{scannedData}</Text>}
        {scanned && (
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setScanned(false);
                setScannedData(""); // Clear scanned data when scanning again
              }}
            >
              <Text style={styles.buttonText}>Tap to Scan Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={copyToClipboard}
            >
              <Text style={styles.buttonText}>Copy to Clipboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'gold', // Background color
  },
  cameraContainer: {
    width: 300,
    height: 400,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 20,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    marginTop: 40, // Space between camera box and info text
    alignItems: "center",
  },
  scannedText: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    marginTop: 20, // Increased space between buttons
    paddingVertical: 15, // Increased vertical padding
    paddingHorizontal: 25, // Increased horizontal padding
    borderRadius: 20,
    backgroundColor: 'red', // Button background color
    alignItems: 'center', // Center text within the button
  },
  buttonText: {
    color: '#FFFFFF', // Button text color
    fontSize: 18, // Increased font size for better readability
  },
});
