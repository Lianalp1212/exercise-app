import { StyleSheet, View, FlatList } from 'react-native';
import { Button, CheckBox, Input, Text, ButtonGroup } from '@rneui/themed';
import * as Font from 'expo-font';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator()

// async function cacheFonts(fonts) {
//   return fonts.map(async (font) => await Font.loadAsync(font))
// }

const HOME_SCREEN = "Home"
const DURATION_EXERCISE = "Duration"
const REPITITION_EXERCISE = "Repetition"
const FEEDBACK_SCREEN = "Feedback"
const THANKS_SCREEN = "Thanks"

let mQuotes = [
  "It does not matter how slowly you go as long as you do not stop - Confucius",
  "It always seems impossible until it's done - Nelson Mandela",
  "The most effective way to do it, is to do it - Amelia Earhart",
  "Do the difficult things while they are easy and do the great things while they are small. A journey of a thousand miles must begin with a single step - Lao Tzu",
  "Setting goals is the first step in turning the invisible into the visible - Tony Robbins",
  "Just Do It - Shia LaBeouf",
]

export default function App({exerciseList}) {
    return (
      <NavigationContainer>{
        <Stack.Navigator initialRouteName={HOME_SCREEN}>
          <Stack.Screen name="Home" component={HomeScreen} initialParams={{exerciseList: exerciseList}}></Stack.Screen>
          <Stack.Screen name="Duration" component={DurationScreen} initialParams={{exerciseList: exerciseList}}></Stack.Screen>
          <Stack.Screen name="Repetition" component={RepetitionScreen} initialParams={{exerciseList: exerciseList}}></Stack.Screen>
          <Stack.Screen name="Feedback" component={FeedbackScreen}></Stack.Screen>
          <Stack.Screen name="Thanks" component={ThanksScreen}></Stack.Screen>
        </Stack.Navigator>
    }</NavigationContainer>
  );
}

function HomeScreen({navigation}) {
  let exerciseList = [
    {name: "Running", type: DURATION_EXERCISE, key: 1},
    {name: "Plank", type: DURATION_EXERCISE, key: 2},
    {name: "Push Ups", type: REPITITION_EXERCISE, key: 3},
    {name: "Squats", type: REPITITION_EXERCISE, key: 4},
  ] 
  let renderExercise = ({item, key}) => 
    <Button title={item.name} testID={`${item.name}-button`} style={styles.button}
      onPress={() => navigation.navigate(item.type === DURATION_EXERCISE ? DURATION_EXERCISE : REPITITION_EXERCISE, {exerciseKey: key, name: item.name})}
    ></Button>
    const [selectedQuote, setSelectedQuote] = useState("")
    let handleQuote = () => {
      let randomNum = Math.floor(Math.random() * mQuotes.length)
      setSelectedQuote(mQuotes[randomNum])
    }
    return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.heading}>Work It!</Text>
        <Text style={styles.quoteHeading}>Motivational Quote of the Day</Text>
        <Text style={styles.quote}>{selectedQuote}</Text>
        <Button title="Get Quote"
          titleStyle={{
            color:'black'
          }}
          buttonStyle={{
            margin: 6,
            backgroundColor: '#B5E0A3'
          }}
          onPress={() => handleQuote()}
        ></Button>
        <Text style={styles.subheading}>Please select an exercise</Text>
          <FlatList data={exerciseList}
            renderItem={renderExercise}
            keyExtractor={(exercise) =>exercise.key}>
          </FlatList>
          <Button title="Leave Feedback" 
            onPress={() => navigation.navigate("Feedback", FeedbackScreen)}
            style={{margin: 20}}
            color= '#3BAC09'
          ></Button>
      </View>
    </SafeAreaView>
  )
}

