import React from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import NumberGrid from "./NumberGrid"

export default function SudokuCell({ cell, selectedNumber, selectedCell, rowIndex, colIndex, answer, pencilValues, handleCellPress, isOriginalCell }) {

  const isSelectedNumber =
    cell === selectedNumber &&
    selectedCell &&
    selectedNumber !== 0 &&
    selectedNumber !== null;
  const isSelectedCell =
    selectedCell &&
    selectedCell.row === rowIndex &&
    selectedCell.col === colIndex;
  var cellStyle = styles.cell;

  if (isSelectedNumber || isSelectedCell) {
    cellStyle = styles.selectedCell;
  } else if (selectedCell && selectedCell.row === rowIndex) {
    cellStyle = styles.selectedRowCol;
  } else if (selectedCell && selectedCell.col === colIndex) {
    cellStyle = styles.selectedRowCol;
  } else {
    cellStyle = styles.cell;
  }

  var textStyle = styles.textRed;
  if (cell === answer) {
    textStyle = styles.textBlack;
  }

    return (
    <TouchableHighlight
      key={colIndex}
      style={[
        cellStyle,
        (rowIndex === 3 || rowIndex === 6) && styles.thickBorderTop,
        (colIndex === 2 || colIndex === 5) && styles.thickBorderRight,
      ]}
      onPress={() => handleCellPress(rowIndex, colIndex)}
    >
      {cell !== 0 ? (
        <Text
          style={[
            textStyle,
            isOriginalCell && styles.bold
            ]}
        >
          {cell || ""}
        </Text>
      ) : (
        <NumberGrid
          key={rowIndex + "-" + colIndex}
          pencilValues={pencilValues}
        />
      )}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 20,
  },
  pencilGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 4,
  },
  pencilValue: {
    width: "33.33%",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    paddingVertical: 2,
    color: "lightgray",
  },
  selected: {
    color: "black",
  },
  selectedCell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
  },
  selectedRowCol: {
    width: 40,
    height: 40,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1EEED",
  },
  thickBorderTop: {
    borderTopWidth: 3,
  },
  thickBorderRight: {
    borderRightWidth: 3,
  },
  textBlack: {
    color: "black",
  },
  textRed: {
    color: "red",
  },
  bold: {
    fontWeight: 'bold',
  },
});
