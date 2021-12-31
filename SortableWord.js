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

// import { calculateLayout, lastOrder, Offset, reorder } from "./Layout";
import Placeholder, {MARGIN_TOP, MARGIN_LEFT} from './components/Placeholder';

const SortableWord = ({offsets, index, children, containerWidth}) => {
  const offset = offsets[index];
  const isInBank = useDerivedValue(() => offset.order.value === -1);
  const isGestureActive = useSharedValue(false);
  const translation = useVector();
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      
      isGestureActive = true;
      if (isInBank.value) {
        ctx.x = offset.originalX.value;
        ctx.y = offset.originalY.value;
      } else {
        ctx.x = offset.x.value;
        ctx.y = offset.y.value;
      }
    },
    onActive: ({translationX, translationY},ctx) => {
      translation.x.value = ctx.x + translationX;
      translation.y.value = ctx.y + translationY;
    },
    onEnd: () => {
      isGestureActive = false;
    },
  });
  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    }
    if (isInBank.value) {
      return offset.originalX.value - MARGIN_LEFT;
    }
    return offset.originalX.value;
  });
  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }
    if (isInBank.value) {
      return offset.originalY.value + MARGIN_TOP;
    }
    return offset.originalY.value;
  });
  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
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
