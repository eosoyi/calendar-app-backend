const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN),
      {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //useCreateIndex: true,
      };
    console.log("BD ONLINE...");
  } catch (error) {
    console.log(error);
    throw new Error("error al inicializar DB");
  }
};

module.exports = {
  dbConnection,
};
