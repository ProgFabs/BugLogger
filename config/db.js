const mongoose = require('mongoose');

const connectDB = async () => {
  try {
      const conn = await mongoose.connect(
        'mongodb+srv://fabs1234:fabs1234@fabscluster.agshs.mongodb.net/buglogger?retryWrites=true&w=majority', 
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true
        }
      )
      console.log('MongoDB connected')
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

module.exports = connectDB;