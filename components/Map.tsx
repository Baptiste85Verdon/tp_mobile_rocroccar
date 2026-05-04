import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

type LatLng = {
  latitude: number;
  longitude: number;
};

type TripMapProps = {
  originAddress: string;
  destinationAddress: string;
  height?: number;
};

export default function TripMap({
  originAddress,
  destinationAddress,
  height = 250,
}: TripMapProps) {
  const mapRef = useRef<MapView | null>(null);
  const [originCoords, setOriginCoords] = useState<LatLng | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMapData = async () => {
      if (!originAddress || !destinationAddress) {
        setOriginCoords(null);
        setDestinationCoords(null);
        setRouteCoords([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission de localisation refusée.");
          return;
        }

        const originResults = await Location.geocodeAsync(originAddress);
        const destinationResults = await Location.geocodeAsync(destinationAddress);

        if (!originResults.length || !destinationResults.length) {
          setError("Adresse introuvable.");
          setRouteCoords([]);
          return;
        }

        const origin = {
          latitude: originResults[0].latitude,
          longitude: originResults[0].longitude,
        };

        const destination = {
          latitude: destinationResults[0].latitude,
          longitude: destinationResults[0].longitude,
        };

        setOriginCoords(origin);
        setDestinationCoords(destination);

        const response = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!,
              "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
            },
            body: JSON.stringify({
              origin: {
                location: {
                  latLng: {
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                  },
                },
              },
              destination: {
                location: {
                  latLng: {
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                  },
                },
              },
              travelMode: "DRIVE",
            }),
          }
        );

        const data = await response.json();
        const encoded = data?.routes?.[0]?.polyline?.encodedPolyline;

        if (!encoded) {
          setError("Aucun trajet trouvé.");
          setRouteCoords([]);
          return;
        }

        const decoded = decodePolyline(encoded);
        setRouteCoords(decoded);

        setTimeout(() => {
          mapRef.current?.fitToCoordinates([origin, ...decoded, destination], {
            edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
            animated: true,
          });
        }, 300);
      } catch (e) {
        setError("Impossible de charger la carte.");
        setRouteCoords([]);
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, [originAddress, destinationAddress]);

  const decodePolyline = (encoded: string): LatLng[] => {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates: LatLng[] = [];

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;
      let byte = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLat = (result & 1) ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLng = (result & 1) ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      coordinates.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return coordinates;
  };

  return (
    <View style={[styles.wrapper, { height }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 46.6702,
          longitude: -1.4265,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {originCoords && <Marker coordinate={originCoords} title="Départ" />}
        {destinationCoords && (
          <Marker coordinate={destinationCoords} title="Arrivée" />
        )}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="#2f80ed" />
        )}
      </MapView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color="#2f80ed" />
          <Text style={styles.overlayText}>Calcul du trajet...</Text>
        </View>
      )}

      {!!error && !loading && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 10,
    borderRadius: 10,
  },
  overlayText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 4,
  },
});