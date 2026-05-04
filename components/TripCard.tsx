import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';

type Trip = {
  id: string;
  destination: string;
  depart: string;
  date: { seconds: number };
  nbplacedispo: number;
  userId?: string;
};

type Props = {
  trip: Trip;
};

export default function TripCard({ trip }: Props) {
  const handleViewDetails = () => {
    router.push({
      pathname: '/tripDetails',
      params: {
        tripId: trip.id,
        destination: trip.destination,
        depart: trip.depart,
        date: trip.date.seconds.toString(),
        nbplacedispo: trip.nbplacedispo.toString(),
        userId: trip.userId || '',
      },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.destination}>Arrivée: {trip.destination}</Text>
        <Text style={styles.depart}>Départ: {trip.depart}</Text>
        <Text style={styles.date}>Le: {new Date(trip.date.seconds * 1000).toLocaleDateString()}</Text>
        <Text style={styles.seats}>Places disponibles: {trip.nbplacedispo}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          label="Voir plus"
          theme="primaryConnexion"
          onPress={handleViewDetails}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3a3f47',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    marginBottom: 12,
  },
  destination: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  depart: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 4,
  },
  seats: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});