// import { createContext, useContext, useEffect, useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../firebase';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   function signUp(email, password, userType) {
//     localStorage.setItem("userType", userType); // store userType
//     return createUserWithEmailAndPassword(auth, email, password).then((res) => {
//       return { ...res.user, userType }; // return userType for redirection logic
//     });
//   }
  
//   function logIn(email, password, userType) {
//     localStorage.setItem("userType", userType); // store userType
//     return signInWithEmailAndPassword(auth, email, password).then((res) => {
//       return { ...res.user, userType }; // return userType for redirection
//     });
//   }
  
  
//   function logOut() {
//     return signOut(auth);
//   }

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ signUp, logIn, logOut, user, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }


// import { createContext, useContext, useEffect, useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../../backend/firebase.js';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   function signUp(email, password, userType) {
//     localStorage.setItem("userType", userType);
//     return createUserWithEmailAndPassword(auth, email, password).then((res) => {
//       return { ...res.user, userType };
//     });
//   }

//   function logIn(email, password, userType) {
//     localStorage.setItem("userType", userType);
//     return signInWithEmailAndPassword(auth, email, password).then((res) => {
//       return { ...res.user, userType };
//     });
//   }

//   function logOut() {
//     localStorage.removeItem("userType");
//     return signOut(auth);
//   }

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userType = localStorage.getItem("userType") || "candidate";
//         setCurrentUser({ ...user, userType });
//       } else {
//         setCurrentUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser, signUp, logIn, logOut, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// import { createContext, useContext, useEffect, useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
// import { initializeApp } from "firebase/app";  // Ensure this is correct
// import { firebaseConfig } from "../firebase";  // Make sure the firebaseConfig is correctly imported


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);


// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   function signUp(email, password, userType) {
//     localStorage.setItem("userType", userType);
//     return createUserWithEmailAndPassword(auth, email, password).then((res) => {
//       return { ...res.user, userType };
//     });
//   }

//   function logIn(email, password, userType) {
//     localStorage.setItem("userType", userType);
//     return signInWithEmailAndPassword(auth, email, password).then((res) => {
//       return { ...res.user, userType };
//     });
//   }

//   function logOut() {
//     localStorage.removeItem("userType");
//     return signOut(auth);
//   }

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userType = localStorage.getItem("userType") || "candidate";
//         setCurrentUser({ ...user, userType });
//       } else {
//         setCurrentUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser, signUp, logIn, logOut, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// import { createContext, useContext, useEffect, useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
// import { initializeApp } from 'firebase/app';  // Ensure this is correct
// import { firebaseConfig } from '../firebase';  // Make sure the firebaseConfig is correctly imported

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // Create context for managing authentication state
// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // New state for error messages

//   // SignUp function
//   function signUp(email, password, userType) {
//     localStorage.setItem('userType', userType);
//     return createUserWithEmailAndPassword(auth, email, password)
//       .then((res) => {
//         return { ...res.user, userType };
//       })
//       .catch((error) => {
//         console.error('Error signing up: ', error.message);
//         setError(error.message); // Set error message state
//         throw error; // Re-throw for component-level handling
//       });
//   }

//   // LogIn function
//   function logIn(email, password, userType) {
//     localStorage.setItem('userType', userType);
//     return signInWithEmailAndPassword(auth, email, password)
//       .then((res) => {
//         return { ...res.user, userType };
//       })
//       .catch((error) => {
//         console.error('Error logging in: ', error.message);
//         setError(error.message); // Set error message state
//         throw error; // Re-throw for component-level handling
//       });
//   }

//   // LogOut function
//   function logOut() {
//     localStorage.removeItem('userType');
//     return signOut(auth)
//       .catch((error) => {
//         console.error('Error logging out: ', error.message);
//         setError(error.message); // Set error message state
//         throw error;
//       });
//   }

//   // Auth state listener to manage current user
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       console.log('User state changed: ', user);  // Log user state change
//       if (user) {
//         const userType = localStorage.getItem('userType') || 'candidate';
//         setCurrentUser({ ...user, userType });
//       } else {
//         setCurrentUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe(); // Cleanup listener
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser, signUp, logIn, logOut, loading, error }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
import { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase'; // Adjust the path if needed

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Setup Google provider with prompt
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Sign-In Function
  async function signInWithGoogle(userType = 'candidate') {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      
      if (!user.email) {
        throw new Error('Email not returned from Google login.');
      }
      
      console.log('Google User:', user);
      console.log('Firebase Token:', token);
      
      // Store userType locally
      localStorage.setItem('userType', userType);
      
      // Send token to your backend - ensure parameter name matches what backend expects
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }), // Using 'token' as the key
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      console.log('Backend login successful:', data);
      
      // Enhance the user object with the backend user ID and other data
      const enhancedUser = {
        ...user,
        userType,
        id: data.user.id,
        role: data.user.role,
        dbName: data.user.name
      };
      
      setCurrentUser(enhancedUser);
      return enhancedUser;
    } catch (err) {
      console.error('Google Login Error:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Email/password SignUp with backend integration
  async function signUp(email, password, userType = 'candidate', name) {
    try {
      localStorage.setItem('userType', userType);
      
      // Create the user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      // Register user in your backend
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token,
          email,
          name,
          role: userType.toUpperCase() // If your backend expects uppercase enum values
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'User creation failed on backend');
      }
      
      // Enhance user with backend data
      const enhancedUser = {
        ...user,
        userType,
        id: data.user.id,
        role: data.user.role,
        dbName: name
      };
      
      setCurrentUser(enhancedUser);
      return enhancedUser;
    } catch (error) {
      console.error('Signup Error:', error.message);
      setError(error.message);
      
      // If Firebase account was created but backend failed, 
      // try to clean up the Firebase account
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await currentUser.delete();
        }
      } catch (deleteError) {
        console.error('Error deleting incomplete user:', deleteError);
      }
      
      throw error;
    }
  }

  // Email/password LogIn with backend integration
  async function logIn(email, password, userType = 'candidate') {
    try {
      localStorage.setItem('userType', userType);
      
      // Login with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      // Login to backend
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Backend login failed');
      }
      
      // Enhance user with backend data
      const enhancedUser = {
        ...user,
        userType,
        id: data.user.id,
        role: data.user.role,
        dbName: data.user.name
      };
      
      setCurrentUser(enhancedUser);
      return enhancedUser;
    } catch (error) {
      console.error('Login Error:', error.message);
      setError(error.message);
      throw error;
    }
  }

  // LogOut
  function logOut() {
    localStorage.removeItem('userType');
    setCurrentUser(null);
    return signOut(auth)
      .catch((error) => {
        console.error('Logout Error:', error.message);
        setError(error.message);
        throw error;
      });
  }

  // Auth state listener to fetch user data from backend when Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('User state changed:', user);
      
      if (user) {
        try {
          const userType = localStorage.getItem('userType') || 'candidate';
          const token = await user.getIdToken();
          
          // Get user data from backend on auth state change
          const response = await fetch(`http://localhost:5000/api/user/by-email/${user.email}`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const enhancedUser = {
              ...user,
              userType,
              id: data.id,
              role: data.role,
              dbName: data.name
            };
            setCurrentUser(enhancedUser);
          } else {
            // If backend fetch fails, still set user with Firebase data
            setCurrentUser({ ...user, userType });
          }
        } catch (error) {
          console.error('Error fetching user data from backend:', error);
          const userType = localStorage.getItem('userType') || 'candidate';
          setCurrentUser({ ...user, userType });
        }
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, signUp, logIn, logOut, signInWithGoogle, loading, error }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}