import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';

// Substitua os valores abaixo pelos dados de Configuração do app Web no Firebase Console.
const firebaseConfig = {
  apiKey: 'COLE_SUA_API_KEY',
  authDomain: 'SEU_PROJETO.firebaseapp.com',
  projectId: 'SEU_PROJETO',
  storageBucket: 'SEU_PROJETO.firebasestorage.app',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: 'SEU_APP_ID'
};

const configured = !Object.values(firebaseConfig).some(value => value.startsWith('COLE_') || value.startsWith('SEU_'));
if (configured) {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    await signInAnonymously(auth);
    window.firebaseRanking = {
      enabled: true,
      subscribe(callback) {
        const rankingQuery = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(8));
        return onSnapshot(rankingQuery, snapshot => {
          callback(snapshot.docs.map(doc => [doc.data().playerName, doc.data().score]));
        }, error => console.warn('Ranking global indisponível:', error));
      },
      async submit(playerName, score) {
        await addDoc(collection(db, 'scores'), {
          playerName: playerName.slice(0, 24),
          score: Math.max(0, Math.min(5000, Math.round(score))),
          createdAt: serverTimestamp()
        });
      }
    };
  } catch (error) {
    console.warn('Firebase não configurado ou indisponível; usando ranking local.', error);
  }
}
window.dispatchEvent(new Event('firebase-ready'));
