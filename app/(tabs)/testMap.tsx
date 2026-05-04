import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!;

if (!apiKey) {
  throw new Error('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY est manquante');
}

type LatLng = {
  latitude: number;
  longitude: number;
};

export default function App() {
  const mapRef = useRef<MapView | null>(null);

  const origin: LatLng = { latitude: 46.6702, longitude: -1.4265 };
  const destination: LatLng = { latitude: 46.817, longitude: -1.278 };

  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoute();
  }, []);

  const fetchRoute = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
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
            travelMode: 'DRIVE',
          }),
        }
      );

      const data = await response.json();

      const encoded = data?.routes?.[0]?.polyline?.encodedPolyline;

      if (!encoded) {
        setError('Aucun trajet trouvé.');
        return;
      }

      const decoded = decodePolyline(encoded);
      setRouteCoords(decoded);

      setTimeout(() => {
        if (mapRef.current && decoded.length > 0) {
          mapRef.current.fitToCoordinates([origin, ...decoded, destination], {
            edgePadding: { top: 80, right: 50, bottom: 80, left: 50 },
            animated: true,
          });
        }
      }, 500);
    } catch (e) {
      setError("Erreur lors de la récupération de l'itinéraire.");
    } finally {
      setLoading(false);
    }
  };

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
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: (origin.latitude + destination.latitude) / 2,
          longitude: (origin.longitude + destination.longitude) / 2,
          latitudeDelta: Math.abs(origin.latitude - destination.latitude) + 0.2,
          longitudeDelta: Math.abs(origin.longitude - destination.longitude) + 0.2,
        }}
      >
        <Marker coordinate={origin} title="Point A" />
        <Marker coordinate={destination} title="Point B" />

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
      </MapView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Chargement du trajet...</Text>
        </View>
      )}

      {!!error && (
        <View style={styles.overlay}>
          <Text>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});