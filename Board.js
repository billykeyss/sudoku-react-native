import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Cell from './Cell';

const Board = ({ size, onBoardChange }) => {
  const [board, setBoard] = useState(createBoard(size));

  const handleValueChange = (row, col, value, pencilValues) => {
    const newBoard = [...board];
    newBoard[row][col].value = value;
    newBoard[row][col].pencilValues = pencilValues;
    setBoard(newBoard);
    onBoardChange(newBoard);
  };

  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              pencilValues={cell.pencilValues}
              onValueChange={(value, pencilValues) => handleValueChange(rowIndex, colIndex, value, pencilValues)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const createBoard = (size) => {
  const board = [];
  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      board[row][col] = {
        value: null,
        pencilValues: [],
      };
    }
  }
  return board;
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Board;