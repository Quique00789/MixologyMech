//Componente usado para hacer pruebas sin uso actualmente...

import React, { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../firebaseConfig';

function UpdateFirebase() {
  const [drinkName, setDrinkName] = useState('');
  const [newConsumption, setNewConsumption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdate = async () => {
    if (!drinkName || !newConsumption) {
      setErrorMessage('Please fill in both fields.');
      return;
    }

    const dbRef = ref(database, `machineData/documentId/drinkConsumption/${drinkName}`);

    try {
      await update(dbRef, { consumption: newConsumption });
      setSuccessMessage('Update successful!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error updating data.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="update-container">
      <h2>Update Drink Consumption</h2>
      <div className="input-group">
        <label>Drink Name:</label>
        <input 
          type="text" 
          value={drinkName} 
          onChange={(e) => setDrinkName(e.target.value)} 
        />
      </div>
      <div className="input-group">
        <label>New Consumption:</label>
        <input 
          type="text" 
          value={newConsumption} 
          onChange={(e) => setNewConsumption(e.target.value)} 
        />
      </div>
      <button onClick={handleUpdate}>Update</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default UpdateFirebase;
