const Student = require(`../models/student.model`)
const express = require(`express`)
const studentController = require(`../controllers/student.controllers`)

const studentRouter = express.Router()

studentRouter.get(`/getAllStudents`,studentController.GetAllStudents)
studentRouter.post(`/addStudent`, studentController.AddStudent)
studentRouter.delete('/deleteStudentById/:studentId', studentController.deleteStudent)
studentRouter.put(`/updateStudentById/:studentId`, studentController.updateStudentById)
studentRouter.get(`/getOneStudentById/:studentId`, studentController.getOneStudentById)
studentRouter.get('/authenticateUserByEmailAndPassword/:email/:password', studentController.autheticateUserByEmailAndPassword)


module.exports = studentRouter;