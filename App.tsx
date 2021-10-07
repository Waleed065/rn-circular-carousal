import React from 'react';
import { SafeAreaView } from 'react-native';
import CarouselItem from './components/CarouselItem';
import CircularCarousel from './components/CircularCarousal';

const dataSource = [
  {name: 'Football'},
  {name: 'Basket Ball'},
  {name: 'Cricket'},
  {name: 'Gym'},
];

export default function App() {
  const handleItemPress = () => {
    return null
  }
  return (
    <SafeAreaView>
      <CircularCarousel
        style={{ width: 350 }}
        dataSource={dataSource}
        renderItem={data => <CarouselItem data={data} />}
        onItemPress={handleItemPress} 
        // dropAreaLayout={undefined}      
      />
    </SafeAreaView>
  );
}
