import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View} from 'react-native';
import { SessionDeleteMutation } from './../TypesDef'
import { Mutation } from 'react-apollo';
import Store from './../../reduxConfig';
import {
  Spinner,
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Button,
  Title,
  Label,
  Icon,
} from 'native-base';
import { connect } from 'react-redux';
import { sessionActionCreators } from "./../sessionsRedux";
import { asyncWrapFunction } from './../../utils';

export default class SignOut extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false, text: '', sessionDeleted: false, active: 'true',};
    this.onForm = this.onForm.bind(this);
    this.onDeleteSession = this.onDeleteSession.bind(this);
  }

  onForm(deleteSession) {
    return (
        <Button
          rounded
          style={styles.buttonElement}
          onPress={() => {
            let deleteParam = {
              headersSession: {
                token : Store.getState().currentUser.token,
                uid : Store.getState().currentUser.email,
                client : Store.getState().currentUser.client
              }
            };
            asyncWrapFunction(deleteSession, deleteParam).then(() => {
              this.setState({sessionDeleted: true});
            })
          }}
        ><Icon name="log-out" />
        </Button>
    )
  };

  onDeleteSession(data){
    Store.dispatch(sessionActionCreators.deleteCurrentUser());
    return (
      <Spinner />
    )
  };

  componentDidUpdate(prevProps, prevState) {
    if(this.state.sessionDeleted){
      this.props.navigation.navigate('SignIn');
    }
  }

  render(){
    return (
      <Mutation 
        mutation={SessionDeleteMutation} 
      >
        {(deleteSession, { loading, error, data }) => (
          <View>
          {(data ? this.onDeleteSession(data) : this.onForm(deleteSession))}
          {error && <Text> Error: ${error}</Text>}  
          </View>
        )}
      </Mutation>
    )
  }
}


const styles = StyleSheet.create({
  buttonElement: {
    backgroundColor: '#0a8b88',
    alignSelf: 'center',
    margin: 5,
  },
});