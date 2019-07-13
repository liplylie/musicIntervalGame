import React, { Component } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import ModalSelector from "react-native-modal-selector";

import { Convert } from "../../styles";
import NavBar from "../Common/NavBar";

class ModalComponent extends Component {
  state = {
    selectedInstrument: this.props.instrument || "Clarinet",
    changeSetting: false
  };

  closeModal = () => {
    const { onClose } = this.props;
    const { changeSetting, selectedInstrument } = this.state;

    if (changeSetting) {
      onClose(selectedInstrument);
    } else {
      onClose();
    }
  };

  instrumentListData = [
    { key: 0, section: true, label: "Instruments" },
    { key: 1, label: "Piano", accessibilityLabel: "Piano" },
    { key: 2, label: "Clarinet", accessibilityLabel: "Clarinet" },
    { key: 2, label: "Guitar", accessibilityLabel: "Guitar" }
  ];
  render() {
    const { showModal } = this.props;
    const { selectedInstrument } = this.state;

    return (
      <View>
        <Modal animationType="slide" transparent={false} visible={showModal}>
          <NavBar
            setToTop
            rightButtonIcon={"close"}
            onRightButtonPress={this.closeModal}
          />

          <View style={[styles.container, { justifyContent: "center" }]}>
            <View style={styles.setting}>
              <ModalSelector
                data={this.instrumentListData}
                initValue="Select an Instrument"
                supportedOrientations={["portrait"]}
                accessible={true}
                scrollViewAccessibilityLabel={"Scrollable options"}
                cancelButtonAccessibilityLabel={"Cancel Button"}
                onChange={({ label }) => {
                  this.setState({
                    selectedInstrument: label,
                    changeSetting: true
                  });
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around"
                  }}
                >
                  <Text
                    style={{
                      fontSize: Convert(20),
                      width: Convert(100)
                    }}
                  >
                    Instrument
                  </Text>

                  <Text
                    style={{
                      fontSize: Convert(20),
                      width: Convert(100),
                      textAlign: "center"
                    }}
                  >
                    {selectedInstrument}
                  </Text>
                </View>
              </ModalSelector>
            </View>

            <View style={[styles.setting, styles.centerContainer]}>
              <TouchableOpacity onPress={Actions.Rules}>
                <Text
                  style={{
                    fontSize: Convert(20),
                    textAlign: "center"
                  }}
                >
                  Rules
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  setting: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    width: "100%"
  },
  centerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  }
});

export default ModalComponent;