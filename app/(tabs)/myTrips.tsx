import TripCard from '@/components/TripCard';
import { getUserTripsInRealTime } from "@/services/tripsService";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";


export default function MyTripsScreen() {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getUserTripsInRealTime(getAuth().currentUser?.uid, setTrips);
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Mes trajets :</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
    titre: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',

    },
    text: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
});