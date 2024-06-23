const express = require(`express`)
const bodyParser  = require(`body-parser`)
const {sequelize, testConnection} = require(`../configs/dbConnections`)

const app = express()
const port = 8096

// db authetication
testConnection

//middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//routers
const studentRouters = require(`../routers/student.routes`)
const financeRouter = require(`../routers/finance.routes`)
const paymentRouter  = require(`../routers/payment.routes`)


// routes
app.use(`/student`, studentRouters)
app.use('/finance', financeRouter)
app.use(`/payment`, paymentRouter)

app.listen(port, () => {
    console.log(`App runnin on port ${port}`);
})