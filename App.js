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

export default function App() {
  const initialBoard = SudokuHelper.generatePuzzle("easy");
  const initialBoardRef = JSON.parse(JSON.stringify(initialBoard));
  const sudokuSolution = SudokuHelper.solveSudoku(JSON.parse(JSON.stringify(initialBoard)));
  const sudokuData = (SudokuHelper.createSudokuBoardData(
    initialBoard,
    sudokuSolution
  ));

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
  const [isGameSolved, setIsGameSolved] = useState(false);

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
      if (selectedCell == null) {
        console.log("Not setting number due to no selected cell");
        return;
      }
      console.log("Setting number: " + number);
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
        setIsGameSolved(true);
        handleRefresh();
      } else {
        console.log("Not Yet");
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

  const handleDifficultyRefresh = (difficulty) => {
    const initialBoard = SudokuHelper.generatePuzzle(difficulty);
    const initialBoardRef = JSON.parse(JSON.stringify(initialBoard));
    const sudokuSolution = SudokuHelper.solveSudoku(
      JSON.parse(JSON.stringify(initialBoard))
    );
    const sudokuData = SudokuHelper.createSudokuBoardData(
      initialBoard,
      sudokuSolution
    );

    setBoard(initialBoard);
    setBoardData(sudokuData);
    setHint("");
    setDifficultyModalVisible(false);
    setPencilMode(false);
    setHistory([[...initialBoard]]);
    setCurrentStep(0);
    setBoardSolution(sudokuSolution);

    setSelectedNumber(null);
    setSelectedCell(null);
  };

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
    if (nextMove.nextMove != null) {
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
    } else {
      setHint("No best move detected");
    }

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
          style={styles.difficultyModal}
          onRequestClose={hideDifficultyModal}
        >
          <View style={styles.difficultyModalContent}>
            {isGameSolved && <Text>You won! Try again?</Text>}
            <Text>Select new difficulty</Text>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => handleDifficultyRefresh('supereasy')}>
                <Text style={styles.button}>ezpz</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDifficultyRefresh('easy')}>
                <Text style={styles.button}>easy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDifficultyRefresh('medium')}>
                <Text style={styles.button}>medium</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDifficultyRefresh('hard')}>
                <Text style={styles.button}>hard</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDifficultyRefresh('extreme')}>
                <Text style={styles.button}>extreme</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDifficultyRefresh('hell')}>
                <Text style={styles.button}>hell</Text>
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
  difficultyModal: {
    alignItems: "center",
    justifyContent: 'flex-end'
  },
  difficultyModalContent: {
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: 'white',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContent: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  modalButton: {
    width: 36,
    height: 65,
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
