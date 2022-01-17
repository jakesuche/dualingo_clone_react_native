/* eslint-disable react-hooks/rules-of-hooks */
import React, {ReactElement, useState} from 'react';
import {View, StyleSheet, Dimensions, LayoutChangeEvent} from 'react-native';
import {
  useSharedValue,
  runOnUI,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';

import SortableWord from './SortableWord';
import Lines from './components/Lines';
import { CalculateLayout  } from './layout'

const margin = 32;
const containerWidth = Dimensions.get('window').width - margin * 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin,
    
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

const WordList = ({children}) => {
  const [ready, setReady] = useState(false);
  const offsets = children.map(() => ({
    order: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }));

  if (!ready) {
    return (
      <View style={styles.row}>
        {children.map((child, index) => {
          return (
            <View
              onLayout={({
                nativeEvent: {
                  layout: {x, y, height, width},
                },
              }) => {
                const offset = offsets[index];
                offset.order.value = -1;
                offset.width.value = width;
                offset.height.value = height;
                offset.originalY.value = y;
                offset.originalX.value = x;
               
                const someWorklet = () => {
                  'worklet';
                  console.log(offsets.filter(o => o?.order?.value !== -1).length)
                  if (offsets.filter(o => o?.order?.value !== -1).length == 0) {
                    runOnJS(setReady)(true);
                    console.log('jjd')
                    // runOnJS(CalculateLayout)(offsets, containerWidth)
                    CalculateLayout(offsets, containerWidth)
                  }
                  // CalculateLayout(offsets, containerWidth)
                };

                runOnUI(someWorklet)();
              }}
              key={index}>
              {child}
            </View>
          );
        })}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Lines />
      {children.map((child, index) => (
        <SortableWord
        
          key={index}
          offsets={offsets}
          index={index}
          containerWidth={containerWidth}>
          {child}
        </SortableWord>
      ))}
    </View>
  );
};

export default WordList;
