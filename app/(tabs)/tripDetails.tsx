import Button from "@/components/Button";
import Map from "@/components/Map";
import { decrementAvailableSeats, getTripReservations } from "@/services/tripsService";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TripDetailsScreen() {
  const { tripId, destination, depart, date, nbplacedispo, userId } = useLocalSearchParams();
  const [isBooking, setIsBooking] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  
  const currentUserId = getAuth().currentUser?.uid;
  const isOwner = currentUserId === userId;

  useEffect(() => {
    if (isOwner && tripId) {
      loadReservations();
    }
  }, [isOwner, tripId]);

  const loadReservations = async () => {
    try {
      const tripReservations = await getTripReservations(tripId as string);
      setReservations(tripReservations);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    }
  };

  const handleBookTrip = async (tripId: string) => {
    if (isBooking) return; // Empêcher les doubles clics

    setIsBooking(true);
    try {
      await decrementAvailableSeats(tripId);
      // Afficher une notification de succès
      Alert.alert(
        "Réservation confirmée",
        "Votre place a été réservée avec succès !",
        [
          {
            text: "OK",
            onPress: () => router.push('/')
          }
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la réservation. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.detailsContainer}>
        <Text style={styles.titre}>Détails du trajet</Text>
        <Text style={styles.text}>Arrivée: {destination}</Text>
        <Text style={styles.text}>Départ: {depart}</Text>
        <Text style={styles.text}>Le: {new Date(parseInt(date as string) * 1000).toLocaleDateString()}</Text>
        <Text style={styles.text}>Places disponibles: {nbplacedispo}</Text>
      </View>
      
      <View style={styles.mapContainer}>
        <Text style={styles.mapLabel}>Aperçu du trajet</Text>
        <Map
          originAddress={depart as string}
          destinationAddress={destination as string}
          height={400}
        />
      </View>
      
      {isOwner && reservations.length > 0 && (
        <View style={styles.reservationsContainer}>
          <Text style={styles.reservationsTitle}>Personnes ayant réservé :</Text>
          {reservations.map((reservation, index) => (
            <View key={reservation.id} style={styles.reservationItem}>
              <Text style={styles.reservationText}>
                {index + 1}. {reservation.userName} ({reservation.userEmail})
              </Text>
              <Text style={styles.reservationDate}>
                Réservé le: {new Date(reservation.reservationDate.seconds * 1000).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        {!isOwner && (
          <Button 
            label={isBooking ? "Réservation en cours..." : "Réserver"} 
            theme="primaryConnexion" 
            onPress={() => handleBookTrip(tripId as string)}
          />
        )}
        {isOwner && (
          <Text style={styles.ownerText}>Vous êtes le propriétaire de ce trajet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  detailsContainer: {
    width: '90%',
    marginBottom: 20,
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
    marginBottom: 10,
    textAlign: 'center'
  },
  mapContainer: {
    width: '90%',
    marginBottom: 20,
  },
  mapLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  ownerText: {
    color: '#ffd33d',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reservationsContainer: {
    width: '90%',
    marginBottom: 20,
    backgroundColor: '#3a3f47',
    borderRadius: 12,
    padding: 16,
  },
  reservationsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  reservationItem: {
    backgroundColor: '#2a2f37',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  reservationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reservationDate: {
    color: '#ddd',
    fontSize: 14,
  },
});