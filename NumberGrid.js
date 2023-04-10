import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 40,
    height: 40,
    padding: 5
  },
  number: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hiddenNumber: {
    opacity: 0  // Hides the number by making it fully transparent
  },
});


const NumberGrid = ({ pencilValues }) => {
  const hiddenNumbers = new Set(pencilValues); // convert the array to a Set for faster lookup

  const renderNumber = (number) => {
    if (hiddenNumbers.has(number)) {
      // number is in the pencilValues array, so show it
      return <Text style={styles.number}>{number}</Text>;
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

export default NumberGrid;