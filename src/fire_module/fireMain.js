// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use (사용하고 싶은 모듈 import 하기)
import "firebase/auth";
import "firebase/firestore";

// For Firebase JS SDK Import
import fireSDK from "./fireSDK";

const firebaseConfig = fireSDK;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const authService = firebase.auth();
