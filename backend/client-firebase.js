// // client-firebase.js for Google sign-in
// const { initializeApp } = require('firebase/app');
// const { getAuth, GoogleAuthProvider, signInWithPopup } = require('firebase/auth');

// const firebaseConfig = {
//   apiKey: "AIzaSyBUrQJ5tnMCCJ6zITYgwp-FeanHQTo_QbA",
//   authDomain: "resume-e7d10.firebaseapp.com",
//   projectId: "resume-e7d10",
//   storageBucket: "resume-e7d10.firebasestorage.app",
//   messagingSenderId: "1054952519994",
//   appId: "1:1054952519994:web:3fe53401b33f73f9f57803"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();

// module.exports = { auth, provider };

// client-firebase.js for Google sign-in and Firebase authentication
const { initializeApp } = require('firebase/app');
const { getAuth, GoogleAuthProvider, signInWithPopup } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyBUrQJ5tnMCCJ6zITYgwp-FeanHQTo_QbA",
  authDomain: "resume-e7d10.firebaseapp.com",
  projectId: "resume-e7d10",
  storageBucket: "resume-e7d10.firebasestorage.app",
  messagingSenderId: "1054952519994",
  appId: "1:1054952519994:web:3fe53401b33f73f9f57803"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/**
 * Function to sign in with Google and get ID token
 */
async function signInWithGoogle() {
  try {
    // Sign in with popup using Google Auth provider
    const result = await signInWithPopup(auth, provider);

    // Get the signed-in user's info
    const user = result.user;

    // Get the ID token
    const idToken = await user.getIdToken();

    // Return the user info and ID token
    return { user, idToken };
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    throw error;
  }
}

// Export the sign-in function and necessary Firebase auth components
module.exports = { auth, provider, signInWithGoogle 