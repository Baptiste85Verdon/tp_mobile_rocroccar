import { db } from "@/config/firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, runTransaction, where } from "firebase/firestore";

// Fonction pour récuperer les trajets depuis Firestore
export async function getTrips() {
    try {
        const snapshot = await getDocs(collection(db, "trips"));
        const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return trips;
    } catch (error) {
        console.error("Error fetching trips: ", error);
        return [];
    }
}

// Fonction pour creer un nouveau trajet dans Firestore
export async function createTrip(tripData) {
    try {
        const docRef = await addDoc(collection(db, "trips"), tripData);
        return { id: docRef.id, ...tripData };
    } catch (error) {
        console.error("Error creating trip: ", error);
        throw error;
    }
}

// Fonction pour récupérer les trajets d'un utilisateur spécifique
export async function getUserTrips(userId) {
    try {
        const snapshot = await getDocs(query(collection(db, "trips"), where("userId", "==", userId)));
        const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return trips;
    } catch (error) {
        console.error("Error fetching user trips: ", error);
        return [];
    }
}

// Fonction pour récupérer dynamiquement les trajets ayant une date future en temps réel
export function getTripsInRealTime(callback) {
    const q = query(collection(db, "trips"), where("date", ">=", new Date()), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const tripsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(tripsData);
    });
    return unsubscribe;
}

// Fonction pour récupérer les trajets d'un utilisateur spécifique en temps réel
export function getUserTripsInRealTime(userId, callback) {
    const q = query(collection(db, "trips"), where("userId", "==" ,userId), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const tripsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(tripsData);
    }, (error) => {
        alert("Error fetching user trips in real time: " + error.message);
        console.error("Error in getUserTripsInRealTime: ", error);
    });
    return unsubscribe;
}

// Fonction pour supprimer un trajet
export async function deleteTrip(tripId) {
    try {        
        await deleteDoc(doc(db, "trips", tripId));
    } catch (error) {
        console.error("Error deleting trip: ", error);
        throw error;
    }
}

// Fonction pour soustraire une place disponible d'un trajet
export async function decrementAvailableSeats(tripId) {
    try {
        const trip = doc(db, "trips", tripId);
        await runTransaction(db, async (transaction) => {
            const tripDoc = await transaction.get(trip);
            if (!tripDoc.exists()) {
                throw new Error("Trip does not exist!");
            }
            const currentAvailableSeats = tripDoc.data().nbplacedispo;
            if (currentAvailableSeats > 0) {
                transaction.update(trip, { nbplacedispo: currentAvailableSeats - 1 });
            } else {
                throw new Error("No available seats!");
            }
        });
    } catch (error) {
        console.error("Error decrementing available seats: ", error);
        throw error;
    }
}