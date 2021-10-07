import React from 'react';
import { Text, View } from 'react-native';
// src
import styles from '../styles/CarouselItem';


type schema = {
  data: {
    name: string;
  };
};

export default function CarouselItem({data: {name}}: schema) {
  return (
    <View style={styles.slideContainer}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}
