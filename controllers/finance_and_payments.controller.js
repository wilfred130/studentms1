const Payments  = require(`../models/payments.model`)
const Finance = require(`../models/finance.model`)

exports.makeTransaction = async(req, res) => {
    try {
        const newTranscation = {
            amount: req.body.amount,
            studentId: req.body.studentId
        }

        const transaction = await Finance.create(newTranscation)

        const studentId = req.body.studentId

        totalPayment = await Finance.sum(`amount`, {
            where: {studentId: studentId}
        })

        const studentIdCount = await Payments.count({
            where: {studentId: studentId}
        })

        if(studentIdCount > 0) {
            try {
                const result = await Payments.update({totalAmount: totalPayment}, {
                    where: {studentId: studentId}
                })
                
            } catch (error) {
                res.send({
                    status: `Error`,
                    status_code: 404,
                    message: error.message,
                    result: `Failed to update payment successfully`
                })
                return
            }
            
        }else {
            try {

                const newPayment = {
                    totalAmount: totalPayment,
                    studentId: studentId
                }
                const addedPayment  = await Payments.create(newPayment)
                
            } catch (error) {
                res.send({
                    status: `Failed`,
                    status_code: 404,
                    message: error.message,
                    result: `Failed to create payment successfully`
                })
                
                return
            }
            
        }

        res.send({
            status: `Success`,
            status_code: 200,
            result: transaction
        })

    } catch (error) {
        res.send({
            status: `Error`,
            status_code: 500,
            message: error.message,
            result: `Failed to register the payment`
        })
    }
}