import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Dimensions,
  ScrollView, TouchableHighlight
} from 'react-native';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import Tracker from "./Tracker";
import ModalDropdown from 'react-native-modal-dropdown';

class Diagram extends Component{
  url = 'https://api.thevirustracker.com/free-api?countryTimeline=';
  url_country = 'http://country.io/names.json';

  state = {
    json: null,
    search: '',
    dropdown: '',
    country_json: null,
    // counrty_code: [],
    counrty_name: [],
    flag: true,
    country_map: {},
    name_now: 'Russia',
  };

  updateDropdown = dropdown => {
    this.setState({ dropdown });
    this.getData(this.state.counrty_name[dropdown]);
    // console.log(dropdown);
  };

  componentDidMount() {
    setTimeout(() => this.getCountry(), 0);
    setTimeout(() => this.scrollView_1.scrollToEnd(), 0);
    setTimeout(() => this.scrollView_2.scrollToEnd(), 0);
  }

  async getCountry(code) {
    try {
      var response = await fetch(this.url_country);
      var country_json = await response.json();
      this.setState({country_json: country_json});
      console.log('Data');
    } catch (error) {
      alert('Enter the country code correctly');
      // alert('Failed with ' + error.message);
    }
  }

  async getData(country) {
    try {
      var response = await fetch(this.url + this.state.country_map[country]);
      var json = await response.json();
      this.setState({json: json.timelineitems[0]});
      this.setState({name_now: country});
    } catch (error) {
      alert('Sorry \nNo data for this country.');
      // alert('Failed with ' + error.message);
    }
  }

  // renderRow (rowData, rowID, highlighted) {
  //   return (
  //     <TouchableHighlight underlayColor='#36baac'>
  //       <View >
  //         <Text style={styles.textDropdown} numberOfLines={1} ellipsizeMode={'tail'}>
  //           {rowData}
  //         </Text>
  //       </View>
  //     </TouchableHighlight>
  //   )
  // }

  render() {
    console.log('render');
    const { dropdown } = this.state;

    // const { search } = this.state;
    var t_cases = '-';
    var t_deaths = '-';
    var t_recoveries = '-';

    var dateT = [];
    var total_cases = [];
    var total_deaths = [];
    var flatData = [];
    var total_recoveries = [];

    var counrty_code = [];

    if (this.state.country_json !== null && this.state.flag) {
      counrty_code = Object.keys(this.state.country_json);
      counrty_code.forEach(i => {
        this.state.country_map[this.state.country_json[i]] = i;
      });
      this.state.counrty_name = Object.values(this.state.country_json).sort();
      this.getData('Russia');
      console.log('country_json');
      this.state.flag = false;
    }

    if (this.state.json !== null) {
      var keys = Object.keys(this.state.json);
      var month_day = [0, 31, 29, 31, 30, 31, 30];
      var month = 1;
      var day_t = '01';
      var day = 1;

      while (month + '/' + day_t + '/20' !== keys[0]) {
        total_cases.push(0);
        total_deaths.push(0);
        dateT.push(month + '/' + day_t + '/20');
        flatData.push([{total_cases: 0, total_deaths: 0, total_recoveries: 0}, month + '/' + day_t + '/20']);
        day += 1;
        if (day < 10) {
          day_t = '0' + day;
        } else {
          day_t = day;
        }
        if (day > month_day[month]){
          month += 1;
          day = 1;
          day_t = '01';
        }
      }

      keys.forEach(i => {
        if (i !== 'stat') {
          var record = this.state.json[i];
          dateT.push(i.toString());
          total_cases.push(record.total_cases);
          total_deaths.push(record.total_deaths);
          flatData.push([record, i]);
        }
      });
    } else {
      total_cases = [0];
      dateT = [0];
      total_deaths = [0];
      flatData = [[{total_cases: 0, total_deaths: 0, total_recoveries: 0}, '1/01/20']]
    }
    // if (flatData === undefined) {
    //   flatData = [[{total_cases: 0, total_deaths: 0, total_recoveries: 0}, '1/01/20']]
    // }
    if (flatData[0][1] === '1/01/20') {
      flatData.reverse()
      t_cases = flatData[0][0].total_cases;
      t_deaths = flatData[0][0].total_deaths;
      t_recoveries = flatData[0][0].total_recoveries;
    } else {
      t_cases = flatData[flatData.length - 1][0]['total_cases'];
      t_deaths = flatData[flatData.length - 1][0]['total_deaths'];
      t_recoveries = flatData[flatData.length - 1][0]['total_recoveries'];
    }

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>Please choose a country(now: {this.state.name_now}): </Text>

          <View style={styles.container_Dropdown}>
            <ModalDropdown
              options={this.state.counrty_name}
              defaultValue={this.state.name_now}
              defaultIndex={183}
              // style={styles.text}
              textStyle={styles.text}
              // renderRow={this.renderRow={this.renderRow.bind(this)}.bind(this)}
              onSelect={this.updateDropdown}
            />
          </View>

          <Text style={styles.text_2}>{'\n'}For today: {'\n'}Infected now = {t_cases - t_deaths - t_recoveries}, {'\n'}Total cases = {t_cases}, {'\n'}Total deaths = {t_deaths}</Text>

          <Text>{'\n'}Total cases</Text>
          <ScrollView horizontal={true} ref={scrollView => {this.scrollView_1 = scrollView;}}>
            <LineChart
                data={{
                labels: dateT,
                datasets: [
                  {data: total_cases},
                ]
              }}
              segments={10}
              horizontalLabelRotation={0}
              verticalLabelRotation={-15}
              width={5800} // from react-native get("window").width
              height={200}
              yLabelsOffset={0.1}
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: "#ec1d1d",
                backgroundGradientFrom: "#ef3838",
                backgroundGradientTo: "#f88484",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "3",
                  strokeWidth: "2",
                  stroke: "#f88484"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </ScrollView>
          <Text>{'\n'}Total deaths</Text>
          <ScrollView horizontal={true} ref={scrollView => {this.scrollView_2 = scrollView;}}>
            <LineChart
              data={{
                labels: dateT,
                datasets: [{
                  data: total_deaths,
                }]
              }}
              segments={10}
              horizontalLabelRotation={0}
              verticalLabelRotation={-15}
              width={5800}
              height={200}
              yLabelsOffset={0.1}
              yAxisInterval={1}
              chartConfig={{
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "3",
                  strokeWidth: "2",
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </ScrollView>
          <Text>{'\n'}</Text>
          <Button title="More details" onPress={() => this.props.navigation.navigate('Tracker', {
              flatData: flatData,
              cd: this.state.name_now,
            })}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    backgroundColor: '#E8EAF6',
    color: '#f88484',
  },
  container_Dropdown: {
    fontSize: 30,
    // width: 40,
  },
  text_2: {
    fontSize: 15,
    // textAlign: 'center',
    // backgroundColor: '#d5cece',
    // color: '#f88484',
  },
});

export default Diagram;