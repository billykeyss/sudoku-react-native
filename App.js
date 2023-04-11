import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
} from "react-native";
import SudokuCell from "./components/SudokuCell";

// function generateSudokuPuzzle(difficulty) {
//   const solvedPuzzle = [
//     [5, 3, 4, 6, 7, 8, 9, 1, 2],
//     [6, 7, 2, 1, 9, 5, 3, 4, 8],
//     [1, 9, 8, 3, 4, 2, 5, 6, 7],
//     [8, 5, 9, 7, 6, 1, 4, 2, 3],
//     [4, 2, 6, 8, 5, 3, 7, 9, 1],
//     [7, 1, 3, 9, 2, 4, 8, 5, 6],
//     [9, 6, 1, 5, 3, 7, 2, 8, 4],
//     [2, 8, 7, 4, 1, 9, 6, 3, 5],
//     [3, 4, 5, 2, 8, 6, 1, 7, 9],
//   ];

//   // Determine number of cells to remove based on difficulty
//   let numCellsToRemove;
//   switch (difficulty) {
//     case "easy":
//       numCellsToRemove = 40;
//       break;
//     case "medium":
//       numCellsToRemove = 50;
//       break;
//     case "hard":
//       numCellsToRemove = 60;
//       break;
//     default:
//       numCellsToRemove = 40;
//   }

//   // Make a copy of the solved puzzle
//   let puzzle = solvedPuzzle.map((row) => [...row]);

//   // Remove cells randomly until desired difficulty is achieved
//   for (let i = 0; i < numCellsToRemove; i++) {
//     let row, col;
//     do {
//       // Choose a random cell to remove
//       row = Math.floor(Math.random() * 9);
//       col = Math.floor(Math.random() * 9);
//     } while (puzzle[row][col] === null);

//     // Remove the cell value
//     puzzle[row][col] = null;

//     // Check if resulting puzzle has a unique solution
//     const unique = isUniqueSolution(puzzle);
//     if (!unique) {
//       // If not, undo the last removal and try again
//       puzzle[row][col] = solvedPuzzle[row][col];
//       i--;
//     }
//   }

//   return puzzle;
// }

// Gets all possible values for a specific sudoku cell.
function analyzeBoardData(sudokuData) {
  const numRows = sudokuData.length;
  const numCols = sudokuData[0].length;

  // Populate the SudokuCellData objects with possible values for each cell
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (sudokuData[row][col].value !== 0) {
        // If the cell already has a value, set it as the only possible value
        // Already has a value, skipping
      } else {
        // Otherwise, calculate the possible values for the cell
        const usedValues = new Set();

        // Check values in the same row and column
        for (let i = 0; i < 9; i++) {
          usedValues.add(sudokuData[row][i].value);
          usedValues.add(sudokuData[i][col].value);
        }

        // Check values in the same 3x3 sub-grid
        const subGridStartRow = Math.floor(row / 3) * 3;
        const subGridStartCol = Math.floor(col / 3) * 3;
        for (let i = subGridStartRow; i < subGridStartRow + 3; i++) {
          for (let j = subGridStartCol; j < subGridStartCol + 3; j++) {
            usedValues.add(sudokuData[i][j].value);
          }
        }

        // Determine the remaining unused values for the cell
        const unusedValues = [];
        for (let i = 1; i <= 9; i++) {
          if (!usedValues.has(i)) {
            unusedValues.push(i);
          }
        }

        // Set the possible values for the cell in the SudokuCellData object
        sudokuData[row][col].pencilValues = unusedValues;
      }
    }
  }

  return sudokuData;
}

