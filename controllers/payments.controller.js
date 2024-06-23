const Payments = require(`../models/payments.model`)
const Student = require("../models/student.model")
const Finance = require("../models/finance.model")


exports.GetLedger = async(req, res) => {
    try {
        const payments = await Payments.findAll({
            include: {
                model: Student,
                attributes: [
                    'firstName',
                    'lastName',
                    'email',
                    'year',
                    'createdAt',
                    'gender'
                ],
                
            },
            attributes: [
                'studentId',
                'totalAmount',
                'updatedAt'
            ]
        })
        res.send({
            status: `Successful`,
            status_code: 200,
            result: payments
        })
    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Failed to get payments`
        })
    }
}

exports.GetStudentBalances = async(req, res) => {
    try {
        const totalAmountDue = req.params.totalAmountDue
        
        const payments = await Payments.findAll({
            include: {
                model: Student,
                attributes: [
                    `firstName`,
                    `lastName`,
                    `email`,
                    'year',
                    'email',
                    'updatedAt'
                ]
            }
        })
        var total_balance  = 0
        var totalPaid = 0
        const studentBalances = payments.map(payment => {
            const balance = totalAmountDue - payment.totalAmount
            total_balance  += balance
            totalPaid += payment.totalAmount
            return {
                studentId: payment.studentId,
                Student: payment.Student,
                totalAmount: payment.totalAmount,
                balance
            }
        })
        
        console.log(total_balance)
        res.send({
            status: `Success`,
            status_code: 200,
            total_amount_paid: totalPaid,
            total_balance: total_balance,
            result: studentBalances
        })
    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Failed to get student balances`
        })
    } 
}

exports.getBalanceForOneStudent = async(req, res) => {
    try {
        const studentId = req.params.studentId
        const totalAmountDue = req.params.totalAmountDue

        const payment = await Payments.findOne({
            include: {
                model: Student,
                attributes: [`firstName`, `lastName`, `email`]
            },
            where: {studentId: studentId},
            attributes: [`totalAmount`, `studentId`]
        })

        if(payment == null) {
            res.send({
                status: `Failed`,
                status_code: 404,
                result: `Student does not exist`
            })
            return
        }
        const balance = totalAmountDue - payment.totalAmount
        res.send({
            status: `Success`,
            status_code: 200,
            result: {
                payment,
                balance
            }
        })
    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Failed to fetch balance of the student`
        })
    }
}