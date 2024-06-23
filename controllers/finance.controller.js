const Finance = require(`../models/finance.model`)
const Student = require(`../models/student.model`)
const {Op, where, col, fn, literal} = require(`sequelize`)
const Payments = require(`../models/payments.model`)

exports.GetTransactionHistory = async(req, res) => {
    try {
        const transactions = await Finance.findAll({
            include: {
                model: Student,
                attributes: [
                    'firstName',
                    'lastName',
                    'email',
                    'year',
                    'gender'
                ]
            },
        })
        res.send({
            status: `Success`,
            status_code: 200,
            result: transactions
        })
    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Failed to get transaction history`
        })
    }
}

exports.GetInstallmentsByStudent = async(req, res) => {
    try {
        const studentId = req.params.studentId
        const transactions = await Finance.findAll({

            where: {studentId: studentId},
            attributes: [
                'financeId',
                'amount',
                'createdAt'
            ]
        })

        const studentDetails = await Student.findOne({
            where: {studentId: studentId},
            attributes: [
                'firstName',
                'lastName',
                'email',
                'year',
                'gender',
                'createdAt'
            ]
        })
        
        if(transactions == null){
            res.send({
                staus: `Failed`,
                status_code: 404,
                result: `The requested student doesnot exit`
            })
            return
        }

        res.send({
            status: `Success`,
            status_code: 200,
            details: studentDetails,
            result: transactions
        })
    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Failed to get all students Installments`
        })
    }
}

exports.getPaymentsInGivenDateRange = async(req, res) => {
    try {
        const startDate = req.params.startDate
        const endDate = req.params.endDate
        
        const transactions = await Finance.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        })

        if(transactions == null) {
            res.send({
                status: `Failed`,
                status_code: 404,
                result: `No transaction were performed in the given data range`
            })
            return
        }

        res.send({
            status: `Success`,
            status_code: 200,
            result: transactions
        })
    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Failed to get transactions in the given date range`
        })
    }
}

exports.updateTransactionByID = async(req, res) => {
    try {
        const financeId = req.params.financeId

        const studentIdDetails = await Finance.findByPk(financeId, {
            attributes: [`studentId`]
        })

        // handle missing financial ids

        if( studentIdDetails == null){
            res.send({
                status: `Error`,
                status_code: 404,
                result: `The Finance id does not much to any student`
            })
            return
        }
        
        // get student id
       const studentId = studentIdDetails.studentId

       // read values of updated student
        const result = await Finance.update(req.body, {
            where: {financeId: financeId}
        })

        if(result != 1) {
            res.send({
                status: `Failed`,
                status_code: 404,
                result: `Transaction indexed by ${financeId} doesn't exist`
            })
            return
        }

        const updated = await Finance.findByPk(financeId, {
            include: {
                model: Student,
                attributes: ['firstName', 'lastName', 'email']
            },
            attributes: ['financeId', 'amount', 'studentId']
        })
        
        // update payments to handle changes
        totalAmount = await Finance.sum(`amount`, {
            where: {studentId: studentId}
        })
        console.log(totalAmount)

        try {
            const update = await Payments.update({totalAmount: totalAmount}, {
                where: {studentId: studentId}
            })
            if(update != 1) {
                res.send({
                    status: `Error`,
                    status_code: 404,
                    result: `The student doesnot exist`
                })
                return
            }
        } catch (error) {
            res.send({
                status: `Error`,
                status_code: 500,
                message: error.message,
                result: `Error occurred in updating the student payments`
            })
            return
        }
        res.send({
            status: `Success`,
            status_code: 200,
            result: `Record updated successfully`,
            updated: updated
        });
    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Error in updating the record`
        })
    }
}


exports.deleteTransactionById = async(req, res) => {
    try {
        const financeId = req.params.financeId
        const Transaction = await Finance.findOne({
            where: {financeId: financeId}
        })

        if(Transaction == null) {
            res.send({
                status: `Failed`,
                status_code: 404,
                result: `Finance indexed by ${financeId} does not exit`
            })
            return
        }

        const result = await Transaction.destroy()
        // updating the payment find
        try {
            const studentId = result.studentId

            const totalAmount = await Finance.sum(`amount`, {
                where: {studentId: studentId}
            })

            const update = await Payments.update({totalAmount: totalAmount}, {
                where: {studentId: studentId}
            })

            if(update != 1) {
                res.send({
                    status: `Failed`,
                    status_code: 500,
                    result: `Failed to update student payment`
                })
                return
            }
        } catch (error) {
            res.send({
                status: `Error`,
                status_code: 500,
                message: error.message,
                result: `Error in updating student payment`
            })
        }

        res.send({
            status: `Success`,
            status_code: 200,
            result: result
        })
        
    } catch (error) {
        res.send({
            status: `Error`,
            status_Code: 500,
            message: error.message,
            result: `Error in deleting transaction`
        })
    }
}

exports.getTotalPaymentsByYear = async(req, res) => {
    // performing aggregated query
    try {
        const results = await Finance.findAll({
            attributes: [
                [col('Student.year'), 'year'],
                [fn('SUM', col('amount')), 'totalAmount']
            ],
            include: {
                model: Student,
                attributes: [],
            },
            group: ['Student.year'],
            order: [literal('year ASC')]
        })
        // format results
        const yearlySums = results.map(result => ({
            year: result.get('year'),
            totalAmount: result.get('totalAmount')
        }))

        res.send({
            status: 'Success',
            status_code: 200,
            results: yearlySums
        })
    } catch (error) {
        res.send({
            statas: 'Error',
            status_code: 500,
            message: error.message,
            result: 'Failed to get total Payments'
        })
    }
}