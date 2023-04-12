export const analyzeBoard = (board) => {
  let bestMove;
  let reason;

  // Strategy 1: Find cells with only one possible value
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        const row = board[i];
        const col = board.map((row) => row[j]);
        const box = getBoxValues(board, i, j);
        const candidates = getCandidates(row, col, box);
        if (candidates.length === 1) {
          bestMove = [i, j, candidates[0]];
          reason = `Cell (${i},${j}) has only one possible value: ${candidates[0]}`;
          return { bestMove, reason };
        }
      }
    }
  }

  // Strategy 2: Check for Naked Single, Hidden Single, Naked Pairs, etc.
  // Check for naked singles
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        const possibleValues = getPossibleValues(board, i, j);
        if (possibleValues.length === 1) {
          nextMove = { row: i, col: j, value: possibleValues[0] };
          reason = "Naked single";
          return { nextMove, reason };
        }
      }
    }
  }

  // Check for hidden singles
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        const possibleValues = getPossibleValues(board, i, j);
        for (let k = 0; k < possibleValues.length; k++) {
          if (isHiddenSingle(board, i, j, possibleValues[k])) {
            nextMove = { row: i, col: j, value: possibleValues[k] };
            reason = "Hidden single";
            return { nextMove, reason };
          }
        }
      }
    }
  }

  // Check for naked pairs
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        const possibleValues = getPossibleValues(board, i, j);
        if (possibleValues.length === 2) {
          for (let k = i; k < board.length; k++) {
            for (let l = 0; l < board[k].length; l++) {
              if (board[k][l] === 0 && k !== i && l !== j) {
                const otherPossibleValues = getPossibleValues(board, k, l);
                if (
                  otherPossibleValues.length === 2 &&
                  JSON.stringify(possibleValues) ===
                    JSON.stringify(otherPossibleValues)
                ) {
                  // Naked pair found
                  const commonValues = getCommonValuesInRowOrColumn(
                    board,
                    i,
                    j,
                    k,
                    l
                  );
                  if (commonValues.includes(possibleValues[0])) {
                    nextMove = { row: i, col: j, value: possibleValues[1] };
                  } else {
                    nextMove = { row: i, col: j, value: possibleValues[0] };
                  }
                  reason = "Naked pair";
                  return { nextMove, reason };
                }
              }
            }
          }
        }
      }
    }
  }

  // Check for X-Wing
  const xwingResult = checkForXWing(board);
  if (xwingResult) {
    nextMove = xwingResult.move;
    reason = `X-Wing in rows ${xwingResult.rows} and columns ${xwingResult.cols} with value ${xwingResult.value}`;
  }

  // Check for Swordfish
  const swordfishResult = checkForSwordfish(board);
  if (swordfishResult) {
    nextMove = swordfishResult.move;
    reason = `Swordfish in rows ${swordfishResult.rows} and columns ${swordfishResult.cols} with value ${swordfishResult.value}`;
  }

  // Check for Finned X-Wing
  const finnedXwingResult = checkForFinnedXWing(board);
  if (finnedXwingResult) {
    nextMove = finnedXwingResult.move;
    reason = `Finned X-Wing in rows ${finnedXwingResult.rows} and columns ${finnedXwingResult.cols} with value ${finnedXwingResult.value} and fin ${finnedXwingResult.fin}`;
  }

  // If no moves found, return null
  return { bestMove: null, reason: "Cannot find the next best move." };
};

// Helper functions
export const getBoxValues = (board, row, col) => {
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  const box = [];
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      box.push(board[i][j]);
    }
  }
  return box;
};

export const getCandidates = (row, col, box) => {
  const filledValues = [...row, ...col, ...box].filter((val) => val !== 0);
  const allValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return allValues.filter((val) => !filledValues.includes(val));
};

// Returns the values that are common to all cells in the given row or column
export const getCommonValuesInRowOrColumn = (
  board,
  rowOrColumnIndex,
  isRow
) => {
  const values = {};
  for (let i = 0; i < 9; i++) {
    const cell = isRow
      ? board[rowOrColumnIndex][i]
      : board[i][rowOrColumnIndex];
    if (cell !== 0) {
      values[cell] = true;
    }
  }
  return Object.keys(values).map((value) => parseInt(value));
};

