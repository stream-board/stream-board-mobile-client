import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  Spinner,
  Container,
  Header,
  Content,
  Form,
  Card,
  CardItem,
  Title,
  Subtitle,
  Text,
  List,
  Left, 
  Body,
  Right,
  Thumbnail,
  Icon,
  Button
} from 'native-base';

import { Query } from 'react-apollo';
import { ALL_ROOMS_QUERY } from './../TypesDef';
import Store from "./../../reduxConfig";
import RoomItem from './RoomsItem';
import { ROOM_ADDED_S } from './../TypesDef';

export default class RoomListQuery extends Component {
  constructor(props){
    super(props);
    this.state = {
      joinedToRoom: false,
      roomSelected: 0,
      roomClicked: false,
    }
  };

  render(){
    return(
      <Content style={styles.roomsContainer}>
        {this.props.data.allRooms.map((room, index) => (
          <RoomItem 
            room={room} 
            joinRoom={this.props.joinRoom} 
            key={index} 
            navigation={this.props.navigation}
            />
        ))}
      </Content>
    )
  };

  componentDidMount() {
    this.props.subscribeToNewRooms();
  }
  /*shouldComponentUpdate(nextProps, nextState) {
    if(nextState.roomClicked && !nextState.joinedToRoom) {
      console.log(nextState);
      return false;
    }
    return true;
  }*/
  
  componentDidUpdate(prevProps, prevState) {
    if(this.state.joinedToRoom) {
      this.props.navigation.navigate('RoomsDetail', { roomId: this.state.roomSelected})
    }
  }


};

const styles = StyleSheet.create({
  card: {
    marginTop: 5,
    marginBottom: 5,
    width: 300,
    backgroundColor: '#0DEBFF'
  },
  roomsContainer:{
    margin: 10
  },
  listElement:{
    margin:10,
  },
  cardItem: {
    alignContent: 'center',
  },
  cardContainer: {
    backgroundColor: '#fafafa',
  },
  subtitle: {
    fontWeight: 'bold',
    lineHeight: 20
  },
  description: {
    fontSize: 12,
    color: '#aeaeae'
  },
  col1: {
    width: '25%'
  },
  col2: {
    width: '75%'
  }
})
