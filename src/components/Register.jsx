// src/components/Register.jsx
import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Register = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleRegister = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('User registered:', result.user);
      })
      .catch((error) => {
        console.error('Error registering:', error);
      });
  };

  return (
    <div>
      <button onClick={handleRegister}>Register with Google</button>
    </div>
  );
};

export default Register;