// Returns true if the given cell is a hidden single
export const isHiddenSingle = (board, row, col, value) => {
  const rowValues = getCommonValuesInRowOrColumn(board, row, true);
  const colValues = getCommonValuesInRowOrColumn(board, col, false);
  const boxValues = getBoxValues(board, row, col);

  // If the value is not present in any other cell in the row, column, or box,
  // then this cell is a hidden single for that value
  return (
    !rowValues.includes(value) &&
    !colValues.includes(value) &&
    !boxValues.includes(value)
  );
};

// Returns an array of all possible values for the given cell
export const getPossibleValues = (board, row, col) => {
  if (board[row][col] !== 0) {
    // Cell already has a value
    return [board[row][col]];
  }

  // Determine which values are already used in the row, column, and box
  const usedValues = [
    ...getCommonValuesInRowOrColumn(board, row, true),
    ...getCommonValuesInRowOrColumn(board, col, false),
    ...getBoxValues(board, row, col),
  ];

  // Determine which values are possible for this cell
  const possibleValues = [];
  for (let i = 1; i <= 9; i++) {
    if (!usedValues.includes(i)) {
      possibleValues.push(i);
    }
  }

  return possibleValues;
};

export const checkForXWing = (board) => {
  // Check rows for X-Wing
  for (let row = 0; row < 9; row++) {
    const rowValues = getRowValues(board, row);
    const candidateCols = getCandidateCols(rowValues);
    if (candidateCols.length === 2) {
      const col1 = candidateCols[0];
      const col2 = candidateCols[1];
      const col1Values = getColumnValues(board, col1);
      const col2Values = getColumnValues(board, col2);
      const value = getCommonValues(col1Values, col2Values);
      if (value.length === 1) {
        const rows = getRowsWithValueInCols(board, value, [col1, col2]);
        if (rows.length === 2) {
          const move = {
            row: rows[0],
            col: col1,
            value: value[0],
          };
          return {
            move,
            rows: [rows[0], rows[1]],
            cols: [col1, col2],
            value: value[0],
          };
        }
      }
    }
  }

  // Check columns for X-Wing
  for (let col = 0; col < 9; col++) {
    const colValues = getColumnValues(board, col);
    const candidateRows = getCandidateRows(colValues);
    if (candidateRows.length === 2) {
      const row1 = candidateRows[0];
      const row2 = candidateRows[1];
      const row1Values = getRowValues(board, row1);
      const row2Values = getRowValues(board, row2);
      const value = getCommonValues(row1Values, row2Values);
      if (value.length === 1) {
        const cols = getColsWithValueInRows(board, value, [row1, row2]);
        if (cols.length === 2) {
          const move = {
            row: row1,
            col: cols[0],
            value: value[0],
          };
          return {
            move,
            rows: [row1, row2],
            cols: [cols[0], cols[1]],
            value: value[0],
          };
        }
      }
    }
  }

  return null;
};

const getSFRowValues = (board, value) => {
  const rowValues = [];

  for (let i = 0; i < 9; i++) {
    if (board[i].includes(value)) {
      rowValues.push(i);
    }
  }

  return rowValues;
};

export const getSFColsWithValue = (board, value) => {
  const cols = [];
  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board.length; i++) {
      if (board[i][j] === value) {
        cols.push(j);
        break;
      }
    }
  }
  return cols;
};

