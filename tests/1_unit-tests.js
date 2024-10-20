/**
 * ######################################################
 *  Sudoku Solver - 2024-10-20
 * ######################################################
 */

const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

suite('Unit Tests', () => {

    test('1. Logic handles a valid puzzle string of 81 characters', function () {
        assert.equal(solver.validate('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'), 'validated');
    });

    test('2. Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
        assert.equal(solver.validate('A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..').error, "Invalid characters in puzzle");
    });

    test('3. Logic handles a puzzle string that is not 81 characters in length', function () {
        assert.equal(solver.validate('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6....').error, "Expected puzzle to be 81 characters long");
    });

    test('4. Logic handles a valid row placement', function () {
        assert.isTrue(solver.checkPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A1', '7').valid, true);
    });

    test('5. Logic handles an invalid row placement', function () {
        assert.include(solver.checkPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A1', '1').conflict, "row");
    });

    test('6. Logic handles a valid column placement', function () {
        assert.isTrue(solver.checkPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A1', '7').valid, true);
    });

    test('7. Logic handles an invalid column placement', function () {
        assert.include(solver.checkPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A1', '1').conflict, "column");
    });

    test('8. Logic handles a valid region (3x3 grid) placement', function () {
        assert.isTrue(solver.checkPlacement('3..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'B3', '1').valid, true);
    });

    test('9. Logic handles an invalid region (3x3 grid) placement', function () {
        assert.include(solver.checkPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'B3', '8').conflict, "region");
    });

    test('10. Valid puzzle strings pass the solver', function () {
        assert.include(solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'), '769235418851496372432178956174569283395842761628713549283657194516924837947381625');
    });

    test('11. Invalid puzzle strings fail the solver', function () {
        assert.equal(solver.validate('.79..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..').error, "Puzzle cannot be solved");
    });

    test('12. Solver returns the expected solution for an incomplete puzzle', function () {
        assert.include(solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'), "769235418851496372432178956174569283395842761628713549283657194516924837947381625");
    });

});
