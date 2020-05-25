import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Diagram from "./Diagram";
import Tracker from "./Tracker";

const Stack = createStackNavigator();

class App extends Component{

  render() {
    return (
      <View style={styles.pink}>

        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="COVID tracker"
              component={Diagram}
            />
            <Stack.Screen
              name="Tracker"
              component={Tracker}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pink: {
    flex: 1,
    backgroundColor: 'white',
  },
  SearchBarTextColor: {
    backgroundColor: "#484e52",
  }
  });

export default App;