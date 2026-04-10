import IconButton from '@/components/IconButton';
import { deleteTrip, getUserTripsInRealTime } from "@/services/tripsService";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";


export default function TripsScreen() {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getUserTripsInRealTime(getAuth().currentUser?.uid, setTrips);
    return unsubscribe;
  }, []);
 
  const handleDeleteTrip = (tripId: string) => {
    deleteTrip(tripId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Mes trajets :</Text>
      <Text style={styles.titre}>Mon id : {getAuth().currentUser?.uid}</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          console.log(item),
          <View>
            <Text style={styles.text}>Destination: {item.destination}</Text>
            <Text style={styles.text}>Départ: {item.depart}</Text>
            <Text style={styles.text}>Date: {new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
            <Text style={styles.text}>Nombre de places disponibles: {item.nbplace}</Text>
            <IconButton icon='cancel' label='Annuler' onPress={() => handleDeleteTrip(item.id)} color='#ff0000'/>            
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