const mongoose = require('mongoose');
const db =  (req, res) => {
    
    const databaseUser = process.env.DATABASE_USER;
    const databasePassword = process.env.DATABASE_PASSWORD;
    const databaseName = process.env.DATABASE_NAME;

    console.log(databaseUser,databasePassword, databaseName );

    const str = `mongodb+srv://${databaseUser}:${databasePassword}@cluster0.bq09y.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;
    

    mongoose.connect(str, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
    
}

module.exports = db();