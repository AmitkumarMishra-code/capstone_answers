import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCBOzQ0E55giCPZCPmxIxIHL3s3VeX5uYo",
    authDomain: "capstone-answers.firebaseapp.com",
    projectId: "capstone-answers",
    storageBucket: "capstone-answers.appspot.com",
    messagingSenderId: "240860523431",
    appId: "1:240860523431:web:12dac5fd156b4f33572482"
};

firebase.initializeApp(firebaseConfig)

export default firebase