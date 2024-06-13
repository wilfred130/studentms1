const { DataTypes } = require("sequelize")
const {sequelize} = require(`../configs/dbConnections`)
const Student = require(`../models/student.model`)

const Finance = sequelize.define(`Finance`, {
    financeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.FLOAT,
    },
    studentId: {
        type: DataTypes.INTEGER,
        references :{
            model: Student,
            key: `studentId`
        }
    }
})

Student.hasMany(Finance, {foreignKey: `studentId`})
Finance.belongsTo(Student, {foreignKey: `studentId`})

module.exports = Finance