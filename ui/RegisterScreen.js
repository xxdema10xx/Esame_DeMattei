import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AppButton from './AppButton';
import { REGISTER_URL } from '../config';

// messaggi corrispondenti agli errorCode restituiti da register.php
const ERROR_MESSAGES = {
  '1': 'Compila tutti i campi',
  '2': 'Username già in uso',
  '3': 'Le password non coincidono',
  '4': 'Username troppo lungo (massimo 30 caratteri)',
};

// schermata di registrazione: onRegistered = registrazione riuscita, onBackToLogin = torna al login
export default function RegisterScreen({ onRegistered, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  function handleRegister() {
    // se manca qualcosa non chiamo nemmeno l'api
    if (!username || !password || !password2) {
      Alert.alert(ERROR_MESSAGES['1']);
      return;
    }
    axios
      .post(REGISTER_URL, { username: username, password: password, password2: password2 })
      .then((response) => {
        const errorCode = response.data.errorCode;
        if (!errorCode) {
          // registrazione andata bene: torno al login
          Alert.alert('Registrazione completata, ora puoi accedere');
          onRegistered();
        } else {
          Alert.alert(ERROR_MESSAGES[errorCode] || 'Errore durante la registrazione');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Impossibile contattare il server');
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Esame DeMattei</Text>
      <Text style={styles.subtitle}>Crea un nuovo account</Text>
      <View style={styles.box}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
          maxLength={30}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#6B7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Ripeti password"
          placeholderTextColor="#6B7280"
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
          style={styles.input}
        />
        <AppButton title="Registrati" onPress={handleRegister} />
        <AppButton title="Hai già un account? Accedi" variant="text" onPress={onBackToLogin} style={styles.link} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F8' },
  title: { fontSize: 32, fontWeight: '800', color: '#4F46E5' },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24 },
  box: {
    width: '85%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    backgroundColor: '#F3F4F8',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: '#1F2937',
  },
  link: { marginTop: 8 },
});
