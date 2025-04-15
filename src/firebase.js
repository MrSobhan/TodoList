import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc  ,updateDoc} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD3uKUdhO5DIguJAPvhTmOw5XY0UCUh7s4",
    authDomain: "todolist-legend.firebaseapp.com",
    projectId: "todolist-legend",
    storageBucket: "todolist-legend.firebasestorage.app",
    messagingSenderId: "259255052583",
    appId: "1:259255052583:web:4a0e10e4cb2b60c2be2102",
    measurementId: "G-R8SJ0V898H"
  };

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db, collection, addDoc, getDocs, deleteDoc, doc ,updateDoc }
