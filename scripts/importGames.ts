const { readFileSync } = require('fs');
const { parse } = require('csv-parse/sync');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const { config } = require('dotenv');

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

function normalizePlayerName(name: string): string {
  const normalized = name.trim().toLowerCase()
  const playerMap: {[key: string]: string} = {
    'antoine': 'Antoine',
    'don jon': 'Don Jon',
    'chadi': 'Chadi',
    'jeff': 'Jeff',
    'roudy': 'Roudy',
    'roy': 'Roy',
    'mike': 'Mike',
    'mario': 'Mario',
    'nick': 'Nick'
  }
  return playerMap[normalized] || name
}

async function importGames() {
  const fileContent = readFileSync('stats.csv', 'utf-8');
  const records = parse(fileContent, { columns: true, skip_empty_lines: true });

  const playerNames = Object.keys(records[0]).map(normalizePlayerName);

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    try {
      const players = playerNames.filter(player => record[player] !== '').map(normalizePlayerName);
      const winner = normalizePlayerName(playerNames.find(player => record[player] === '1') || '');
      const secondPlaces = playerNames.filter(player => record[player] === '2').map(normalizePlayerName);

      if (!winner) {
        console.error('Invalid game data (no winner):', record);
        continue;
      }

      const game = {
        date: new Date(2023, 0, i + 1).toISOString(), // Using row number as a proxy for date
        players,
        winner,
        secondPlaces,
      };

      await addDoc(collection(db, 'games'), game);
      console.log(`Added game: ${game.date}`);
    } catch (error) {
      console.error('Error adding game:', error);
    }
  }

  console.log('Import completed');
}

importGames().catch(console.error);