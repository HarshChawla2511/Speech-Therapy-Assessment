import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, Alert } from 'react-native';
import Sound from 'react-native-sound';
import { Popover, VStack, HStack, Button } from 'native-base';
import MIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';

const Cards = () => {
  const [cards, setCards] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://192.168.197.55:3001/card');
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  const playSound = (item) => {
    if (item && item.cardAudio) {
      const sound1 = new Sound(item.cardAudio, '', (error, _sound) => {
        if (error) {
          console.error('Error: ' + error.message);
          return;
        }
        sound1.play(() => {
          sound1.release();
        });
      });
    } else {
      console.error('Item or cardAudio is missing');
    }
  };

  const updateCard = (cardId) => {
    navigation.navigate('Update', { cardId });
  };

  const deleteCard = (cardId) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            fetch('http://192.168.197.55:3001/Dcard', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cardID:cardId
            })
            }).then(response => response.json())
              .then(json=>console.log(json))
              .catch(error => console.error(error))
            console.log(`Deleting card with ID ${cardId}`);
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const renderCardItem = ({ item }) => (
    <VStack space={1} style={styles.cardContainer}>
      {/* Card Image */}
      <ImageBackground
        source={{ uri: item.cardImg }}
        style={styles.cardImage}
        accessibilityRole="image"
        accessibilityLabel={item.altText}
      ></ImageBackground>

      {/* Play Button */}
      <TouchableOpacity style={styles.playButton} onPress={() => playSound(item)}>
        <Text style={styles.playButtonText}>Play</Text>
      </TouchableOpacity>

      {/* Options Button */}
      <Popover
        trigger={(triggerProps) => (
          <TouchableOpacity {...triggerProps} style={styles.optionsButton}>
            <Text style={styles.optionsButtonText}>
              Options
              <MIcon name="expand-more" size={20} color="#FFF" />
            </Text>
          </TouchableOpacity>
        )}
      >
        <Popover.Content style={styles.popoverContent}>
          <Popover.CloseButton />
          <Popover.Header></Popover.Header>
          <Popover.Body>
            <VStack space={2}>
              <Button onPress={() => updateCard(item.cardID)}>Update</Button>
              <Button colorScheme="danger" onPress={() => deleteCard(item.cardID)}>
                Delete
              </Button>
            </VStack>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </VStack>
  );

  const navigateToCreate = () => {
    // Navigate to the Create.js page
    navigation.navigate('Create');
  };

  return (
    <View style={styles.container}>
      <Button
        w={140}
        h={70}
        padding={0}
        colorScheme='blueGray'
        borderRadius={35}
        alignItems='center'
        justifyContent='center'
        endIcon={<MIcon name="add-circle" size={40} color="#FFF" />}
        onPress={navigateToCreate}
      >
        Add
      </Button>
      <Text style={styles.heading}>Cards</Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.cardID.toString()}
        renderItem={renderCardItem}
        style={styles.cardList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', // Center items vertically
  },
  cardList: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  optionsButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  optionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popoverContent: {
    width: 200, // Set your desired width here
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Cards;
