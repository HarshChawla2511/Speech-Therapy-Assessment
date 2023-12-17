import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';

const PatientsList = () => {
  const navigation = useNavigation();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch the list of patients from the database
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://192.168.1.5:3001/patient');
        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

const handleSearch = (query) => {
  setSearchQuery(query);
  const filtered = patients.filter(
    (patient) =>
      (patient.name && patient.name.toLowerCase().includes(query.toLowerCase())) ||
      (patient.patientid && patient.patientid.toString().includes(query))
  );
  setFilteredPatients(filtered);
};


  const handlePatientPress = (patientId) => {
    // Navigate to the Patient screen with the selected patient ID
    navigation.navigate('Patient', { patientId });
  };

  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.patientButton}
      onPress={() => handlePatientPress(item.patientid)}
    >
      <Text style={styles.patientButtonText}>{item.patientid}. {item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome doctor</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients"
          placeholderTextColor="#333"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.patientid.toString()}
        renderItem={renderPatientItem}
        style={styles.patientList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... your existing styles
   container: {
    flex: 1,
    color : 'black',
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    color : 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    color : 'black',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    color: '#333', // Set the text color for better visibility
  },
  patientList: {
    flex: 1,
  },
  patientButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  patientButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PatientsList;
