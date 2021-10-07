import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
// import { console_log } from '../constants/general';
import useCircularCarousal from '../hooks/useCircularCarousal';
import styles from '../styles/CircularCarousal';
// src
import { CircularCarouselProps } from '../types';
import CarouselItemWrapper from './CarouselItemWrapper';


export default function CircularCarousel({
  radius,
  dataSource,
  onItemPress,
  style,
  itemStyle,
  onItemDrop,
  dropAreaLayout,
  renderItem,
  setItemCollision,
}: CircularCarouselProps) {
  const [isDragging, setIsDragging] = useState(false);

  const {items, frontItemIndex, panHandlersRef, rotateCarousel} =
    useCircularCarousal({radius, dataSource, style, itemStyle});

  const handleItemPress = useCallback((index: number): void => {
    console.log('Pressed');
    if (index === frontItemIndex && onItemPress) {
      onItemPress(index);
      return;
    }

    rotateCarousel(index);
  }, []);

  const panHandlers = isDragging ? {} : panHandlersRef;

  return (
    <View style={[styles.containerStyle, style]} {...panHandlers}>
      {items.map(({data, ...item}, index) => (
        <CarouselItemWrapper
          key={index}
          isDraggable={
            frontItemIndex === index &&
            Boolean(onItemDrop) &&
            Boolean(dropAreaLayout)
          }
          data={data}
          item={item}
          index={index}
          dropAreaLayout={dropAreaLayout}
          renderItem={renderItem}
          handleItemPress={handleItemPress}
          onItemDrop={() => onItemDrop?.(index)}
          // onItemLayoutChange={this.handleItemLayoutChange}
          setItemDraggingState={setIsDragging}
          setItemCollision={setItemCollision}
        />
      ))}
    </View>
  );
}
