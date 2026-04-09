import Button from "@/components/Button";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";


const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        if (email === '' || password === '') {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                alert('Connexion réussie ! Bienvenue, ' + user.email);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Erreur de connexion :', errorCode, errorMessage);
                alert('Erreur de connexion. Veuillez vérifier vos identifiants.' + '\nEmail: ' + email + '\nMot de passe: ' + password);
            });

    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.titre}>Connexion</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} placeholder="Entrez votre email" value={email} onChangeText={setEmail} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput style={styles.input} placeholder="Entrez votre mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
                </View>
                <View style={{ alignItems: 'center'}}>
                    <Button label="Se connecter" theme="primaryConnexion" onPress={handleSignIn} />
                </View>
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
        alignItems: 'center',
        justifyContent: 'center',

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
    
export default SignInScreen;
