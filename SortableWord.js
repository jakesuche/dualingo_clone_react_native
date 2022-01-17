import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {between, useVector} from 'react-native-redash';

 import { CalculateLayout, lastOrder, Offset, reorder } from "./layout";
import Placeholder, {MARGIN_TOP, MARGIN_LEFT} from './components/Placeholder';

const SortableWord = ({offsets, index, children, containerWidth}) => {
  const offset = offsets[index];
  const isInBank = useDerivedValue(() => offset.order.value === -1);


  const isGestureActive = useSharedValue(false);
  const translation = useVector();

 
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {

      
      if (isInBank.value) {
        translation.x.value = offset.originalX.value - MARGIN_LEFT;
        translation.y.value  = offset.originalY.value + MARGIN_TOP;
      } else {
        translation.x.value = offset.x.value;
        translation.y.value= offset.y.value;
      }
     ctx.x = translation.x.value
     ctx.y = translation.y.value
     isGestureActive.value = true;
    },
    onActive: ({translationX, translationY},ctx) => {
      translation.x.value = ctx.x + translationX;
      translation.y.value = ctx.y + translationY;
      if(isInBank.value && translation.y.value < 100){
        offset.order.value = lastOrder(offsets)
        CalculateLayout(offsets,containerWidth)
      }
    },
    onEnd: () => {
      isGestureActive.value = false;
      translation.y.value = withSpring(offset.x.value)
      translation.x.value = withSpring(offset.y.value)
    },
  });
  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    }
    return withSpring(isInBank.value  ? offset.originalX.value - MARGIN_LEFT : offset.originalX.value)
    
  });
  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }
    return withSpring(isInBank.value  ? offset.originalY.value + MARGIN_TOP: offset.originalY.value)
    // if (isInBank.value) {
    //   return offset.originalY.value + MARGIN_TOP;
    // }
    // return offset.originalY.value;
  });
  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex:isGestureActive.value ? 100 :0,
      width: offset.width.value,
      height: offset.height.value,
      transform: [
        {translateY: translateY.value},
        {translateX: translateX.value},
      ],
    };
  });

  return (
    <>
      <Placeholder offset={offset} />
      <Animated.View style={[style]}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={{...StyleSheet.absoluteFill}}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
};

export default SortableWord;
