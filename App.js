// import React from "react";
// import { View, StyleSheet } from "react-native";

// import WordList from "./WordList";
// import Word from "./Word";
// import Header from "./components/Header";
// import Footer from "./components/Footer";

// const words = [
//   { id: 1, word: "uch" },
//   { id: 8, word: "hungrig" },
//   { id: 2, word: "isst" },
//   { id: 7, word: "er" },
//   { id: 6, word: "weil" },
//   { id: 9, word: "ist" },
//   { id: 5, word: "," },
//   { id: 3, word: "einen" },
//   { id: 4, word: "Apfel" },
// ];


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
// });

// const App = () => {
//   return (
//     <View style={styles.container}>
//       <Header />
//       <WordList>
//         {words.map((word) => (
//           <Word key={word.id} {...word} />
//         ))}
//       </WordList>
//       <Footer />
//     </View>
//   );
// };

// export default App;
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

function App() {
  const x = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      console.log(event)
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: (_) => {
      x.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor:'red',
    width:100,
    height:100
  }
})


export default App