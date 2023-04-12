import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  Modal,
} from "react-native";
import SudokuCell from "./components/SudokuCell";
import * as SudokuHelper from "./SudokuHelper";

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

export default function App() {
  const swordfishBoard = [
    [9, 0, 8, 7, 3, 5, 1, 0, 0],
    [0, 1, 0, 9, 8, 0, 0, 3, 0],
    [0, 0, 0, 0, 2, 0, 0, 9, 8],
    [8, 0, 5, 4, 6, 9, 3, 1, 0],
    [0, 9, 0, 0, 7, 0, 0, 0, 0],
    [0, 4, 3, 2, 5, 0, 9, 0, 0],
    [2, 5, 0, 0, 9, 0, 0, 0, 1],
    [0, 8, 9, 5, 1, 2, 0, 6, 3],
    [0, 0, 1, 8, 4, 7, 0, 0, 9],
  ];
  const initialBoard = SudokuHelper.generatePuzzle("extreme");

  // const initialBoard = [
  //   [5, 3, 0, 0, 7, 0, 0, 0, 0],
  //   [6, 0, 0, 1, 9, 5, 0, 0, 0],
  //   [0, 9, 8, 0, 0, 0, 0, 6, 0],
  //   [8, 0, 0, 0, 6, 0, 0, 0, 3],
  //   [4, 0, 0, 8, 0, 3, 0, 0, 1],
  //   [7, 0, 0, 0, 2, 0, 0, 0, 6],
  //   [0, 6, 0, 0, 0, 0, 2, 8, 0],
  //   [0, 0, 0, 4, 1, 9, 0, 0, 5],
  //   [0, 0, 0, 0, 8, 0, 0, 7, 9],
  // ];
  const initialBoardRef = JSON.parse(JSON.stringify(initialBoard));
  const sudokuSolution = SudokuHelper.solveSudoku(
    JSON.parse(JSON.stringify(initialBoard))
  );
  const sudokuData = SudokuHelper.createSudokuBoardData(
    initialBoard,
    sudokuSolution
  );
  console.log("Board: " + JSON.stringify(sudokuData));
  console.log("New Puzzle: " + initialBoard);

  const [board, setBoard] = useState(initialBoard);
  const [boardData, setBoardData] = useState([...sudokuData]);
  const [difficultyModalVisible, setDifficultyModalVisible] = useState(false);
  const [hint, setHint] = useState("");

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
          SudokuHelper.analyzeBoardData(
            SudokuHelper.createSudokuBoardData(newBoard, boardSolution)
          )
        );
        setHistory([...history, newBoard]);
        setCurrentStep(currentStep + 1);

        if (SudokuHelper.isSudokuComplete(newBoard)) {
          console.log("You're done!");
        } else {
          console.log("Not Yet");
        }
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
    setBoardData(
      SudokuHelper.analyzeBoardData(
        SudokuHelper.createSudokuBoardData(board, boardSolution)
      )
    );
  };

  const handleTogglePencil = () => {
    setPencilMode((pencilMode) => !pencilMode);
  };

  const handleHint = () => {
    handleNumberSelect(boardData[selectedCell.row][selectedCell.col].answer);
  };

  const handleRefresh = () => {
    showDifficultyModal();
  };

  const handleDifficultyRefresh = (difficulty) => {};

  const isCellValid = (cell) => {
    return cell != 0 && cell != null;
  };

  const isCellCorrect = (cell, row, col) => {
    return soluton[row][col] === cell;
  };

  const autoSolve = () => {
    let currentBoard = JSON.parse(JSON.stringify(board));
    let solvedBoard = SudokuHelper.solveSudoku(
      JSON.parse(JSON.stringify(currentBoard))
    );

    let intervalId = setInterval(() => {
      console.log(
        "Checking interal: " +
          JSON.stringify(SudokuHelper.analyzeBoard(currentBoard))
      );
      let nextMove = SudokuHelper.analyzeBoard(currentBoard).nextMove;

      if (nextMove) {
        console.log("Checking next move");
        currentBoard = SudokuHelper.setCellValue(
          board,
          nextMove.row,
          nextMove.col,
          nextMove.value
        );
        // render current board
        console.log("Setting current board");
        setBoard(currentBoard);
      } else {
        clearInterval(intervalId);
      }
      console.log("Checking next move after");

      if (SudokuHelper.isEqual(currentBoard, solvedBoard)) {
        console.log("Board is solved");
        clearInterval(intervalId);
        // display message that the puzzle has been solved
      }
    }, 500);
  };

  const handleAdvancedHint = () => {
    const nextMove = SudokuHelper.analyzeBoard(board);
    setHint(
      "Next best move is row: " +
        (nextMove.nextMove.row + 1) +
        " ; col: " +
        (nextMove.nextMove.col + 1) +
        " ; value: " +
        nextMove.nextMove.value +
        "\n Reason: " +
        nextMove.reason
    );
  };

  const getRemainingNumber = (number) => {
    return "1";
  };

  const showDifficultyModal = () => {
    setDifficultyModalVisible(true);
  };

  const hideDifficultyModal = () => {
    setDifficultyModalVisible(false);
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
          <TouchableOpacity onPress={handleAdvancedHint}>
            <Text style={styles.button}>Advanced Hint</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={autoSolve}>
            <Text style={styles.button}>AutoSolve</Text>
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
        <View style={styles.hint}>
          <Text>{hint}</Text>
        </View>

        <Modal
          visible={difficultyModalVisible}
          onRequestClose={hideDifficultyModal}
        >
          <View style={styles.difficultyModal}>
            <Text>Modal Content Here</Text>
            <View style={styles.modalContent}>
              <TouchableOpacity>
                <Text style={styles.button}>easy</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.button}>medium</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.button}>hard</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.button}>extreme</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={hideDifficultyModal}>
              <Text style={styles.button}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
    width: 35,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  modalButtonText: {
    fontSize: 20,
  },
  hint: {
    paddingTop: 30,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