export const checkForSwordfish = (board) => {
  for (let value = 1; value <= 9; value++) {
    const candidateCols = getCandidateCols(getSFRowValues(board, value));
    const candidateRows = getCandidateRows(getColumnValues(board, value));

    if (candidateCols.length === 3 && candidateRows.length > 0) {
      const rowsWithValueInCols = getRowsWithValueInCols(
        board,
        candidateCols,
        value
      );
      if (rowsWithValueInCols.length === candidateRows.length) {
        const cols = candidateCols.join("");
        const rows = candidateRows.join("");
        const move = { type: "removeCandidate", cells: [] };
        for (let r = 0; r < 9; r++) {
          if (!rows.includes(r.toString())) {
            continue;
          }
          for (let c = 0; c < 9; c++) {
            if (!cols.includes(c.toString()) || board[r][c] !== 0) {
              continue;
            }
            if (hasCandidate(board, r, c, value)) {
              move.cells.push({ row: r, col: c, value });
            }
          }
        }
        if (move.cells.length > 0) {
          return { move, rows: candidateRows, cols: candidateCols, value };
        }
      }
    }
  }
  return null;
};

export const checkForFinnedXWing = (board) => {
  for (let value = 1; value <= 9; value++) {
    // Check for rows with 2 or 3 occurrences of the value
    const rowsWithValue = getSFRowValues(board, value);
    if (rowsWithValue.length < 2 || rowsWithValue.length > 3) {
      continue;
    }

    // Check for columns with 2 or 3 occurrences of the value
    const colsWithValue = getSFColsWithValue(board, value);
    if (colsWithValue.length < 2 || colsWithValue.length > 3) {
      continue;
    }

    // Check for fins (a cell in a row that is not in a column with value, or vice versa)
    const fins = [];
    for (let row of rowsWithValue) {
      for (let col of colsWithValue) {
        const cellValue = board[row][col];
        if (cellValue === 0) {
          // Check if this cell is a fin
          const otherValuesInRow = getRowValues(board, row).filter(
            (v) => v !== value
          );
          const otherValuesInCol = getColumnValues(board, col).filter(
            (v) => v !== value
          );
          if (
            otherValuesInRow.includes(value) &&
            !otherValuesInCol.includes(value)
          ) {
            fins.push({ row, col });
          } else if (
            !otherValuesInRow.includes(value) &&
            otherValuesInCol.includes(value)
          ) {
            fins.push({ row, col });
          }
        }
      }
    }
    if (fins.length === 0) {
      continue;
    }

    // Check for X-Wing pattern with the remaining cells
    const candidateCols = getCandidateCols(rowsWithValue, colsWithValue);
    const candidateRows = getCandidateRows(colsWithValue, rowsWithValue);
    if (candidateCols.length === 2 && candidateRows.length === 2) {
      // Found a Finned X-Wing!
      const move = { row: null, col: null, value };
      const rows = candidateRows;
      const cols = candidateCols;
      const fin = fins[0];
      return { move, rows, cols, value, fin };
    }
  }
  return null;
};

// Helper function to get values of a given column
export const getColumnValues = (board, col) => {
  return board.map((row) => row[col]);
};

// Helper function to get the row numbers in which a given value is a candidate
export const getCandidateRows = (colValues) => {
  // const getCandidateRows = (board, value, cols) => {
  //   const rows = [];
  //   cols.forEach((col) => {
  //     board.forEach((row, i) => {
  //       if (row[col].candidates.includes(value)) {
  //         rows.push(i);
  //       }
  //     });
  //   });
  //   return Array.from(new Set(rows));

  const candidateRows = [];
  const usedRows = new Set();

  colValues.forEach((value, row) => {
    if (value !== null) {
      usedRows.add(row);
    }
  });

  for (let row = 0; row < 9; row++) {
    if (usedRows.has(row)) {
      continue;
    }
    const rowValues = getRowValues(board, row);
    if (getCommonValues(rowValues, colValues).length === 0) {
      candidateRows.push(row);
    }
  }

  return candidateRows;
};

// Helper function to get values of a given row
export const getRowValues = (board, row) => {
  return board[row];
};

// Helper function to get common values between two arrays
export const getCommonValues = (arr1, arr2) => {
  return arr1.filter((value) => arr2.includes(value));
};

// Helper function to get columns that have a given value in certain rows
export const getColsWithValueInRows = (board, value, rows) => {
  const cols = [];
  rows.forEach((row) => {
    board[row].forEach((cell, j) => {
      if (cell.value === value) {
        cols.push(j);
      }
    });
  });
  return Array.from(new Set(cols));
};

