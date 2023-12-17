import { Button, Center,FlatList,Image } from "native-base";
import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,TextInput,textStyle, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeBaseProvider,  VStack} from "native-base";
import Sound from 'react-native-sound';
import {useNavigation} from "@react-navigation/native";

const Guest = ({ route }) => {
  const navigation = useNavigation();
  const uid = route.params.uid;
  console.log("id is ", uid);
  const serverIP = "http://192.168.1.5:3001/";
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(serverIP + `learns/${uid}`);
      const results = await response.json();

      console.log("results = ", results);

      if (results && results.cards) {
        setData(results.cards);
      } else {
        console.log("No card data found");
        setData([]); // Set to an empty array if no card data is found
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [uid]); // Trigger the fetch when the UID changes

  const playSound = (item) => {
    sound1 = new Sound(item.cardAudio, '', (error, _sound) => {
      if (error) {
        alert('error' + error.message);
        return;
      }
      sound1.play(() => {
        sound1.release();
      });
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.imgStyle}
            resizeMode="cover"
            source={{ uri: item.cardImg }}
            alt="img1"
          />
        </View>
        <View style={styles.dataContainer}>
          <TouchableOpacity onPress={() => playSound(item)}>
            <Text style={styles.buttonPlay}>Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Button
        mode="outlined"
        colorScheme="gray"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>

      <TouchableOpacity
        style={styles.appButtonContainer}
        onPress={() => navigation.navigate('TakeAssess', { uid: uid })}
      >
        <Text style={styles.appButtonText}>Give assessment</Text>
      </TouchableOpacity>

      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.cardID.toString()}
        />
      ) : (
        <Text>No cards available for this patient.</Text>
      )}
    </View>
  );
};

const styles=StyleSheet.create({
  textStyle:{
    fontSize:40,
    padding:30,
    backgroundColor:"blue",
    margin:20,
    color:"white",
  },
  listStyle:{
    flex:1,
    textAlign:"center",
    margin:20,
    padding:10,
  },
  card:{
    width:250,
    backgroundColor:"#fff",
    borderRadius:5,
    marginVertical:20,
    display:"flex",
    flexDirection:"column",
    justifyContent:"space-between"
  },
  imgContainer:{
    padding:10,
  },
  imgStyle:{
    width:"100%",
    height:180
  },
  mainContainer:{
    width:"100%",
    paddingTop:50,
    backgroundColor:"#bb96d7",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
  },
  buttonPlay: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(00,80,00,1)',
    borderWidth: 1,
    borderColor: 'rgba(80,80,80,0.5)',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
})
export default Guest;