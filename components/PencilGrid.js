import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const GRID_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: GRID_SIZE,
    height: GRID_SIZE,
    padding: 5,
  },
  number: {
    fontSize: 9,
    textAlign: "center",
  },
  hiddenNumber: {
    opacity: 0, // Hides the number by making it fully transparent
  },
  selectedNumber: {
    backgroundColor: "lightblue",
  },
});

const PencilGrid = ({ pencilValues, selectedNumber }) => {
  const hiddenNumbers = new Set(pencilValues); // convert the array to a Set for faster lookup

  const renderNumber = (number) => {
    if (hiddenNumbers.has(number)) {
      // number is in the pencilValues array, so show it
      if (number == selectedNumber) {
        return (
          <Text style={[styles.number, styles.selectedNumber]}>{number}</Text>
        );
      } else {
        return <Text style={styles.number}>{number}</Text>;
      }
    } else {
      // number is not in pencilValues array, so hide it
      return <Text style={styles.number}> </Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {renderNumber(1)}
        {renderNumber(4)}
        {renderNumber(7)}
      </View>
      <View>
        {renderNumber(2)}
        {renderNumber(5)}
        {renderNumber(8)}
      </View>
      <View>
        {renderNumber(3)}
        {renderNumber(6)}
        {renderNumber(9)}
      </View>
    </View>
  );
};

export default PencilGrid;
