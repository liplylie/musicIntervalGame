import React, { Component } from "react";
import { Modal, Text, TouchableHighlight, View, Alert } from "react-native";

const ModalComponent = props => {
  const setModalVisible = () => {
    const { closeModal, onClose } = props;
    onClose("Piano");
    closeModal();
  };

  const { showModal } = props;
  return (
    <View style={{ marginTop: 22 }}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={{ marginTop: 22 }}>
          <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%"}}>

            <TouchableHighlight onPress={setModalVisible}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalComponent;
