import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import QuestionItem from './QuestionItem';

const { height, width } = Dimensions.get('window');

const Quiz = ({ route }) => {
  const serverIP = 'http://192.168.1.5:3001/';
  const [currentIndex, setCurrentIndex] = useState(1);
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const currDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

  const uid = route.params.uid;
  const listRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

const fetchQuestions = async () => {
  try {
    const response = await fetch(serverIP + `learns/${uid}`);
    const learnsData = await response.json();

    // Ensure that learnsData is an object with the 'learns' property
    if (!learnsData || typeof learnsData !== 'object' || !Array.isArray(learnsData.learns)) {
      console.error('Invalid learns data format:', learnsData);
      return; // or handle the error appropriately
    }

    // Fetch random cards based on the learnsData (up to a maximum of 15)
    const cardsResponse = await fetch(serverIP + 'fetchRandomCards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        learnsData: learnsData.learns,
        count: 5, // Adjust the maximum number of cards as needed
      }),
    });

    const cardsData = await cardsResponse.json();
    console.log('Fetched cards data:', cardsData);

    // Generate questions from the fetched cards
    const questions = cardsData.cards.map((card) => {
      // Extract cardImg and other card images
      const { cardImg, cardID, cardAudio, mainCategory, subCategory } = card;
      const otherCardImages = cardsData.cards
        .filter((otherCard) => otherCard.cardID !== cardID)
        .map((otherCard) => otherCard.cardImg);

      // Shuffle the array of other card images (random order)
      const shuffledOtherCardImages = otherCardImages.sort(() => Math.random() - 0.5);

      // Select two other card images as options (excluding the correctOption)
      const options = shuffledOtherCardImages.slice(0, 2);
      const correctOption = cardImg;

      // Shuffle the options array to randomize the order
      const shuffledOptions = [correctOption, ...options].sort(() => Math.random() - 0.5);

      return {
        cardId: cardID,
        audio: cardAudio,
        options: shuffledOptions,
        correctOption: correctOption,
        marked: -1,
      };
    });

    // Set the generated questions in the state
    setData(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};



const OnSelectOption = (index, x) => {
  const tempData = [...data];
  tempData.map((item, ind) => {
    if (index === ind) {
      if (item.marked !== -1) {
        item.marked = -1;
      } else {
        item.marked = x;
      }
    }
  });
  setData(tempData);
};

const getTextScore = () => {
  let marks = 0;
  data.forEach(item => {
    const correctIndex = item.options.indexOf(item.correctOption);
    if (item.marked !== -1) {
      console.log(`Marked: ${item.marked}, Correct: ${correctIndex + 1}`);
      if (item.marked == correctIndex + 1) {
        marks += 10; // +10 for correct answer
      }
      // You can add a different logic for negative marking if needed
    }
  });

  // Ensure that the maximum score is 50
  return Math.min(marks, 50);
};

const onSubmit = async () => {
  try {
    // Extract categories and subcategories from the questions
    const categories = data.map(item => item.category).join(' ');
    const subcategories = data.map(item => item.subcategory).join(' ');

    // Submit quiz data
    const responseQuiz = await fetch('http://192.168.1.5:3001/submitQuiz', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score: getTextScore(),
        patientid: uid,
        submitDate: currDate,
        categories: categories,
        subcategories: subcategories,
      }),
    });

    // Fetch progress data after submitting the quiz
    const responseProgress = await fetch('http://192.168.1.5:3001/progress');
    const progressData = await responseProgress.json();
    console.log('Fetched progress data:', progressData);

    setModalVisible(true);
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};





  const reset = () => {
    const tempData = [...data];
    tempData.map(item => {
      item.marked = -1;
    });
    setData(tempData);
  };
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',

            marginLeft: 20,
            color: '#000',
          }}>
          Total Questions:{' ' + currentIndex + '/' + data.length}
        </Text>
        <Text
          style={{
            marginRight: 20,
            fontSize: 20,
            fontWeight: '600',
            color: 'black',
          }}
          onPress={() => {
            reset();
            listRef.current.scrollToIndex({animated: true, index: 0});
          }}>
          Reset
        </Text>
      </View>
      <View style={{marginTop: 10}}>
        <FlatList
          ref={listRef}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          onScroll={e => {
            const x = e.nativeEvent.contentOffset.x / width + 1;
            setCurrentIndex(x.toFixed(0));
          }}
          data={data}
          renderItem={({item, index}) => {
            return (
              <QuestionItem
                data={item}
                selectedOption={x => {
                  OnSelectOption(index, x);
                }}
              />
            );
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          bottom: 50,
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: currentIndex > 1 ? 'purple' : 'gray',
            height: 50,
            width: 100,
            borderRadius: 10,
            marginLeft: 20,
            marginBottom:-20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            console.log(parseInt(currentIndex) - 1);
            if (currentIndex > 1) {
              listRef.current.scrollToIndex({
                animated: true,
                index: parseInt(currentIndex) - 2,
              });
            }
          }}>
          <Text style={{color: '#fff'}}>Previous</Text>
        </TouchableOpacity>
        {currentIndex == data.length ? (
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              height: 50,
              width: 100,
              borderRadius: 10,
              marginBottom:-20,
              marginRight: 20,
  
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setModalVisible(true)
              console.log("score=",getTextScore());
            }}>
            <Text style={{color: '#fff'}} onPress={onSubmit}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: 'purple',
              height: 50,
              width: 100,
              borderRadius: 10,
              marginRight: 20,
              marginBottom:-20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              console.log(currentIndex);
              if (data[currentIndex - 1].marked !== -1) {
                if (currentIndex < data.length) {
                  listRef.current.scrollToIndex({
                    animated: true,
                    index: currentIndex,
                  });
                }
              }
            }}>
            <Text style={{color: '#fff'}}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: '800',
                alignSelf: 'center',
                marginTop: 20,
                color:"black"
              }}>
               Score
            </Text>
            <Text
              style={{
                fontSize: 40,
                fontWeight: '800',
                alignSelf: 'center',
                marginTop: 20,
                color: 'green',
              }}>
              {getTextScore()}{'/'+data.length*10}
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                height: 40,
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 20,
                marginBottom: 20,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={{color:"green"}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Quiz;
