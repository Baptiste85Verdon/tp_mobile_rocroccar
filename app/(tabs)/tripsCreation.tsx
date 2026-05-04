import Button from "@/components/Button";
import Map from "@/components/Map";
import { createTrip } from "@/services/tripsService";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function TripsCreationScreen() {
    const [destination, setDestination] = useState('');
    const [depart, setDepart] = useState('');
    const [date, setDate] = useState(new Date());
    const [nbplace, setNbPlace] = useState(4);
    const [isLoading, setIsLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [selectedOption, setSelectedOption] = useState('Destination');
    const options = ['Destination', 'Départ'];
    
    const ADRESSE_CAMPUS = "Lycée Campus Notre Dame du ROC";

    const currentOrigin =
    selectedOption === "Destination" ? depart : ADRESSE_CAMPUS;

    const currentDestination =
    selectedOption === "Destination" ? ADRESSE_CAMPUS : destination;

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleCreateTrip = () => {
      let tripData: { destination: string; depart: string; date: Date; nbplace: number; nbplacedispo: number; createdAt: any; userId: string | undefined } = {
          destination: '',
          depart: '',
          date,
          nbplace,
          nbplacedispo: nbplace,
          createdAt: serverTimestamp(),
          userId: getAuth().currentUser?.uid,
      };

      if (selectedOption === 'Départ') {
        tripData.depart = 'Lycée Campus Notre Dame du ROC';
        tripData.destination = destination;
        if (destination === '') {
            alert('Champs manquants: Destination');
            return;
        }
      } else {
        tripData.destination = 'Lycée Campus Notre Dame du ROC';
        tripData.depart = depart;
        if (depart === '') {
            alert('Champs manquants: Départ');
            return;
        }
      }
      
      setIsLoading(true);

      createTrip(tripData)
      .then(() => {
          setDestination('');
          setDepart('');
          setDate(new Date());
          setNbPlace(4);
          alert('Trajet créé avec succès !');
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Error creating trip: ", error);
          // Gestion en fonction du code d'erreur
          if (errorCode === 'permission-denied') {
              alert('Vous n\'avez pas la permission de créer un trajet. Veuillez réessayer plus tard.');
          } else {
              alert('Une erreur est survenue lors de la création du trajet. Veuillez réessayer plus tard.');
          }
      })
      .finally(() => {
          setIsLoading(false);
      });
    }

return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.form}>
              <Text style={styles.titre}>Créer un trajet</Text>
              <Text style={styles.text}>Veuillez remplir les informations du trajet</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Le lycée Campus Notre Dame du ROC sera votre :</Text>
                {options.map(label => (
                    <TouchableOpacity
                        key={label}
                        style={styles.radioOption}
                        onPress={() => setSelectedOption(label)}
                    >
                        <View style={[styles.radioCircle, selectedOption === label && styles.radioSelected]} />
                        <Text style={styles.radioLabel}>{label}</Text>
                    </TouchableOpacity>
                ))}
              </View>
              
              {selectedOption === 'Destination' ? (
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Départ</Text>
                    <TextInput style={styles.input} placeholder="Entrez le lieu de départ" value={depart} onChangeText={setDepart} />
                </View>
              ) : (
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Destination</Text>
                    <TextInput style={styles.input} placeholder="Entrez la destination" value={destination} onChangeText={setDestination} />
                </View>
              )}
              <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date</Text>
                  <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                      <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                      <DateTimePicker
                          value={date}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                      />
                  )}
              </View>
              <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nombre de places disponibles</Text>
                  <TextInput style={styles.input} placeholder="Entrez le nombre de places" value={nbplace.toString()} onChangeText={(text) => setNbPlace(Number(text))} keyboardType="numeric" />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Aperçu du trajet</Text>
                <Map
                    originAddress={currentOrigin}
                    destinationAddress={currentDestination}
                    height={260}
                />
              </View>
              <View style={{ alignItems: 'center'}}>
                  {isLoading ? (
                      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 15 }} />
                  ) : (
                      <Button label="Créer le trajet" theme="primaryConnexion" onPress={handleCreateTrip} />
                  )}
              </View>
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
        marginBottom: 20,
        textAlign: 'center'
    },
    label: {
        color: '#fff',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        borderWidth: 1,
        borderColor: '#555',
        padding: 10,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 10,
    },
    form: {
        width: '80%',
        padding: 20,
        backgroundColor: '#333',
        borderRadius: 10,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        marginRight: 10,
    },
    radioSelected: {
        backgroundColor: '#fff',
    },
    radioLabel: {
        color: '#fff',
    },
    inputText: {
        color: '#fff',
        fontSize: 16,
    },
});