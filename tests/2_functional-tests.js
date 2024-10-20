const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('1. Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({
            "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.solution, "769235418851496372432178956174569283395842761628713549283657194516924837947381625");
            done();
          });
    });

    test('2. Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field missing');
            done();
        });
    });

    test('3. Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({
            "puzzle": "A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
        });
    });

    test('4. Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({
            "puzzle": "...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
        });
    });

    test('5. Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({
            "puzzle": ".79..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Puzzle cannot be solved');
            done();
        });
    });

    test('6. Check a puzzle placement with all fields: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            "coordinate": "A1",
            "value": "7"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isBoolean(res.body.valid, true);
          done();
      });
    });

    test('7. Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            "coordinate": "A1",
            "value": "6"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict, "column");
          done();
      });
    });

    test('8. Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            "coordinate": "A1",
            "value": "1"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.notStrictEqual(res.body.conflict, [ "row", "column" ]);
          done();
      });
    });

    test('9. Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            "coordinate": "A1",
            "value": "5"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.notStrictEqual(res.body.conflict, [ "row", "column", "region" ]);
          done();
      });
    });

    test('10. Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            "value": "7"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
      });
    });

    test('11. Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            "puzzle": "A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            "coordinate": "A1",
            "value": "7"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
      });
    });

    test('12. Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...",
            "coordinate": "A1",
            "value": "7"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
      });
    });

    test('13. Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            "coordinate": "Z1",
            "value": "7"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
      });
    });

    test('14. Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            "coordinate": "A1",
            "value": "0"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
      });
    });


});


