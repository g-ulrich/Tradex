import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TSEndpoints from './endpoints';

const tsEndpoints = new TSEndpoints();

var SECURITY_QUESTIONS	= [
	{question: 'What was the name of your first boyfriend or girlfriend?', answer: 'corrinne'},
	{question: 'What is the name of your first pet?', answer: 'rocky'},
	{question: 'What was the make or model of your first car?', answer: 'honda'}
];


 export const authorize = async () => {
   // Redirect the user to the authUrl
   // This step is usually done in the backend and then redirected to the frontend
 };

 export const getToken = async (clientId, clientSecret, authorizationCode) => {
    try {
      const response = await axios.post(tsEndpoints.tokenBaseURL, null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          redirect_uri: tsEndpoints.callbackURL,
        },
      });
  
      // Output the response data
      console.log('Token Response:', response.data);
  
      return response.data;
    } catch (error) {
      console.error('Error getting token:', error.message);
      throw error;
    }
  }
  