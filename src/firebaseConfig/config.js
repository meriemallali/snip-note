import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// For Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyCABO-iJb_G1A5uMCdT1Z2ZAvO-08wkkS8",
  authDomain: "snipnote-82c08.firebaseapp.com",
  projectId: "snipnote-82c08",
  storageBucket: "snipnote-82c08.appspot.com",
  messagingSenderId: "690282364519",
  appId: "1:690282364519:web:2519902f6f19e9d38f5ec2",
  measurementId: "G-M2X9JR3GVB",
};

// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };
