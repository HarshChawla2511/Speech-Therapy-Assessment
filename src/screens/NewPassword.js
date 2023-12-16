// NewPassword.js

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';

export default function NewPassword({ route, navigation }) {
    console.log(route.params);
  // Fetch the email parameter from route.params
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSavePressed = () => {
    // Validate if new password and confirm password match
    if (newPassword !== confirmPassword) {
      console.error('Passwords do not match');
      // Handle the error (show an alert or update state to display an error message)
      return;
    }

    // Make a POST request to update the password in the backend
    fetch('http://192.168.197.55:3001/updatePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email, // Include the email field
        newPassword,
      }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          // Password updated successfully, navigate to a success screen or login
          navigation.navigate('LoginScreen'); // Navigate to the login screen, for example
        } else {
          // Handle the case where the password update was not successful
          console.error('Error updating password');
        }
      })
      .catch(error => {
        console.error('Error updating password:', error);
        // Handle the error
      });
  };

  // Print email to console
  console.log('Email:', email);

  return (
    <Background>
      <Logo />
      <Header>Create New Password</Header>
      <TextInput
        label="New Password"
        returnKeyType="next"
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
        secureTextEntry
      />
      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSavePressed}
        style={{ marginTop: 24 }}
      >
        Save Password
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  // Add any styles you need
});
