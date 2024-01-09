const express = require('express');
const passport = require('passport');

const router = express.Router();

const studentController = require('../controllers/studentController');

// ------------------ Get requests ------------
router.get('/home', passport.checkAuthentication, studentController.StudentPage);

router.get('/create', passport.checkAuthentication, studentController.createStudentPage);

router.get('/delete/:id', passport.checkAuthentication, studentController.deleteStudent);

// ------------------- Posts Requests ----------
router.post('/create-student', passport.checkAuthentication, studentController.createStudent);

module.exports = router;