let currentTimer = 0
let resetTimer = 0
function DurationScreen({navigation, route}) {
    let [running, setRunning] = useState(false)
    let [timer, setTimer] = useState(0)
    // let [lapper, setLapper] = useState(0)
    // let [lappedTimes, setLappedTimes] = useState([])
    let updateTimer = useCallback(() => {
        if(running){
            setTimer((timer) => timer+10)
        }
    }, [running, setInterval])

  //   let updateLapper = useCallback(() => {
  //     if(!running){
  //         setLappedTimes([...lappedTimes, timer])
  //         setLapper(timer)
  //     }
  // }, [running, timer, lappedTimes])

  // let recLaps = lappedTimes.map((lapTime, index) => {
  //     let mins2 = (Math.floor((lapTime / (1000*60)) % 60)).toString().padStart(2, "0")
  //     let secs2 = (Math.floor((lapTime / 1000) % 60)).toString().padStart(2, "0")
  //     let mills2 =  (timer % 1000).toString().padStart(3, "0")
  //     return <Unorderedlist key={index}>{mins2}:{secs2}:{mills2}</Unorderedlist>
  //     })

    useEffect(() => {
      if (running) {
        currentTimer = setInterval(updateTimer, 10)
      }  
        return () => clearInterval(currentTimer)
    }, [running, updateTimer])

    let start = useCallback(() => {
        setRunning(!running)
    }, [running])

    let reset = useCallback(() => {
        clearInterval(currentTimer)
        setTimer(resetTimer)
    })

    let mins = (Math.floor((timer / (1000*60)) % 60)).toString().padStart(2, "0")
    let secs = (Math.floor((timer / 1000) % 60)).toString().padStart(2, "0")
    let mills =  (timer % 1000).toString().padStart(3, "0")
    return (
        <View style={styles.container}>
          <Text style={styles.heading}>{route.params.name}</Text>
          <Text style={{fontSize: "3em", fontFamily:"monospace", textAlign: 'center', padding: 10}}>Duration: {mins}:{secs}:{mills}</Text>
          <Button title="Start" style={styles.exerciseButton} onPress={start}></Button>
          <Button title="Reset" style={styles.exerciseButton} onPress={reset}></Button>
          <Button title="Home" style={styles.exerciseButton} onPress={() => navigation.goBack()}></Button>  
        </View>
    )
}

function RepetitionScreen({navigation, route}) {
    let [count, setCount] = useState(0)
    return <View style={styles.container}>
      <Text style={styles.heading}>{route.params.name}</Text>
      <Text style={{fontSize: "3em", textAlign: 'center', padding: 10}}>{count}</Text>
      <Button title="Add" style={styles.exerciseButton} onPress={()=>setCount(count=>count+1)}></Button>
      <Button title="Reset" style={styles.exerciseButton} onPress={()=>setCount(0)}></Button>
      <Button title="Home" style={styles.exerciseButton} onPress={() => navigation.goBack()}></Button>
    </View>
}

function ThanksScreen ({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thank you for providing feedback on our app!</Text>
      <Button title="Home" style={styles.exerciseButton} onPress={() => navigation.navigate("Home", HomeScreen)}></Button>
    </View>
  )
}

function FeedbackScreen({navigation}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedIndex2, setSelectedIndex2] = useState(0)
  const usefulScale = {
    question: "How useful was this app in tracking your workout?",
    choices: [
      "Very Helpful",
      "Helpful",
      "Neutral",
      "Unhelpful",
      "Very Unhelpful",
    ]
  }
  const recScale = {
    question: "How likely are you to recommend this app to someone?",
    choices: [
      "Very Likely",
      "Likely",
      "Neutral",
      "Unlikely",
      "Very Unlikely",
    ]
  }
  // <Likert {...usefulScale}/>
  //     <Likert {...recScale} />
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Please let us know your thoughts!</Text>
      <Text style={styles.subheading}>{usefulScale.question}</Text>
      <ButtonGroup buttons={usefulScale.choices}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value)
        }}
        containerStyle={{ marginBottom: 20, textAlign: 'center'}}
      ></ButtonGroup>
      <Text style={styles.subheading}>{recScale.question}</Text>
      <ButtonGroup buttons={recScale.choices}
        selectedIndex={selectedIndex2}
        onPress={(value) => {
          setSelectedIndex2(value)
        }}
        containerStyle={{ marginBottom: 20, textAlign: 'center'}}
      ></ButtonGroup>
      <Text style={styles.subheading}>Any other comments?</Text>
      <Input placeholder="Other comments..."></Input>
      <Button title="Submit" style={styles.exerciseButton} onPress={() => navigation.navigate("Thanks", ThanksScreen)}></Button>
      <Button title="Home" style={styles.exerciseButton} onPress={() => navigation.goBack()}></Button>
    </View>    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    alignItems: 'center',
    padding: 10,
  },
  exerciseButton: {
    margin: 6,
  },
  fbButton: {
    margin: 6,
    backgroundColor: '#3BAC09', 
  },
  space: {
    height: 10
  },
  heading: {
    fontSize: 40,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
    fontWeight: 'bold'
  },
  subheading: {
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20
  },
  quoteHeading: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 35,
    backgroundColor: '#B5E0A3',
  },
  quote: {
    fontSize: 15,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
    //backgroundColor: '#B5E0A3',
  },
  quoteButton: {
    margin: 6,
    backgroundColor: '#B5E0A3',
  },
})