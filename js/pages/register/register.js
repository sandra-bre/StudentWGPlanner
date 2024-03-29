import React, {
  Component,
  Navigator,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native';

GLOBAL = require('../../auth');

import config from "../../../config";
import Button from '../../components/Button';
import styles from "../../styles/index";

export default class Register extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      username: '',
      password: '',
      password2: '',
      email: '',
      errormessage: ''
    };

    this.onPressBack = this.onPressBack.bind(this);
  }

  onChange(text, key) {
    let newState = {};
    newState[key] = text;
    this.setState(newState);
  }
  onPressBack() {
    this.props.navigator.push({name: "Login"});
  }
  onSubmit() {
    if (this.state.password !== this.state.password2) {
      this.setState({errormessage: "Passwords are not equal."});
      return;
    }
    if(this.state.password === '' || this.state.email === '' || this.state.username ==='')
    {
      this.setState({errormessage: "Please fill in all data."});
      return;
    }

    fetch(config.PARSE_SERVER_URL + '/users', {
        method: 'POST',
        headers: config.PARSE_SERVER_HEADERS,
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          email: this.state.email
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          this.setState({errormessage: response.error});
        } else {
          GLOBAL.USER = {
            id: response.objectId,
            username: this.state.username,
            email: this.state.email
          };
          GLOBAL.USERID = response.objectId;
          this.props.navigator.push({
             name:"Home"
         });
       }
      })
      .catch(error => {
        //console.log('error', error);
      })
  }

  render()
  {
    return (
      <View>
        <View style={styles.viewNavigation}><Text style={styles.textNavigation}>Register</Text></View>
        <Text style={styles.inputLabelSmall}>Username</Text>
        <TextInput style={styles.basic}
          value={this.state.username}
          onChangeText={(text) => this.onChange(text, 'username')}></TextInput>
        <Text style={styles.inputLabelSmall}>Password</Text>
        <TextInput style={styles.basic}
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={(text) => this.onChange(text, 'password')}></TextInput>
        <Text style={styles.inputLabelSmall}>Repeat password</Text>
        <TextInput style={styles.basic}
          secureTextEntry={true}
          value={this.state.password2}
          onChangeText={(text) => this.onChange(text, 'password2')}></TextInput>
        <Text style={styles.inputLabelSmall}>Email</Text>
        <TextInput style={styles.basic}
          value={this.state.email}
          onChangeText={(text) => this.onChange(text, 'email')}></TextInput>
          <Text style={styles.errormessage}>{this.state.errormessage}</Text>

        <Button text="Register" onPress={this.onSubmit.bind(this)} show={true} type="standard"></Button>
        <Button text="Back" onPress={this.onPressBack} show={true} type="back"></Button>
      </View>
    );
  }
}
//<TouchableHighlight onPress={this.onSubmit.bind(this)}><Text>Register</Text></TouchableHighlight>
