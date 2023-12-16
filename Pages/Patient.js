import React, { useState, useEffect } from 'react';
import { LogBox, Alert, StyleSheet, ScrollView } from 'react-native';
import { NativeBaseProvider, VStack, Text, Box } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'native-base';
import { useRoute } from '@react-navigation/native';

function Patient({ navigation }) {
  const route = useRoute();
  const patientId = route.params.patientId;
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [patientDetails2, setPatientDetails2] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);

  LogBox.ignoreLogs(['EventEmitter.removeListener']);

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(`http://192.168.197.55:3001/learns2/${patientId}`);
      const learns = await response.json();
      setPatientDetails(learns);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const fetchPatientDetails2 = async () => {
    try {
      const response = await fetch(`http://192.168.197.55:3001/patients/${patientId}`);
      const data = await response.json();
      setPatientDetails2(data);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
    fetchPatientDetails2();
  }, []);

  const notifyAssessment = async () => {
    try {
      const response = await fetch('http://192.168.197.55:3001/patients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientID: patientId,
          category: category,
          subCategory: subCategory,
        }),
      });

      if (response.ok) {
        Alert.alert('Assessment Notified', 'The assessment has been notified.');
      } else {
        Alert.alert('Assessment Notified', 'The assessment has been notified.');
      }
    } catch (error) {
      console.error('Error notifying assessment:', error);
    }
  };

  return (
    <NativeBaseProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {patientDetails2 && (
          <VStack space={4} alignItems="center" style={styles.container}>
            <Box style={styles.profileContainer}>
              <Text style={styles.profileTitle}>Patient Profile</Text>
              <Text>{`ID: ${patientDetails2.patientid}`}</Text>
              <Text>{`Name: ${patientDetails2.name}`}</Text>
              <Text>{`Email: ${patientDetails2.email}`}</Text>
              <Text>{`Age: ${calculateAge(patientDetails2.dob)}`}</Text>

              {/* Displaying data.learns */}
                <Box style={styles.learnsBox}>
                  {patientDetails && patientDetails.learns && Array.isArray(patientDetails.learns) ? (
                    patientDetails.learns.map((learn, index) => (
                      <Text key={index}>{`Category: ${learn.category}, SubCategory: ${learn.subCategory}`}</Text>
                    ))
                  ) : (
                    <Text>No learns data available</Text>
                  )}
                </Box>

            </Box>

            <Button
              w={240}
              height={140}
              padding={50}
              style={styles.button}
              endIcon={<Icon name="plus-circle" size={40} color="#FFF" />}
              onPress={() => navigation.navigate('AssignCards', { patientId })}
            >
              Assign Cards
            </Button>
            <Button
              w={240}
              height={140}
              padding={50}
              colorScheme="blueGray"
              endIcon={<Icon name="edit" size={40} color="#FFF" />}
              onPress={() => {
                notifyAssessment();
                fetchPatientDetails();
              }}
            >
              Notify Assessment
            </Button>
            <Button
              w={240}
              height={140}
              padding={45}
              colorScheme="yellow"
              endIcon={<MIcon name="message" size={40} color="#FFF" />}
              onPress={() => navigation.navigate('Progress', { patientID: patientId })}
            >
              View Progress
            </Button>
          </VStack>
        )}
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '80%',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
  },
  learnsBox: {
    backgroundColor: '#f0f0f0', // Choose your desired background color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default Patient;
