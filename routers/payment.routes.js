const Payment  =require(`../models/payments.model`)
const express = require(`express`)
const paymentContoller = require(`../controllers/payments.controller`)
const financeAndPaymentContoller = require(`../controllers/finance_and_payments.controller`)

const paymentRouter = express.Router()


paymentRouter.get(`/getLedger`, paymentContoller.GetLedger)
paymentRouter.get(`/getStudentBalances/:totalAmountDue`, paymentContoller.GetStudentBalances)
paymentRouter.get(`/getBalanceForOneStudent/:studentId/:totalAmountDue`, paymentContoller.getBalanceForOneStudent)

module.exports = paymentRouter;