function solveSudoku(puzzle) {
  const solve = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, i, j, num)) {
              board[i][j] = num;
              if (solve(board)) {
                return true;
              } else {
                board[i][j] = 0;
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  if (solve(puzzle)) {
    console.log("Solving Sudoku");
    return puzzle;
  } else {
    throw new Error("Invalid puzzle");
  }
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

function createSudokuBoardData(initialBoard, solution) {
  const board = [];

  for (let i = 0; i < initialBoard.length; i++) {
    const row = [];

    for (let j = 0; j < initialBoard[i].length; j++) {
      const value = initialBoard[i][j];
      const pencilValues = [];
      const answer = solution[i][j];

      row.push(new SudokeCellData(value, pencilValues, answer));
    }

    board.push(row);
  }

  return board;
}

class SudokeCellData {
  constructor(value, pencilValues, answer) {
    this.value = value;
    this.pencilValues = pencilValues;
    this.answer = answer;
  }
}

export default function App() {
  const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];
  const initialBoardRef = JSON.parse(JSON.stringify(initialBoard));
  const sudokuSolution = solveSudoku(JSON.parse(JSON.stringify(initialBoard)));
  const sudokuData = createSudokuBoardData(initialBoard, sudokuSolution);
  console.log("Board: " + JSON.stringify(sudokuData));

  const [board, setBoard] = useState(initialBoard);
  const [boardData, setBoardData] = useState([...sudokuData]);

  const [pencilMode, setPencilMode] = useState(false);
  const [history, setHistory] = useState([[...initialBoard]]);
  const [currentStep, setCurrentStep] = useState(0);
  const [boardSolution, setBoardSolution] = useState([...sudokuSolution]);

  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const handleCellPress = (row, col) => {
    setSelectedCell({ row, col });
    if (board[row][col] != null) {
      setSelectedNumber(board[row][col]);
    }
  };

  const handleNumberSelect = (number) => {
    // Update the board state with the selected number
    if (pencilMode) {
      const newBoardData = [...boardData];
      const pencilValues =
        newBoardData[selectedCell.row][selectedCell.col].pencilValues;
      console.log(JSON.stringify(pencilValues));
      if (pencilValues.includes(number)) {
        pencilValues.splice(pencilValues.indexOf(number), 1);
      } else {
        pencilValues.push(number);
      }
      setBoardData(boardData);
      setBoard([...board]);
    } else {
      if (initialBoardRef[selectedCell.row][selectedCell.col] !== 0) {
        console.log("Original puzzle number, skipping");
      } else {
        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[selectedCell.row][selectedCell.col] = number;
        setBoard(newBoard);
        setBoardData(
          analyzeBoardData(createSudokuBoardData(newBoard, boardSolution))
        );
        setHistory([...history, newBoard]);
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleClear = () => {
    // Update the board state with the selected number
    const newBoard = [...board];
    handleNumberSelect(0);
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setBoard(history[newStep]);
      setCurrentStep(newStep);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      const newStep = currentStep + 1;
      setBoard(history[newStep]);
      setCurrentStep(newStep);
    }
  };

  const handleFastPencil = () => {
    setBoardData(analyzeBoardData(createSudokuBoardData(board, boardSolution)));
  };

  const handleTogglePencil = () => {
    setPencilMode((pencilMode) => !pencilMode);
  };

  const handleHint = () => {
    handleNumberSelect(boardData[selectedCell.row][selectedCell.col].answer);
  };

  const handleRefresh = () => {
    // TODO generate a new sudoku puzzle
  };

  const isCellValid = (cell) => {
    return cell != 0 && cell != null;
  };

  const isCellCorrect = (cell, row, col) => {
    return soluton[row][col] === cell;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRefresh}>
        <Text style={styles.button}>Refresh</Text>
      </TouchableOpacity>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => {
            return (
              <SudokuCell
                key={rowIndex + "-" + colIndex}
                style={styles.cell}
                cell={cell}
                selectedNumber={selectedNumber}
                selectedCell={selectedCell}
                rowIndex={rowIndex}
                colIndex={colIndex}
                answer={boardData[rowIndex][colIndex].answer}
                pencilValues={boardData[rowIndex][colIndex].pencilValues}
                handleCellPress={handleCellPress}
                isOriginalCell={initialBoardRef[rowIndex][colIndex] !== 0}
              />
            );
          })}
        </View>
      ))}

      <View style={styles.modal}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleUndo}>
            <Text style={styles.button}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRedo}>
            <Text style={styles.button}>Redo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.button}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFastPencil}>
            <Text style={styles.button}>Fast Pencil</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleTogglePencil}>
            <Text style={styles.button}>
              {pencilMode ? "Pencil currently ON" : "Pencil currently OFF"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleHint}>
            <Text style={styles.button}>Hint</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <TouchableHighlight
              key={number}
              style={styles.modalButton}
              onPress={() => handleNumberSelect(number)}
            >
              <Text style={styles.modalButtonText}>{number}</Text>
            </TouchableHighlight>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "lightblue",
    marginRight: 10,
  },
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
    color: "gray",
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
  buttonContainer: {
    flexDirection: "row",
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalContent: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  modalButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  modalButtonText: {
    fontSize: 20,
  },
});
