import Button from "@/components/Button";
import { router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = () => {
        if (email === '' || password === '') {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        setIsLoading(true);

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                router.replace('/(tabs)');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Erreur de connexion :', errorCode, errorMessage);
                // Gestion en fonction du code d'erreur
                if (errorCode === 'auth/user-not-found') {
                    alert('Aucun compte trouvé avec cet email. Veuillez vérifier votre email ou créer un compte.');
                } else {
                    alert('Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });

    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.titre}>Bienvenue à nouveau</Text>
                <Text style={styles.text}>Veuillez vous connecter à votre compte</Text>
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
                        <Button label="Se connecter" theme="primaryConnexion" onPress={handleSignIn} />
                    )}
                </View>
            </View>
            <View>
                <Text style={{ color: '#fff', marginTop: 20, textAlign: 'center'}}>Pas de compte ?</Text>
                <Button label="Créer un compte" onPress={() =>  router.push('/signUp')} />
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
    
export default SignInScreen;
