import { StyleProp, ViewStyle } from "react-native";

export type DropAreaLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CarouselItemData = {
  X?: number;
  Y?: number;
  angle?: number;
  w?: number;
  h?: number;
  opacity?: number;
  zIndex?: number;
  index?: number;
  data?: any;
};

export type CircularCarouselProps = {
  dataSource: any[];
  style?: StyleProp<ViewStyle>;
  itemStyle?: {
    height?: number;
    width?: number;
  };
  radius?: number;
  dropAreaLayout?: DropAreaLayout;
  renderItem: (data: any) => JSX.Element;
  onItemPress?: (index: number) => void;
  onItemDrop?: (index: number) => void;
  setItemCollision?: (isColliding: boolean) => void;
};

export type CircularCarouselState = {
  yMargins: {min: number; max: number};
  frontItemIndex: number;
  items: CarouselItemData[];
  isDragging: boolean;
  itemLayout: Layout;
};

export type yMarginType = {
  min: number;
  max: number;
};
