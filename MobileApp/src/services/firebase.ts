import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDuFxuwRRT4R-7MbDKiGAi_N-6qHwKEIbk',
  authDomain: 'calculator-a0155.firebaseapp.com',
  projectId: 'calculator-a0155',
  storageBucket: 'calculator-a0155.firebasestorage.app',
  messagingSenderId: '1050592156468',
  appId: '1:1050592156468:web:0c7a0bc3d43542aab92361',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Long polling is more reliable than websockets on many Android networks
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
});