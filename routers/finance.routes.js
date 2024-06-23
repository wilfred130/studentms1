const express = require(`express`)
const Finance = require(`../models/finance.model`)
const financeAndPaymentContoller = require(`../controllers/finance_and_payments.controller`)
const financeController = require(`../controllers/finance.controller`)


const financeRouter = express.Router()

financeRouter.post(`/makeTransaction`, financeAndPaymentContoller.makeTransaction)
financeRouter.get(`/getTransactionHistory`, financeController.GetTransactionHistory)
financeRouter.get(`/getInstallmentsByStudent/:studentId`, financeController.GetInstallmentsByStudent)
financeRouter.get(`/getTransactionsByDate/:startDate/:endDate`,financeController.getPaymentsInGivenDateRange)
financeRouter.put(`/updateTransactionById/:financeId`, financeController.updateTransactionByID)
financeRouter.delete(`/deleteTransactionById/:financeId`, financeController.deleteTransactionById)
financeRouter.get('/getTotalPaymentByYear', financeController.getTotalPaymentsByYear)


module.exports = financeRouter;