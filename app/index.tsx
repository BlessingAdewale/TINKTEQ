import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDatabase, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/config";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


const LiveTracking: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          if (loc?.coords) {
            const { latitude, longitude } = loc.coords;
            const newLocation: Coordinates = { latitude, longitude };
            setLocation(newLocation);
            sendLocationToBackend(newLocation);
          }
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const sendLocationToBackend = (coords: Coordinates) => {
    set(ref(database, "users/driver1/location"), {
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp: Date.now(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="Your Location" />
        </MapView>
      )}
    </SafeAreaView>
  );
};

export default LiveTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
