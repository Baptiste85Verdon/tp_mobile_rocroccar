import IconButton from '@/components/IconButton';
import { decrementAvailableSeats, getTripsInRealTime } from "@/services/tripsService";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TripsScreen() {
  const [trips, setTrips] = useState<any[]>([]);

 useEffect(() => {
    const unsubscribe = getTripsInRealTime(setTrips);
    return unsubscribe;
 }, []);

   const handleBookTrip = (tripId: string) => {
     decrementAvailableSeats(tripId);
   };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Trajets créés :</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          console.log(item),
          <View>
            <Text style={styles.text}>Destination: {item.destination}</Text>
            <Text style={styles.text}>Départ: {item.depart}</Text>
            <Text style={styles.text}>Date: {new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
            <Text style={styles.text}>Nombre de places disponibles: {item.nbplacedispo}</Text>
            <IconButton icon='check' label='Réserver' onPress={() => handleBookTrip(item.id)} color='#00ff62'/>            
          </View>
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