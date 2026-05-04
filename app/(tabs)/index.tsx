import TripCard from '@/components/TripCard';
import { getTripsInRealTime } from "@/services/tripsService";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TripsScreen() {
  const [trips, setTrips] = useState<any[]>([]);

 useEffect(() => {
    const unsubscribe = getTripsInRealTime(setTrips);
    return unsubscribe;
 }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Trajets disponibles à partir de demain: </Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripCard trip={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingTop: 20,
  },
    titre: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',

    },
});