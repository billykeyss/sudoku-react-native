import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Cell = ({ value, pencilValues, onValueChange }) => {
  const handlePencilValuePress = (index) => {
    const newPencilValues = [...pencilValues];
    newPencilValues[index] = !newPencilValues[index];
    onValueChange(value, newPencilValues);
  };

  return (
    <View style={styles.cell}>
      {value !== 0 ? (
        <Text style={styles.value}>{value}</Text>
      ) : (
        <View style={styles.pencilGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Text
              key={num}
              style={[
                styles.pencilValue,
                pencilValues[num - 1] && styles.selected,
              ]}
              onPress={() => handlePencilValuePress(num - 1)}
            >
              {num}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  value: {
    fontSize: 24,
  },
  pencilGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 4,
  },
  pencilValue: {
    width: '33.33%',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
    color: 'gray',
  },
  selected: {
    color: 'black',
  },
});

export default Cell;