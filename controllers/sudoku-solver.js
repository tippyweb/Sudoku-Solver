class SudokuSolver {

  validate(puzzleString) {
    // test invalid chars
    if (! /^[1-9\.]+$/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    // test string length
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    // test if the puzzle is valid and can be solved
    // check if the solved puzzle is incomplete
    const result = this.solve(puzzleString);

    if (/\./.test(result[0])) {
      return { error: 'Puzzle cannot be solved' };
    }

    const isValid = this.checkAllRowsColsRegs(result);

    if (!isValid) {
      return { error: 'Puzzle cannot be solved' };
    }

    return "validated";

  }

  checkRowPlacement(twoDArray, row, column, value) {
    const rowArray = this.getRow(twoDArray, row);
    let isConflict = false;

    if (rowArray.includes(Number(value))) {
      isConflict = true;
    }
    return isConflict;
  }

  checkColPlacement(twoDArray, row, column, value) {
    const colArray = this.getCol(twoDArray, column);
    let isConflict = false;

    if (colArray.includes(Number(value))) {
      isConflict = true;
    }
    return isConflict;
  }

  checkRegionPlacement(twoDArray, row, column, value) {
    const regArray = this.getReg(twoDArray, row, column);
    let isConflict = false;

    if (regArray.includes(Number(value))) {
      isConflict = true;
    }
    return isConflict;
  }

  solve(puzzleString) {  
    let puzzleArray = this.create2DArray(puzzleString); 
    let count = this.countDots(puzzleArray);
    let newCount;

    // run this loop while dots exist in the puzzle
    while (count > 0) {

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzleArray[i][j] === '.') {
            const rowArr = this.getRow(puzzleArray, i);
            const colArr = this.getCol(puzzleArray, j);
            const regArr = this.getReg(puzzleArray, i, j);

            const answer = this.solveSudoku(rowArr, colArr, regArr, i, j);

            if (answer > 0) {
              puzzleArray[i][j] = answer;
            }

          }
        }
      }

      // stop the loop if the dot count doesn't decrease
      newCount = this.countDots(puzzleArray);
      if (newCount < count) {
        count = newCount;
      } else {
        break;
      }
    }

    // returning an array of puzzleString and puzzleArray
    return [this.convertArrayToString(puzzleArray), puzzleArray];
    
  }

  create2DArray(puzzleString) {
    const puzzleArray = puzzleString.split("").map((x) => {
      if (!isNaN(x)) {
        return Number(x);
      } else {
        return ".";
      }
    });
    let twoDArray = [];

    for (let i = 0; i < 9; i++) {
      let tempArray = [];
      for (let j = 0; j < 9; j++) {
        tempArray.push(puzzleArray.shift());
      }
      twoDArray.push(tempArray);
    }

    return twoDArray;

  }

  convertArrayToString(puzzleArray) {
    let puzzleString = "";

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        puzzleString += puzzleArray[i][j].toString();
      }
    }
    return puzzleString;

  }

  countDots(puzzleArray) {
    let count = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzleArray[i][j] === '.') {
          count++;
        }
      }
    }
    return count;

  }

  getRow(puzzleArray, row) {
    return puzzleArray[row];
  }

  getCol(puzzleArray, column) {
    let col = [];
    for (let i = 0; i < 9; i++) {
      col.push(puzzleArray[i][column]);
    }
    return col;
  }

  getReg(puzzleArray, row, column) {
    let reg = [];
    let startRow;
    let startCol;

    switch (row) {
      case 0:
      case 1:
      case 2:
        startRow = 0;
        break;
      case 3:
      case 4:
      case 5:
        startRow = 3;
        break;
      case 6:
      case 7:
      case 8:
        startRow = 6;
        break;
      default:
        startRow = 0;
    }

    switch (column) {
      case 0:
      case 1:
      case 2:
        startCol = 0;
        break;
      case 3:
      case 4:
      case 5:
        startCol = 3;
        break;
      case 6:
      case 7:
      case 8:
        startCol = 6;
        break;
      default:
        startRow = 0;
    }

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        reg.push(puzzleArray[i][j]);
      }
    }
    return reg;
  }

  solveSudoku(rowArr, colArr, regArr, row, col) {
    let rowList = [];
    let colList = [];
    let regList = [];
    let tempArray1 = [];
    let tempArray2 = [];
    let answer = 0;

    // new list arrays contain those elements not existing in the original arrays
    for (let i = 0; i < 9; i++) {
      if (!rowArr.includes(i + 1)) {
        rowList.push(i + 1);
      }
    }

    for (let i = 0; i < 9; i++) {
      if (!colArr.includes(i + 1)) {
        colList.push(i + 1);
      }
    }

    for (let i = 0; i < 9; i++) {
      if (!regArr.includes(i + 1)) {
        regList.push(i + 1);
      }
    }

    // if any of the list arrays contain only one element, that is the answer
    if (rowList.length === 1) {
      answer = rowList[0];
    } else if (colList.length === 1) {
      answer = colList[0];
    } else if (regList.length === 1) {
      answer = regList[0];

    // if each list array contains more than one element
    } else {

      // check if rowList and colList have common elements
      for (let i = 0; i < rowList.length; i++) {
        if (colList.includes(rowList[i])) {
          tempArray1.push(rowList[i]);
        }
      }

      // check if row + colLists' common elements also appear in regList
      if (tempArray1.length > 0) {
        for (let i = 0; i < tempArray1.length; i++) {
          if (regList.includes(tempArray1[i])) {
            tempArray2.push(tempArray1[i]);
          }
        }

        // if only one common element is found in all three lists, this is the answer
        if (tempArray2.length === 1) {
          answer = tempArray2[0];
        }
      }

    }
    return answer;

  }

  checkAllRowsColsRegs(puzzleResult) {
    const correctArray = "[1,2,3,4,5,6,7,8,9]";
    const twoDArray = puzzleResult[1];
    let tempArray = [];
    let isValid = true;

    // check all row arrays
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        tempArray.push(twoDArray[i][j]);
      }
      if (correctArray !== JSON.stringify(tempArray.sort())) {
        isValid = false;
        return isValid;
      }
      tempArray = [];
    }

    // check all column arrays
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        tempArray.push(twoDArray[j][i]);
      }
      if (correctArray !== JSON.stringify(tempArray.sort())) {
        isValid = false;
        return isValid;
      }
      tempArray = [];
    }

    // check all region arrays
    // upper left region
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        tempArray.push(twoDArray[i][j]);
      }
    }
    if (correctArray !== JSON.stringify(tempArray.sort())) {
      isValid = false;
      return isValid;
    }
    tempArray = [];

    // upper center region
    for (let i = 0; i < 3; i++) {
      for (let j = 3; j < 6; j++) {
        tempArray.push(twoDArray[i][j]);
      }
    }
    if (correctArray !== JSON.stringify(tempArray.sort())) {
      isValid = false;
      return isValid;
    }
    tempArray = [];

    // upper right region
    for (let i = 0; i < 3; i++) {
      for (let j = 6; j < 9; j++) {
        tempArray.push(twoDArray[i][j]);
      }
    }
    if (correctArray !== JSON.stringify(tempArray.sort())) {
      isValid = false;
      return isValid;
    }
    tempArray = [];

    // center left region
    for (let i = 3; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        tempArray.push(twoDArray[i][j]);
      }
    }
    if (correctArray !== JSON.stringify(tempArray.sort())) {
      isValid = false;
      return isValid;
    }
    tempArray = [];

    // center center region
    for (let i = 3; i < 6; i++) {
      for (let j = 3; j < 6; j++) {
        tempArray.push(twoDArray[i][j]);
      }
    }
    if (correctArray !== JSON.stringify(tempArray.sort())) {
      isValid = false;
      return isValid;
    }
    tempArray = [];

    // center right region
    for (let i = 3; i < 6; i++) {
      for (let j = 6; j < 9; j++) {
        tempArray.push(twoDArray[i][j]);
      }
    }
    if (correctArray !== JSON.stringify(tempArray.sort())) {
      isValid = false;
      return isValid;
    }
    tempArray = [];

    // lower left region
    for (let i = 6; i < 9; i++) {
      for (let j = 0; j < 3; j++) {
        tempArray.push(twoDArray[i][j]);
      }
    }
    if (correctArray !== JSON.stringify(tempArray.sort())) {
      isValid = false;
      return isValid;
    }
    tempArray = [];

    // lower center region
    for (let i = 6; i < 9; i++) {
      for (let j = 3; j < 6; j++) {
        tempArray.push(twoDArray[i][j]);
      }
    }
    if (correctArray !== JSON.stringify(tempArray.sort())) {
      isValid = false;
      return isValid;
    }
    tempArray = [];

    // lower right region
    for (let i = 6; i < 9; i++) {
      for (let j = 6; j < 9; j++) {
        tempArray.push(twoDArray[i][j]);
      }
    }
    if (correctArray !== JSON.stringify(tempArray.sort())) {
      isValid = false;
      return isValid;
    }

    // puzzleString is valid
    return isValid;

  }

  valueAlreadyPlaced(puzzle, coordinate, value) {
    const puzzleArray = puzzle.split("");
    let [rowNum, col] = coordinate.split("");
    let row;

    switch (rowNum) {
      case 'A': row = 0; break;
      case 'B': row = 1; break;
      case 'C': row = 2; break;
      case 'D': row = 3; break;
      case 'E': row = 4; break;
      case 'F': row = 5; break;
      case 'G': row = 6; break;
      case 'H': row = 7; break;
      case 'I': row = 8; break;
      default: row = 0;
    }

    const index = row * 9 + (Number(col) - 1);

    return Number(puzzleArray[index]) === Number(value);

  }

  checkPlacement(puzzleString, coordinate, value) {
    let twoDArray = this.create2DArray(puzzleString);
    let [rowNum, col] = coordinate.split("");
    let row;
    let conflictArray = [];
    let isConflict;

    switch (rowNum) {
      case 'A': row = 0; break;
      case 'B': row = 1; break;
      case 'C': row = 2; break;
      case 'D': row = 3; break;
      case 'E': row = 4; break;
      case 'F': row = 5; break;
      case 'G': row = 6; break;
      case 'H': row = 7; break;
      case 'I': row = 8; break;
      default: row = 0;
    }
    col = Number(col) - 1;

    isConflict = this.checkRowPlacement(twoDArray, row, col, value);
    if (isConflict) {
      conflictArray.push("row");
    }
  
    isConflict = this.checkColPlacement(twoDArray, row, col, value);
    if (isConflict) {
      conflictArray.push("column");
    }
  
    isConflict = this.checkRegionPlacement(twoDArray, row, col, value);
    if (isConflict) {
      conflictArray.push("region");
    }

    if (conflictArray.length > 0) {
      return {valid: false, conflict: conflictArray};
      
    } else {
      return {valid: true};
    }
    
  }

}

module.exports = SudokuSolver;

