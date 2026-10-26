// indirizzo della cartella API sul server (Laragon)
// cambia solo questa riga quando cambi rete/PC: usa l'IP del PC (ipconfig) e non "localhost",
// perché il telefono con Expo Go non vede il "localhost" del computer
// Windows (Laragon, PC casa)
// export const API_URL = 'http://192.168.1.38/Esame_DeMattei/API';
// Windows (Laragon, scuola)
export const API_URL = 'http://10.10.53.243/Esame_DeMattei/API';

export const LOGIN_URL = API_URL + '/login.php';
export const REGISTER_URL = API_URL + '/register.php';
export const USER_INFO_URL = API_URL + '/user_info.php';
