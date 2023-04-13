import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import PencilGrid from "./PencilGrid";

export const GRID_SIZE = 45;

export default function SudokuCell({
  cell,
  selectedNumber,
  selectedCell,
  rowIndex,
  colIndex,
  answer,
  pencilValues,
  handleCellPress,
  isOriginalCell,
}) {
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
        <Text style={[textStyle, styles.cellText]}>
          {cell || ""}
        </Text>
      ) : (
        <PencilGrid
          key={rowIndex + "-" + colIndex}
          pencilValues={pencilValues}
          selectedNumber={selectedNumber}
        />
      )}
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    color: "black",
  },
  selectedCell: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
  },
  selectedRowCol: {
    width: GRID_SIZE,
    height: GRID_SIZE,
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
  cellText: {
    fontSize: 32,
  },
});
