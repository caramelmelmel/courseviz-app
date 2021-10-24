import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, browserSessionPersistence } from "firebase/auth";

// firebase
const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

auth.setPersistence(browserSessionPersistence);

if (process.env.REACT_APP_FIREBASE_MODE == "mock") {
    connectAuthEmulator(auth, "http://localhost:9099");
}

export {
    app,
    auth,
};
