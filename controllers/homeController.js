const Student = require('../models/studentSchema');

// render home page
module.exports.homePage = async function (req, res) {
 
  return res.render('home');
  
};
