import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { View, ActivityIndicator } from 'react-native';
import { USER_INFO_URL } from './config';
import HomeScreen from './ui/HomeScreen';
import LoginScreen from './ui/LoginScreen';
import RegisterScreen from './ui/RegisterScreen';

// salvo un valore nella memoria sicura del telefono
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

// leggo un valore dalla memoria sicura, se non c'è restituisce null
async function getValueFor(key) {
  return await SecureStore.getItemAsync(key);
}

export default function App() {
  // se token è null l'utente non è autenticato
  const [token, setToken] = useState(null);
  // quando non c'è token, decido se mostrare il login o la registrazione
  const [authScreen, setAuthScreen] = useState('login');

  // finché controllo il token salvato mostro uno spinner, così la home non compare con un token scaduto
  const [checking, setChecking] = useState(true);

  // all'avvio leggo il token salvato (se c'è) e chiedo a user_info.php se è ancora valido, [] = eseguimi solo una volta
  useEffect(() => {
    async function checkToken() {
      const saved = await getValueFor('token');
      if (saved) {
        try {
          await axios.get(USER_INFO_URL, {
            headers: { Authorization: 'Bearer ' + saved },
          });
          setToken(saved);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // 401 = token scaduto o non valido: lo cancello dal secure store e resto al login
            await SecureStore.deleteItemAsync('token');
          } else {
            // altro errore (es. rete assente): tengo il token, ci penserà la home
            setToken(saved);
          }
        }
      }
      setChecking(false);
    }
    checkToken();
  }, []);

  // login andato bene: salvo il token e lo metto nello stato, così App mostra la home
  async function handleLogin(newToken) {
    await save('token', newToken);
    setToken(newToken);
  }

  // cancello il token salvato e torno al login
  async function handleLogout() {
    await SecureStore.deleteItemAsync('token');
    setAuthScreen('login');
    setToken(null);
  }

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#4F46E5" />
      </View>
    );
  }

  if (token) {
    return <HomeScreen token={token} onLogout={handleLogout} />;
  } else if (authScreen === 'register') {
    return (
      <RegisterScreen
        onRegistered={() => setAuthScreen('login')}
        onBackToLogin={() => setAuthScreen('login')}
      />
    );
  } else {
    return <LoginScreen onLogin={handleLogin} onGoToRegister={() => setAuthScreen('register')} />;
  }
}
