import React, { Component } from "react";
import { Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { ColorPicker } from 'react-native-color-picker';
import { Fab, Icon, Button, View, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { PARTICIPANTS_BY_ID_QUERY, PARTICIPANT_JOINED } from './../TypesDef';
import RoomsParticipants from './RoomsParticipants';
import Store from './../../reduxConfig';
import { roomActionCreators } from './../roomsRedux';
import { Query } from 'react-apollo';

export default class ParticipantsModal extends Component {
  constructor(props){
      super(props);
      this.state = {
        isModalVisible: false,
        active: 'true',
      };
      this._toggleModal = this._toggleModal.bind(this);
  }

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    return (
      
      <View>
        <Fab 
            active={this.state.active}
            direction='up'
            containerStyle={{marginBottom: 10}}
            style={styles.settingBtn}
            potition='bottomRight'
            onPress={()=>{ 
                this.setState({ 'active': !this.state.active });
            }}
        >
            <Icon type='FontAwesome' name='cogs'/>
            <Button style={styles.toolBtn} onPress={this._toggleModal}>
                <Icon type='MaterialIcons' name='face' style={{ color: '#FFF' }}/>
            </Button>
        </Fab>
        <Modal isVisible={this.state.isModalVisible}>
          <Query query={PARTICIPANTS_BY_ID_QUERY} fetchPolicy={'network-only'} variables={{id: this.props.roomId}}>
          {({ subscribeToMore, loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <Text>{`Error: ${error}`}</Text>;
            return (
              <RoomsParticipants
                data={data}
                navigation={this.props.navigation}
                subscribeToJoinedParticipants={() => {
                  subscribeToMore({
                    document: PARTICIPANT_JOINED,
                    updateQuery: (prev, { subscriptionData }) => {
                      if(!subscriptionData.data) return prev;
                      console.log(`subs ${prev}`);
                      Store.dispatch(roomActionCreators.addRoomParticipant(subscriptionData.data.participantJoined));
                      let newList = prev.participantsById.slice(0);
                      newList.push(subscriptionData.data.participantJoined);
                      let result = { participantsById: newList };
                      return result;
                    }
                  })
                }}
              />
            )
          }}
          </Query>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    colorWheel: {
        width: Dimensions.get('window').width
    },
    thumbStyle: {
        height: 30,
        width: 30,
        borderRadius: 30
    },
    settingBtn: {
        backgroundColor: '#174557',
    },
    toolBtn: {
        backgroundColor: '#26d3cd',
    },
    shapeBtn:{
        backgroundColor: '#0a8b88',
        borderRadius: 10,
    },
    exitButton: {
        backgroundColor: 'transparent',
    },
    containerExit: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});