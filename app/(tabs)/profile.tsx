import Button from "@/components/Button";
import { getAuth, signOut } from "firebase/auth";
import { StyleSheet, Text, View } from "react-native";


export default function ProfileScreen() {
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Profile screen de :</Text>
      <Text style={styles.text}>Prénom : {auth.currentUser?.displayName}</Text>
      <Text style={styles.text}>Email : {auth.currentUser?.email}</Text>
      <Button label="Déconnexion" theme="secondary" onPress={handleSignOut} />
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