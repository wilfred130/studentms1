const { DataTypes } = require("sequelize")
const {sequelize} = require(`../configs/dbConnections`)


const Student = sequelize.define(`Student`, {
    studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = Student;