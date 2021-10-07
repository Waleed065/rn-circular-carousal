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

  const handleMemoizedItemPress = useCallback((index: number): void => {
    if (index === frontItemIndex && onItemPress) {
      onItemPress(index);
      return;
    }

    rotateCarousel(index);
  }, []);

  const onMemoizedItemDrop = useCallback((index: number) => {
    onItemDrop?.(index);
  }, []);

  // const renderMemoizedItem = useCallback((...data: any) => {
  //   return renderItem(data);
  // }, [items]);

  return (
    <View
      style={[styles.containerStyle, style]}
      {...(!isDragging && panHandlersRef)}>
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
          handleItemPress={handleMemoizedItemPress}
          onItemDrop={onMemoizedItemDrop}
          // onItemLayoutChange={this.handleItemLayoutChange}
          setIsDragging={setIsDragging}
          setItemCollision={setItemCollision}
        />
      ))}
    </View>
  );
}
