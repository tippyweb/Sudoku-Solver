'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      // check if any of the required fields is missing
      if (!puzzle || !coordinate || !value ) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // check if the coordinate is valid
      const validRows = ['A','B','C','D','E','F','G','H','I'];
      const validNums = ['1','2','3','4','5','6','7','8','9'];
      const [row, col] = coordinate.split("");
      if (!validRows.includes(row) || !validNums.includes(col) ||
           coordinate.length > 2) {
        return res.json({ error: 'Invalid coordinate'});
      }

      // check if the value is valid
      if (!validNums.includes(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // check if the puzzle string is valid
      const result = solver.validate(puzzle);

      // error is found
      if (result != "validated") {
        return res.json(result);
      }

      // check if the value is already placed in the puzzle
      const isValueAlreadyPlaced = solver.valueAlreadyPlaced(puzzle, coordinate, value);

      if (isValueAlreadyPlaced) {
        const result = solver.validate(puzzle);

        // puzzle is validated
        if (result === "validated") {       
          return res.json({valid: true});

        // error is found
        } else {
          return res.json({valid: false});
        }

      // value is not placed in the puzzle yet
      } else {
        const checkResult = solver.checkPlacement(puzzle, coordinate, value);
        return res.json(checkResult);
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      // puzzle is missing
      if (!req.body.puzzle || req.body.puzzle === "" || 
          req.body.puzzle.length === 0) {
        return res.json({ error: 'Required field missing' });
      }

      const puzzle = req.body.puzzle;
      
      // validate the puzzle string
      const result = solver.validate(puzzle);

      // error is found
      if (result != "validated") {
        return res.json(result);
      }

      // solve the puzzle     
      const solvedPuzzle = solver.solve(puzzle);
      res.json({solution: solvedPuzzle[0]});

    });
};
