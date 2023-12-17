import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

const MarksDisplayScreen = ({ route }) => {
  const { patientID } = route.params;
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://192.168.1.5:3001/progress/${patientID}`);
      const data = await response.json();
      setMarksData(data);
      console.log("data=", data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Patient Assessment History</Text>
      {marksData.map((data, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Assessment ID:</Text>
            <Text style={styles.value}>{data.assessmentID}</Text>
            <Text style={styles.label}>Patient ID:</Text>
            <Text style={styles.value}>{data.patientID}</Text>
            <Text style={styles.label}>Score:</Text>
            <Text style={styles.value}>{data.score}/50</Text>
            <Text style={styles.label}>Submit Date:</Text>
            <Text style={styles.value}>{data.submitDate}</Text>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{data.category}</Text>
            <Text style={styles.label}>Subcategory:</Text>
            <Text style={styles.value}>{data.subCategory}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginVertical: 10,
    elevation: 5, // Add some elevation for a shadow effect
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  value: {
    fontSize: 16,
    color: 'black',
  },
});

export default MarksDisplayScreen;
