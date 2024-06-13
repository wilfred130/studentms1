const {Sequelize} = require(`sequelize`)
const {dbConfigs} = require(`./db_cofigs`)


const sequelize = new Sequelize(
    dbConfigs.dev.database,
    dbConfigs.dev.username,
    dbConfigs.dev.password,
    {
        host: dbConfigs.dev.host,
        port: dbConfigs.dev.port,
        dialect: dbConfigs.dev.dialect
    }
)

// test connection

const testConnection = async() => {
    try {
        sequelize.authenticate()
        console.log(`Database connection successful`);
    } catch (error) {
        console.log(error.message)
        console.log(`Database connection failed`)
        
    }
}

// sync
sequelize.sync({force: false}).then(data => {
    console.log(`Database synced successfully`)
}).catch(err => {
    console.log(`Database failed to sync`)
})

module.exports = {
    sequelize, 
    testConnection
}