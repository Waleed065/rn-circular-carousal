import React, { memo, useMemo } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { wrapperStyle } from '../styles/CarouselItemWrapper';
import { CarouselItemData, DropAreaLayout } from '../types';
import DraggableItem from './DraggableItem';

type schema = {
  // key: number;
  isDraggable: boolean;
  item: CarouselItemData;
  data: any;
  dropAreaLayout?: DropAreaLayout;
  renderItem: (arg1: any, arg2: any) => JSX.Element;
  handleItemPress: (idx: number) => void;
  onItemDrop: () => void;
  onItemLayoutChange?: (event: any) => void;
  setItemDraggingState: (isDragging: boolean) => void;
  setItemCollision?: (isColliding: boolean) => void;
  index: number;
};

// const Touchable = Platform.select({
//   ios: TouchableWithoutFeedback,
//   android: TouchableNativeFeedback as any,
// });

function CarouselItemWrapper({
  isDraggable,
  item,
  data,
  dropAreaLayout,
  renderItem,
  handleItemPress,
  onItemDrop,
  onItemLayoutChange,
  setItemDraggingState,
  setItemCollision,
  index,
}: schema) {
  const onPress = () => {
    handleItemPress(index);
  };

  const CarouselItemView = useMemo(
    () =>
      isDraggable ? (
        <DraggableItem
          //   data={data}
          item={item}
          dropAreaLayout={dropAreaLayout}
          onPress={onPress}
          onDrop={onItemDrop}
          setDraggingState={setItemDraggingState}
          setItemCollision={setItemCollision}>
          {renderItem(data, onItemLayoutChange)}
        </DraggableItem>
      ) : (
        renderItem(data, onItemLayoutChange)
      ),
    [isDraggable],
  );


  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={wrapperStyle(item)}>{CarouselItemView}</View>
    </TouchableWithoutFeedback>
  );
}

export default memo(CarouselItemWrapper);
