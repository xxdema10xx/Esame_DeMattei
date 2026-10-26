import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AppButton from './AppButton';
import { USER_INFO_URL } from '../config';

// schermata principale: token = serve per chiamare l'api, onLogout = funzione per uscire
export default function HomeScreen({ token, onLogout }) {
  // chi sono io: li riempie user_info.php appena si entra
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  // chiedo a user_info.php chi sono (username e ruolo)
  async function loadUser() {
    try {
      const response = await axios.get(USER_INFO_URL, {
        headers: { Authorization: 'Bearer ' + token },
      });
      setUsername(response.data.username);
      setRole(response.data.role);
    } catch (error) {
      // 401 = token scaduto o non valido: esco e torno al login
      if (error.response && error.response.status === 401) {
        onLogout();
        return;
      }
      console.error("Errore durante il caricamento dell'utente:", error);
    } finally {
      setLoading(false);
    }
  }

  // appena si entra in HomeScreen (subito dopo il login) carico chi sono
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <AppButton title="Logout" variant="outline" onPress={onLogout} />
      </View>

      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator color="#4F46E5" />
        ) : (
          <>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{username}</Text>
            <Text style={styles.label}>Ruolo</Text>
            <Text style={styles.value}>{role}</Text>
          </>
        )}
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F8', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#4F46E5' },
  card: {
    marginTop: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 13, color: '#6B7280', marginTop: 8 },
  value: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
});
