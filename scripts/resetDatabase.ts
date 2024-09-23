import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetDatabase() {
  // Delete all documents in the 'games' collection
  const gamesCollection = collection(db, 'games');
  const gamesSnapshot = await getDocs(gamesCollection);
  const deletePromises = gamesSnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log('All games deleted');

  // Create the new aggregate stats document
  const stats = {
    Antoine: { totalGames: 249, totalWins: 77, totalSecondPlace: 81 },
    'Don Jon': { totalGames: 204, totalWins: 45, totalSecondPlace: 66 },
    Chadi: { totalGames: 208, totalWins: 59, totalSecondPlace: 67 },
    Jeff: { totalGames: 172, totalWins: 43, totalSecondPlace: 43 },
    Roudy: { totalGames: 51, totalWins: 10, totalSecondPlace: 16 },
    Roy: { totalGames: 20, totalWins: 1, totalSecondPlace: 6 },
    Mike: { totalGames: 21, totalWins: 1, totalSecondPlace: 6 },
    Mario: { totalGames: 7, totalWins: 1, totalSecondPlace: 0 },
    Nick: { totalGames: 91, totalWins: 26, totalSecondPlace: 29 }
  };

  await setDoc(doc(db, 'stats', 'aggregate'), { players: stats });
  console.log('Aggregate stats created');
}

resetDatabase().catch(console.error);