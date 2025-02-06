import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { database } from "../firebase/config";
import { ref, set } from "firebase/database";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import layout from "@/constants/layout";

const SNAP_POINTS = ["30%", "70%"]; 

const LiveTracking: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [prevLocation, setPrevLocation] = useState<Coordinates | null>(null);
  const [driverStatus, setDriverStatus] = useState("On the way");
  const [isLoading, setIsLoading] = useState(false);
  
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      setIsLoading(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setIsLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setPrevLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          if (loc?.coords) {
            const newLocation: Coordinates = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            setLocation(newLocation);
            sendLocationToBackend(newLocation);
          }
        }
      );

      // Ensure the BottomSheetModal is presented after the component is mounted
      setTimeout(() => {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.present();
        }
      }, 500); // Small delay to ensure BottomSheet is rendered

      setIsLoading(false);
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

  const refreshLocation = async () => {
    setIsLoading(true);
    try {
      const newLocation = await Location.getCurrentPositionAsync({});
      const newCoords = {
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
      };
      if (
        prevLocation?.latitude !== newCoords.latitude ||
        prevLocation?.longitude !== newCoords.longitude
      ) {
        setLocation(newCoords);
        setPrevLocation(newCoords);
        sendLocationToBackend(newCoords);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
    setIsLoading(false);
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location?.latitude || 6.5244,
            longitude: location?.longitude || 3.3792,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {location && (
            <Marker coordinate={location} title="The Driver's Location" />
          )}
        </MapView>

        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={SNAP_POINTS}
          enableDismissOnClose={false}
          animateOnMount={true} // Changed to true for animation
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.headerText}>Driver's Location</Text>
            {isLoading ? (
              <Text>Loading...</Text>
            ) : (
              <>
                <View style={styles.driverStatusContainer}>
                  <Text style={styles.driverStatusText}>
                    Status: {driverStatus}
                  </Text>
                  <TouchableOpacity
                    onPress={refreshLocation}
                    style={styles.refreshButton}
                    disabled={
                      isLoading ||
                      (location?.latitude === prevLocation?.latitude &&
                        location?.longitude === prevLocation?.longitude)
                    }
                  >
                    <Text style={styles.refreshButtonText}>
                      {isLoading ? "Refreshing..." : "Refresh"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.infoText}>
                    Driver is at: {location?.latitude}, {location?.longitude}
                  </Text>
                </View>
              </>
            )}
          </View>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
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
  bottomSheetContent: {
    marginBottom:layout.pixelSizeVertical(280),
    padding: layout.pixelSizeVertical(20),
    backgroundColor: "#fff",
    height: "100%",
  },
  headerText: {
    fontSize: layout.fontPixel(20),
    fontWeight: "bold",
  },
  driverStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverStatusText: {
    fontSize: layout.fontPixel(16),
    color: "#333",
  },
  refreshButton: {
    paddingVertical: layout.pixelSizeVertical(8),
    paddingHorizontal: layout.pixelSizeHorizontal(15),
    backgroundColor: "#4CAF50",
    borderRadius: layout.widthPixel(5),
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  driverInfo: {
    backgroundColor: "#f0f0f0",
    padding: layout.pixelSizeVertical(15),
    borderRadius: layout.widthPixel(8),
  },
  infoText: {
    fontSize: layout.fontPixel(14),
    color: "#333",
  },
});
