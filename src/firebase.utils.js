import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';


var config = {
    apiKey: "AIzaSyDEH26ZXGlOskHe_Gd2lHcjmVipwgtwv3g",
    authDomain: "image-video-react.firebaseapp.com",
    databaseURL: "https://image-video-react-default-rtdb.firebaseio.com",
    projectId: "image-video-react",
    storageBucket: "image-video-react.appspot.com",
    messagingSenderId: "424298323162",
    appId: "1:424298323162:web:66640a0790a9e3606019e3",
    measurementId: "G-Y6GJFGTRTT"
};

export const app = firebase.initializeApp(config);