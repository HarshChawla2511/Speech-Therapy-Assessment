import React, { useState } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { emailValidator } from '../helpers/emailValidator';

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });
console.log(`Sending OTP for email: ${email.value}`);
  const sendOTP = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    // Call your backend API to send OTP
    // Add this line before the fetch call


    fetch('http://192.168.197.55:3001/sendOTP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
      }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          // OTP sent successfully, navigate to OTP screen
          navigation.navigate('OTPScreen', { email: email.value });
        } else {
          console.error('Failed to send OTP');
          // Handle the case when OTP sending fails
        }
      })
      .catch(error => {
        console.error('Error sending OTP:', error);
        // Handle the error
      });
  };

  return (
    <Background>
      <Logo />
      <Header>Password Reset</Header>
      <TextInput
        label="Email"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <Button
        mode="contained"
        onPress={sendOTP}
        style={{ marginTop: 16 }}
      >
        Send OTP
      </Button>
    </Background>
  );
}
