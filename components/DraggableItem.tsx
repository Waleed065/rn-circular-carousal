import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance
} from 'react-native';
// src
import { CarouselItemData, DropAreaLayout } from '../types';
import { isCollidingWithDropArea } from '../utils';

interface schema {
  item: CarouselItemData;
  dropAreaLayout?: DropAreaLayout;
  onDrop: () => void;
  onPress?: () => void;
  setIsDragging: (isDragging: boolean) => void;
  setItemCollision: any;

  children: JSX.Element;
}
export default function DraggableItem({
  setItemCollision,
  item,
  dropAreaLayout,
  onPress,
  onDrop,
  setIsDragging,
  children,
}: schema) {
  const panResponder = useRef<PanResponderInstance | null>(null);
  // const _val = useRef<{x: number; y: number} | null>(null);

  const panRef = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  // const [pan, setPan] = useState(new Animated.ValueXY());
  const [itemLayout] = useState({});

  useEffect(() => {
    // _val.current = {x: 0, y: 0};

    // pan.addListener(value => (_val.current = value));

    // Initialize PanResponder with move handling
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (
        e: GestureResponderEvent,
        gesture: PanResponderGestureState,
      ) => {
        const {moveY, y0} = gesture;

        if (moveY - y0 > 20) {
          setIsDragging(true);

          if (setItemCollision) {
            setItemCollision(
              isCollidingWithDropArea(
                dropAreaLayout,
                gesture,
                item,
                itemLayout,
              ),
            );
          }

          return Animated.event([null, {dx: panRef.x, dy: panRef.y}])(
            e,
            gesture,
          );
        }
      },
      onPanResponderRelease: (
        e: GestureResponderEvent,
        gesture: PanResponderGestureState,
      ) => {
        const {moveX, moveY, x0, y0} = gesture;

        if (onPress && moveX === x0 && moveY === y0) {
          onPress();
        } else if (
          isCollidingWithDropArea(dropAreaLayout, gesture, item, itemLayout)
        ) {
          onDrop();
        }
        setIsDragging(false);
        Animated.spring(panRef, {
          toValue: {x: 0, y: 0},
          friction: 5,
          useNativeDriver: true,
        }).start();
      },
    });
    // adjusting delta value
    // pan.setValue({x: 0, y: 0});
  }, []);

  const handleItemLayoutChange = (event: any) => {
    // const {layout} = event.nativeEvent;
    // const { itemLayout } = this.state;
    // if (
    //   !inRange(itemLayout.width - 5, itemLayout.width + 5)(layout.width) ||
    //   !inRange(itemLayout.height - 5, itemLayout.height + 5)(layout.height)
    // ) {
    // this.setState({
    //     ...this.state,
    //     itemLayout,
    // });
    // }
  };

  const panStyle = {
    transform: panRef.getTranslateTransform(),
  };
  const panHandlers = panResponder.current?.panHandlers;

  return (
    <Animated.View
      {...panHandlers}
      style={[panStyle]}
      onLayout={handleItemLayoutChange}>
      {children}
    </Animated.View>
  );
}
