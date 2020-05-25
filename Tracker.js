import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
} from 'react-native';

class Tracker extends Component{

  constructor() {
    super();
    console.log('constructor');
  }

  componentDidMount() {
    if (this.props.route.params.flatData.length <= 20) {
      alert('Data was not uploaded. \n Repeat transition.');
    }
    console.log('componentDidMount');
  }

  render() {

    var cd = this.props.route.params.cd;
    let flatData = this.props.route.params.flatData;

    if (cd === undefined) {
      cd = 'Russsia';
    }


    return (
      <View style={styles.container}>
        <Text>Information on {cd} {'\n'}</Text>

        <Text style={{fontSize: 15}}>Date:       Infected,  Total cases, Total deaths{'\n'}</Text>
        <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator}/>}
          data={flatData}
          renderItem={({item}) => (
            <Text >
              {item[1]}: {item[0].total_cases - item[0].total_deaths - item[0].total_recoveries}, {item[0].total_cases}, {item[0].total_deaths}
            </Text>)
          }
        />
      </View>
    ); // {item, index}
  }
} //               {item[1]}: Inf now = {item[0].total_cases - item[0].total_deaths}, Total cases = {item[0].total_cases}, Total deaths = {item[0].total_deaths}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 32,
  },
  separator: {
    height: 1,
    backgroundColor: "#868686",
  }
});

export default Tracker;