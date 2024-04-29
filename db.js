const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/TipTop?directConnection=true&readPreference=primary';

const connectToMongo = async () => {
    await mongoose.connect(mongoURI).then(() => console.log("Connected to MongoDB Successfully"))
}

module.export = connectToMongo();