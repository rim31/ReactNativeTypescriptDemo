import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from "../src/screens/Home";
import ReviewDetails from "../src/screens/ReviewDetails";
// import { createAppContainer } from 'react-navigation';

const HomeStack = createStackNavigator();
export default function Navigator() {
  return (
    <NavigationContainer>
      <HomeStack.Navigator initialRouteName='Home'>
        <HomeStack.Screen name='Home' component={Home} />
        <HomeStack.Screen name='ReviewDetails' component={ReviewDetails} />
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

