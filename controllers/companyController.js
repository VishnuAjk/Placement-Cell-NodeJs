const Student = require('../models/studentSchema');
const Company = require('../models/companySchema');

// Render company page
module.exports.companyPage = async function (req, res) {
  try {
    const students = await Student.find({});
    return res.render('company', { students });
  } catch (error) {
    console.log(`Error in rendering page: ${error}`);
    return res.redirect('back');
  }
};

// Allocating interview to a student
module.exports.allocateInterview = async function (req, res) {
  try {
    const students = await Student.find({});

    let array = [];

    for (let student of students) {
      array.push(student.batch);
    }
    // Duplicate batches filtered
    array = [...new Set(array)];

    return res.render('add_interview', { students, array });
  } catch (error) {
    console.log(`Error in allocating interview: ${error}`);
    return res.redirect('back');
  }
};

// Scheduling an interview
module.exports.scheduleInterview = async function (req, res) {
  const { id, company, date } = req.body;
  try {
    const existingCompany = await Company.findOne({ name: company });
    const obj = {
      student: id,
      date,
      result: 'Pending',
    };
  
    if (!existingCompany) {
      const newCompany = await Company.create({
        name: company,
      });
      newCompany.students.push(obj);
      newCompany.save();
    } else {
      for (let student of existingCompany.students) {
      
        if (student.student._id === id) {
          console.log('Interview with this student already scheduled');
          return res.redirect('back');
        }
      }
      existingCompany.students.push(obj);
      existingCompany.save();
    }

    const student = await Student.findById(id);

    if (student) {
      const interview = {
        company,
        date,
        result: 'Pending',
      };
      student.interviews.push(interview);
      student.save();
    }
  
    return res.redirect('/company/home');
  } catch (error) {
    console.log(`Error in scheduling Interview: ${error}`);
    return res.redirect('back');
  }
};

// Update status of interview
module.exports.updateStatus = async function (req, res) {
  const { id } = req.params;
  const { companyName, companyResult } = req.body;
  try {
    const student = await Student.findById(id);
    if (student && student.interviews.length > 0) {
      for (let company of student.interviews) {
        if (company.company === companyName) {
          company.result = companyResult;
          student.save();
          break;
        }
      }
    }
    const company = await Company.findOne({ name: companyName });

    if (company) {
      for (let std of company.students) {
       
        if (std.student.toString() === id) {
          std.result = companyResult;
          company.save();
        }
      }
    }
   
    return res.redirect('back');
  } catch (error) {
    console.log(`Error in updating status: ${error}`);
    res.redirect('back');
  }
};
