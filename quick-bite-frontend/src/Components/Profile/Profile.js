import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const userName = localStorage.getItem('username');

    if (!userName) {
        setError('Username is not found. Please log in again.');
        return;
      }

    axios
    .get(`http://localhost:8080/api/users/username/${userName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => { 
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile details:', error);
        setError('Failed to fetch profile details. Please check your credentials or try again.');
      });
  }, []);

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {error && <p>{error}</p>}

      {userDetails ? (
        <div className="profile-details">
        <p><strong>ID:</strong> {userDetails.id}</p>
        <p><strong>Username:</strong> {userDetails.userName}</p>
        <p><strong>Name:</strong> {userDetails.firstName}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Phone Number:</strong> {userDetails.phoneNumber}</p>
        <p><strong>Role:</strong> {userDetails.role}</p>
        </div>
      ) : (
        <p>Loading your profile...</p>
      )}
    </div>
  );
};

export default Profile;
