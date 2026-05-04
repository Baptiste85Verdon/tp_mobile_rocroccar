import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function App() {
  const [coords, setCoords] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : coords ? (
        <Text>
          Latitude: {coords.latitude} - Longitude: {coords.longitude}
        </Text>
      ) : (
        <Text>Chargement...</Text>
      )}
    </View>
  );
}