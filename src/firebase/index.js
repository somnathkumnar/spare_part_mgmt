import firebase from "firebase/app";
import firebaseConfig from './config'
import "firebase/database";

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

export default database