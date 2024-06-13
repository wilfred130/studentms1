const { where } = require("sequelize")
const Student = require(`../models/student.model`)
const studentRouter = require("../routers/student.routes")



exports.GetAllStudents = async(req, res) => {
    try {
        const students = await Student.findAll({
            attributes: [
                'studentId',
                'firstName',
                'lastName',
                'email'
            ]
        })
        res.send({
            status: `Sucess`,
            status_code: 200,
            result: students
        })
    } catch (error) {
        res.send({
            status: `Error`,
            status_Code: 500,
            message: error.message,
            result: `Failed to get list of student`
        })
    }
}

exports.AddStudent = async(req, res) => {
    try {
        const student = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        }

        const newStudent = await Student.create(student)
        
        res.send({
            status: `Sucess`,
            status_code: 200,
            result: newStudent
        })

    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Failed to add student`
        })
    }
}

exports.deleteStudent = async(req, res) => {
    try {
        const studentId = req.params.studentId
        const student = await Student.findOne({
            where: {studentId: studentId}
        })

        if(student == null){
            res.send({
                status: `Failed`,
                status_code: 404,
                result: `The student indexed by ${studentId} does not exist `
            })
            return
        }

        const result = await student.destroy()

        res.send({
            status: `Success`,
            status_code: 200,
            message: `Student is deleted successfully`,
            result: result
        })
    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Error occured in deleting student`
        })
    }
}

exports.updateStudentById = async(req, res) => {
    try {
        const studentId = req.params.studentId
        
        const result  = await Student.update(req.body, {
            where: {studentId: studentId}
        })

        console.log(result)
        
        if(result != 1){
            res.send({
                status: `Failed`,
                status_code: 404,
                result: `Student does not exit `
            })
            return
        }
        const updated = await Student.findOne({
            where: {studentId: studentId},
            attributes: ['firstName', 'lastName', 'email']
        })

        res.send({
            status: `Success`,
            status_code: 200,
            result: result,
            updated: updated
        })
    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Error in updating student`
        })
    }
}

exports.getOneStudentById = async(req, res) => {
    try {
        const studentId = req.params.studentId
        const student = await Student.findOne({
            where: {studentId: studentId},
            attributes: ['firstName', 'lastName', 'email', 'studentId']
        })

        if(student == null){
            res.send({
                status: `Failed`,
                status_code: 404,
                result: `Student does not exit`
            })
            return
        }

        res.send({
            status: `Success`,
            status_code: 200,
            result: student
        })

    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Error in getting student`
        })
    }
}