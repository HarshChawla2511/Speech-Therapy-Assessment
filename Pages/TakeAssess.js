import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const TakeAssess = ({ route }) => {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const uid = route.params.uid;

  const onSubmit = () => {
    const trimmedCode = code.trim();
    console.log('UID:', uid);
    console.log('Entered Code:', trimmedCode);
    if (uid.toString() === trimmedCode) {
      navigation.navigate('Quiz', { uid: uid });
    } else {
      Alert.alert('Incorrect code');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Assessment</Text>
      <TextInput
        style={{ marginBottom: 20, width: '100%' }}
        label="Enter your code"
        value={code}
        onChangeText={(text) => setCode(text)}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#90EE90',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
        }}
        onPress={onSubmit}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Play Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TakeAssess;