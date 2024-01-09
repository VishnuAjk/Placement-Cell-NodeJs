const User = require('../models/userSchema');
const Student = require('../models/studentSchema');
const fs = require('fs');
const fastcsv = require('fast-csv');

// render sign up page
module.exports.signup = function (req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('back');
	}
	res.render('signup');
};

// render sign in page
module.exports.signin = function (req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('back');
	}
	res.render('signin');
};

// create session
module.exports.createSession = function (req, res) {
	console.log('Session created successfully');
	return res.redirect('/');
};

// signout
module.exports.signout = function (req, res) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
	});
	return res.redirect('/users/signin');
};

// create user
module.exports.createUser = async function (req, res) {
	const { name, email, password, confirmPassword } = req.body;
	try {
		if (password !== confirmPassword) {
			console.log(`Passwords dont match`);
			return res.redirect('back');
		}
		const user = await User.findOne({ email });

		if (user) {
			console.log(`Email already exists`);
			return res.redirect('back');
		}

		const newUser = await User.create({
			name,
			email,
			password,
		});

		await newUser.save();

		if (!newUser) {
			console.log(`Error in creating user`);
			return res.redirect('back');
		}

		return res.redirect('/users/signin');
	} catch (error) {
		console.log(`Error in creating user: ${error}`);
		res.redirect('back');
	}
};

// Download report in CSV format
module.exports.downloadCsv = async function (req, res) {
	try {
		const students = await Student.find({});
		
		let csv = 'S.No, Name, Email, College, Placement, Contact Number, Batch, DSA Score, WebDev Score, React Score, Interview, Date, Result\n';
	
		students.forEach(function(student, index) {
		  csv += `${index + 1},${student.name},${student.email},${student.college},${student.placement},${student.contactNumber},${student.batch},${student.dsa},${student.webd},${student.react}`;
	
		  if (student.interviews.length > 0) {
			student.interviews.forEach(function(interview) {
			  csv += `,${interview.company},${interview.date.toString()},${interview.result}`;
			});
		  }
	
		  csv += '\n';
		});
	
		fs.writeFile('report/data.csv', csv, function(error) {
		  if (error) {
			console.log(error);
			return res.redirect('back');
		  }
		  console.log('Report generated successfully');
		  return res.download('report/data.csv');
		});
	  } catch (error) {
		console.log(`Error in downloading file: ${error}`);
		return res.redirect('back');
	  }
};
