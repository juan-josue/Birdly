// Connect to MongoDB database
const mongoose = require("mongoose");

// Async function to be called by the server to connect the app to mongodb
const connectDB = async () => {
  try {
    //MongoDB connection string
    const con = await mongoose.connect(process.env.MONGO_URI, {
      // Stops unwanted warnings in the console
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useFindAndModify: false,
    //   useCreateIndex: true
    });

    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
