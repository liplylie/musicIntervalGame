import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Button,
  TouchableHighlight
} from "react-native";
import { Actions } from "react-native-router-flux";
import ModalSelector from "react-native-modal-selector";

// Global
import { Convert } from "../../styles";

// Component
import NavBar from "../Common/NavBar";

class ModalComponent extends Component {
  state = {
    selectedInstrument: this.props.instrument || "Clarinet",
    intervalType: this.props.intervalType || "Ascending",
    changeSetting: false,
    renderIntervalRelatedRows: this.props.gameType === "Interval",
    gameType: this.props.gameType
  };

  componentWillReceiveProps(prevProps) {
    if (
      JSON.stringify(prevProps) !== JSON.stringify(this.props) &&
      !this.state.changeSetting
    ) {
      this.setState({
        selectedInstrument: this.props.instrument || "Clarinet",
        intervalType: this.props.intervalType || "Ascending",
        renderIntervalRelatedRows: this.props.gameType === "Interval",
        gameType: this.props.gameType
      });
    }
  }

  closeModal = handle => {
    const { onClose } = this.props;
    const {
      changeSetting,
      selectedInstrument,
      intervalType,
      gameType
    } = this.state;
    if (handle === "cancel") {
      onClose({});
      return;
    }

    if (changeSetting) {
      onClose({ instrument: selectedInstrument, intervalType, gameType });
    } else {
      onClose({ gameType });
    }
  };

  instrumentListData = [
    { key: 0, section: true, label: "Instruments" },
    { key: 1, label: "Piano", accessibilityLabel: "Piano" },
    { key: 2, label: "Clarinet", accessibilityLabel: "Clarinet" },
    { key: 2, label: "Guitar", accessibilityLabel: "Guitar" }
  ];

  intervalListData = [
    { key: 0, section: true, label: "Interval Type" },
    { key: 1, label: "Ascending", accessibilityLabel: "Ascending" },
    { key: 2, label: "Descending", accessibilityLabel: "Descending" }
  ];

  gameTypeListData = () => {
    const { gameType } = this.state;

    let list = [
      { key: 0, section: true, label: "Question Type" },
      { key: 1, label: "Terms", accessibilityLabel: "Terms" },
      { key: 2, label: "Interval", accessibilityLabel: "Interval" }
    ];
    return list.filter(l => l.label !== gameType);
  };

  intervalRelatedRows = () => {
    const { showModal, onClose } = this.props;
    const { selectedInstrument, intervalType, gameType } = this.state;

    return (
      <>
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
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  fontSize: Convert(20),
                  width: "auto"
                }}
              >
                Instrument
              </Text>

              <Text
                style={{
                  fontSize: Convert(20),
                  width: "auto"
                }}
              >
                {selectedInstrument}
              </Text>
            </View>
          </ModalSelector>
        </View>

        <View style={styles.setting}>
          <ModalSelector
            data={this.intervalListData}
            initValue="Select an Instrument"
            supportedOrientations={["portrait"]}
            accessible={true}
            scrollViewAccessibilityLabel={"Scrollable options"}
            cancelButtonAccessibilityLabel={"Cancel Button"}
            onChange={({ label }) => {
              this.setState({
                intervalType: label,
                changeSetting: true
              });
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  fontSize: Convert(20),
                  width: "auto"
                }}
              >
                Interval Type
              </Text>

              <Text
                style={{
                  fontSize: Convert(20),
                  width: "auto"
                }}
              >
                {intervalType}
              </Text>
            </View>
          </ModalSelector>
        </View>
      </>
    );
  };

  render() {
    const { showModal, onClose } = this.props;
    const {
      selectedInstrument,
      intervalType,
      renderIntervalRelatedRows,
      gameType
    } = this.state;

    return (
      <View>
        <Modal animationType="slide" transparent={false} visible={showModal}>
          <NavBar
            setToTop
            rightButtonIcon={"close"}
            onRightButtonPress={() => this.closeModal("cancel")}
          />

          <View
            style={[
              styles.container,
              { justifyContent: "center", position: "relative" }
            ]}
          >
            <View style={styles.setting}>
              <ModalSelector
                data={this.gameTypeListData()}
                initValue="Change Question Type"
                supportedOrientations={["portrait"]}
                accessible={true}
                scrollViewAccessibilityLabel={"Scrollable options"}
                cancelButtonAccessibilityLabel={"Cancel Button"}
                onChange={({ label }) => {
                  this.setState({
                    renderIntervalRelatedRows: label === "Interval",
                    gameType: label,
                    changeSetting: true
                  });
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between"
                  }}
                >
                  <Text
                    style={{
                      fontSize: Convert(20),
                      width: "auto"
                    }}
                  >
                    Question Type
                  </Text>

                  <Text
                    style={{
                      fontSize: Convert(20),
                      width: "auto"
                    }}
                  >
                    {gameType}
                  </Text>
                </View>
              </ModalSelector>
            </View>

            {renderIntervalRelatedRows && this.intervalRelatedRows()}

            <View
              style={[
                styles.setting,
                styles.centerContainer,
                {
                  borderBottomWidth: 0
                }
              ]}
            >
              <TouchableHighlight style={[styles.editButton]}>
                <Button
                  onPress={this.closeModal}
                  title="Confirm"
                  accessibilityLabel="Confirm"
                  color={Platform.OS === "ios" ? "white" : null}
                />
              </TouchableHighlight>
            </View>

            <View
              style={[
                styles.setting,
                styles.centerContainer,
                {
                  position: "absolute",
                  bottom: Convert(20),
                  borderBottomWidth: 0
                }
              ]}
            >
              <TouchableOpacity onPress={Actions.Rules}>
                <Text
                  style={[
                    styles.underline,
                    {
                      fontSize: Convert(20)
                    }
                  ]}
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
    width: "100%",
    paddingLeft: Convert(15),
    paddingRight: Convert(15),
    marginBottom: Convert(10)
  },
  centerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  underline: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#000"
  },
  editButton: {
    height: Convert(40),
    width: Convert(160),
    borderRadius: Convert(10),
    marginLeft: Convert(50),
    marginRight: Convert(50),
    marginTop: Convert(20),
    marginBottom: Convert(30),
    backgroundColor: Platform.OS === "ios" ? "dodgerblue" : null
  }
});

export default ModalComponent;