// Helper function to get the column numbers in which a given value is a candidate
export const getCandidateCols = (rowValues) => {
  const candidateCols = [];
  const usedCols = new Set();

  rowValues.forEach((value, col) => {
    if (value !== null) {
      usedCols.add(col);
    }
  });

  for (let col = 0; col < 9; col++) {
    if (usedCols.has(col)) {
      continue;
    }
    const colValues = getColumnValues(board, col);
    if (getCommonValues(rowValues, colValues).length === 0) {
      candidateCols.push(col);
    }
  }

  return candidateCols;
};

// Helper function to get rows that have a given value in certain columns
export const getRowsWithValueInCols = (board, value, cols) => {
  const rows = [];
  cols.forEach((col) => {
    board.forEach((row, i) => {
      if (row[col].value === value) {
        rows.push(i);
      }
    });
  });
  return Array.from(new Set(rows));
};

// Gets all possible values for a specific sudoku cell.
export const analyzeBoardData = (sudokuData) => {
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
};

export const isEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!Array.isArray(arr1[i]) || !Array.isArray(arr2[i])) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    } else if (!isEqual(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
};

export const setCellValue = (board, row, col, value) => {
  // Create a copy of the board to avoid modifying the original
  const newBoard = JSON.parse(JSON.stringify(board));

  // Update the value at the given row and column
  newBoard[row][col] = value;

  return newBoard;
};

export const solveSudoku = (puzzle) => {
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
};

export const isValid = (board, row, col, num) => {
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
};

export const createSudokuBoardData = (initialBoard, solution) => {
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
};

export const isSudokuComplete = (board) => {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const rowValues = new Set();
    for (let col = 0; col < 9; col++) {
      const cellValue = board[row][col];
      if (cellValue < 1 || cellValue > 9 || rowValues.has(cellValue)) {
        return false;
      }
      rowValues.add(cellValue);
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const colValues = new Set();
    for (let row = 0; row < 9; row++) {
      const cellValue = board[row][col];
      if (colValues.has(cellValue)) {
        return false;
      }
      colValues.add(cellValue);
    }
  }

  // Check 3x3 subgrids
  for (let subgridRow = 0; subgridRow < 9; subgridRow += 3) {
    for (let subgridCol = 0; subgridCol < 9; subgridCol += 3) {
      const subgridValues = new Set();
      for (let row = subgridRow; row < subgridRow + 3; row++) {
        for (let col = subgridCol; col < subgridCol + 3; col++) {
          const cellValue = board[row][col];
          if (subgridValues.has(cellValue)) {
            return false;
          }
          subgridValues.add(cellValue);
        }
      }
    }
  }

  return true;
};

export const generatePuzzle = (difficulty) => {
  const puzzles = {
    easy: 40,
    medium: 35,
    hard: 30,
    extreme: 25,
  };

  const puzzleCount = puzzles[difficulty];
  console.log("puzzleCount: " + puzzleCount + " ; " + difficulty);
  const puzzle = Array.from({ length: 9 }, () => new Array(9).fill(0));

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function solve(puzzle) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) {
          let candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          shuffle(candidates);
          for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            if (isValid(puzzle, row, col, candidate)) {
              puzzle[row][col] = candidate;
              if (solve(puzzle)) {
                return true;
              } else {
                puzzle[row][col] = 0;
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function isValid(puzzle, row, col, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzle[row][i] === value || puzzle[i][col] === value) {
        return false;
      }
    }
    const rowOffset = Math.floor(row / 3) * 3;
    const colOffset = Math.floor(col / 3) * 3;
    for (let i = rowOffset; i < rowOffset + 3; i++) {
      for (let j = colOffset; j < colOffset + 3; j++) {
        if (puzzle[i][j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzle);

  // Remove cells to create the desired difficulty level
  let emptyCount = 81 - puzzleCount;
  while (emptyCount > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      emptyCount--;
    }
  }

  return puzzle;
};

class SudokeCellData {
  constructor(value, pencilValues, answer) {
    this.value = value;
    this.pencilValues = pencilValues;
    this.answer = answer;
  }
}
