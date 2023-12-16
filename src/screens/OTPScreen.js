// OTPScreen.js

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';

export default function OTPScreen({ route, navigation }) {
  const { email } = route.params;
  console.log(`Email = ${email}`)
  const [otp, setOtp] = useState('');
console.log('Checking OTP for email:');
  

const onSubmitPressed = () => {
  // Fetch the stored OTP from the patient table
  fetch('http://192.168.197.55:3001/checkOTP', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      enteredOTP: otp,
    }),
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        // Valid OTP, navigate to the NewPassword screen
        navigation.navigate('NewPassword', { email }); // Pass email directly
        console.log(`passed ${email}`);
      } else {
        // Invalid OTP, navigate to the ResetPasswordScreen
        navigation.navigate('ResetPasswordScreen');
      }
    })
    .catch(error => {
      console.error('Error checking OTP:', error);
      // Handle the error
    });
};


  return (
    <Background>
      <Logo />
      <Header>Enter OTP</Header>
      <TextInput
        label="OTP"
        returnKeyType="done"
        value={otp}
        onChangeText={(text) => setOtp(text)}
        keyboardType="numeric"
        maxLength={6}
      />
      <Button
        mode="contained"
        onPress={onSubmitPressed}
        style={{ marginTop: 24 }}
      >
        Submit
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
