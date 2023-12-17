import React, {useState} from 'react';

import {
  StyleSheet,
} from 'react-native';

import { NativeBaseProvider, Box, VStack} from "native-base";

import Home from './Pages/Home';

import StartScreen from './src/screens/StartScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import Guest from './Pages/Guest';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import Create from './Pages/Create';
import Category from './Pages/Category';
import Voice1 from './Pages/Voice1';
import SubCategory from './Pages/SubCategory';
import User from './Pages/User';
import Display from './Pages/Display';
import Delete from './Pages/Delete';
import DeleteSubCategory from './Pages/DeleteSubCategory';
import ChooseSubDelete from './Pages/ChooseSubDelete';
import Update from './Pages/Update';
import SubUpdate from './Pages/SubUpdate';
import ChooseOptions from './Pages/ChooseOptions';
import Assessment from './Pages/Assessment';
import TakeAssess from "./Pages/TakeAssess";
import Quiz from "./Pages/Quiz";
import Userl from "./src/screens/Userl";

import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import DeleteCategory from './Pages/DeleteCategory';
import Voice2 from './Pages/Voice2';
import Dashboard from './src/screens/Dashboard';
import PatientsList from './Pages/PatientsList';
import Cards from './Pages/Cards';
import Patient from './Pages/Patient';
import AssignCards from './Pages/AssignCards';
import Progress from './Pages/Progress';
import OTPScreen from './src/screens/OTPScreen';
import NewPassword from './src/screens/NewPassword';
 
const Stack = createNativeStackNavigator();

function App(){
return(
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Dashboard' >
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="PatientsList" component={PatientsList} />
          <Stack.Screen name="Cards" component={Cards} />
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Userl" component={Userl} />
          <Stack.Screen name="Guest" component={Guest} />
          <Stack.Screen name="TakeAssess" component={TakeAssess} />
          <Stack.Screen name="Quiz" component={Quiz} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Create" component={Create} /> 
          <Stack.Screen name="Category" component={Category} /> 
          <Stack.Screen name="SubCategory" component={SubCategory} /> 
          <Stack.Screen name="Display" component={Display} />  
          <Stack.Screen name="User" component={User} />   
          <Stack.Screen name="Delete" component={Delete} /> 
          <Stack.Screen name="DeleteSubCategory" component={DeleteSubCategory} /> 
          <Stack.Screen name="ChooseSubDelete" component={ChooseSubDelete} /> 
          <Stack.Screen name="DeleteCategory" component={DeleteCategory} /> 
          <Stack.Screen name="Update" component={Update} />
          <Stack.Screen name="SubUpdate" component={SubUpdate} />
          <Stack.Screen name="ChooseOptions" component={ChooseOptions} />
          <Stack.Screen name="Voice1" component={Voice1} />
          <Stack.Screen name="Voice2" component={Voice2} />
          <Stack.Screen name="Assessment" component={Assessment} />
          <Stack.Screen name="Patient" component={Patient} />
          <Stack.Screen name="AssignCards" component={AssignCards} />
          <Stack.Screen name="Progress" component={Progress} />
          <Stack.Screen name="OTPScreen" component={OTPScreen} />
          <Stack.Screen name="NewPassword" component={NewPassword} />
          {/* <Stack.Screen name="AssignCards" component={AssignCards} /> */}
        </Stack.Navigator>
      </NavigationContainer> 

    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    alignContent:'center',
    justifyContent:'center'
  },
})

export default App;