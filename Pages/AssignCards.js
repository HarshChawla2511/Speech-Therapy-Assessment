import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { LogBox } from "react-native";
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, VStack, Select, CheckIcon, Button } from "native-base";
import MIcon from "react-native-vector-icons/MaterialIcons";
import { Alert } from "react-native";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);
function AssignCards({ navigation }) {
  const route = useRoute();
  const { patientId } = route.params;
  console.log("patientid is =", patientId);

  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Fetch options for "Select Category" and "Select SubCategory" from the "card" table
 // Fetch categories and subcategories from the database
// ...

// Fetch categories and subcategories from the database
const fetchCategories = async () => {
  try {
    const response = await fetch('http://192.168.197.55:3001/card');
    const data = await response.json();

    if (data && Array.isArray(data)) {
      setCategories(data.map((card) => card.mainCategory));
    } else {
      console.error('Invalid data format for categories:', data);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchSubCategories = async () => {
  try {
    const response = await fetch('http://192.168.197.55:3001/card');
    const data = await response.json();

    if (data && Array.isArray(data)) {
      setSubCategories(data.map((card) => card.subCategory));
    } else {
      console.error('Invalid data format for subcategories:', data);
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
  }
};

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(`http://192.168.197.55:3001/learns2/${patientId}`);
      const data = await response.json();
      setPatientDetails(data);

      if (data && Array.isArray(data.learns)) {
        // Optionally, you can perform additional actions if learns is available
        // ...
      } else {
        console.error('No learns data found for the patientID:', patientId);
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };
useEffect(() => {
  fetchCategories();
  fetchSubCategories();
  fetchPatientDetails();
}, []);

const onAssign=()=>{
  fetch('http://192.168.197.55:3001/AssignCards', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientId:patientId,
              mainCategory:selectedCategory,
              subCategory:selectedSubCategory
            })
            }).then(response => response.json())
              .then(json=>console.log(json))
              .catch(error => console.error(error))
            console.log(`main category is ${selectedCategory}`);
            console.log(`patientid is ${patientId}`);
            console.log(`subcategory is ${selectedSubCategory}`);

            Alert.alert(
              "Data Submitted",
              "Record added successfully",                   
              [
                {
                  text: "Ok",
                  style: "cancel"
                },                     
              ]
            );
}


 const onRemoveCards = () => {
    // Send a request to your server to remove the corresponding rows
    fetch('http://192.168.197.55:3001/removeCards', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId: patientId,
        mainCategory: selectedCategory,
        subCategory: selectedSubCategory,
      }),
    })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.error(error));

    Alert.alert(
      'Data Removed',
      'Records removed successfully',
      [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ]
    );
  };
// ...



  return (
    <NativeBaseProvider>
      <VStack space={4} alignItems="center" style={styles.container}>
        {/* Select Category Dropdown */}
        <Select
          selectedValue={selectedCategory}
          minWidth={200}
          placeholder="Select Category"
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          _selectedItem={{
            bg: 'cyan.600',
            endIcon: <CheckIcon size={5} />,
          }}
        >
          {categories.map((category) => (
            <Select.Item key={category} label={category} value={category} />
          ))}
        </Select>

        {/* Select SubCategory Dropdown */}
        <Select
          selectedValue={selectedSubCategory}
          minWidth={200}
          placeholder="Select SubCategory"
          onValueChange={(itemValue) => setSelectedSubCategory(itemValue)}
          _selectedItem={{
            bg: 'cyan.600',
            endIcon: <CheckIcon size={5} />,
          }}
        >
          {subCategories.map((subcategory) => (
            <Select.Item key={subcategory} label={subcategory} value={subcategory} />
          ))}
        </Select>

        <Button onPress={onAssign} colorScheme="green" endIcon={<MIcon name="assignment" size={40} color="#FFF" />}>
          Assign
        </Button>

        {/* Button to remove selected cards */}
        <Button onPress={onRemoveCards} colorScheme="red" endIcon={<MIcon name="delete" size={40} color="#FFF" />}>
          Remove Cards
        </Button>
      </VStack>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
});

export default AssignCards;
