import Button from "@/components/Button";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";


const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [surname, setSurname] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = () => {
        if (email === '' || password === '' || surname === '') {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        setIsLoading(true);

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // Ajouter le prénom
                updateProfile(user, { displayName: surname })
                    .then(() => {
                        alert('Inscription réussie ! Bienvenue, ' + user.displayName);
                        router.replace('/(tabs)');
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Erreur d\'inscription :', errorCode, errorMessage);
                // Gestion en fonction du code d'erreur
                if (errorCode === 'auth/email-already-in-use') {
                    alert('Cet email est déjà utilisé. Veuillez vous créer un compte avec un autre email.');
                } else if (errorCode === 'auth/invalid-email') {
                    alert('L\'email fourni est invalide. Veuillez vérifier le format de votre email.');
                } else if (errorCode === 'auth/weak-password') {
                    alert('Le mot de passe est trop faible. Veuillez choisir un mot de passe d\'au moins 6 caractères.');
                } 
                else {
                    alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
            

    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.titre}>Bienvenue</Text>
                <Text style={styles.text}>Créez votre compte</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Prénom</Text>
                    <TextInput style={styles.input} placeholder="Entrez votre prénom" value={surname} onChangeText={setSurname} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} placeholder="Entrez votre email" value={email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} onChangeText={setEmail} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput style={styles.input} placeholder="Entrez votre mot de passe" secureTextEntry value={password} autoCapitalize="none" autoCorrect={false} onChangeText={setPassword} />
                </View>
                <View style={{ alignItems: 'center'}}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 15 }} />
                    ) : (
                        <Button label="Créer votre compte" theme="primaryConnexion" onPress={handleSignUp} />
                    )}
                </View>
            </View>
            <View>
                <Text style={{ color: '#fff', marginTop: 20, textAlign: 'center'}}>Déjà un compte ?</Text>
                <Button label="Se connecter" onPress={() =>  router.push('/signIn')} />
                </View>
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
    }
});
    
export default SignUpScreen;
