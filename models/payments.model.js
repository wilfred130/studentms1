const { DataTypes } = require("sequelize")
const {sequelize} = require(`../configs/dbConnections`)
const Student = require("./student.model")

const Payment = sequelize.define(`Payment`, {
    paymentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    totalAmount: {
        type: DataTypes.FLOAT
    },
    studentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Student,
            key: `studentId`
        }
    }
})

Payment.belongsTo(Student, {foreignKey: `studentId`})
Student.hasOne(Payment, {foreignKey: `studentId`})

module.exports = Payment;