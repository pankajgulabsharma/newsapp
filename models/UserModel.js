const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  // confirmpassword: {
  //   type: String,
  //   require: true,
  // },
  avtar: {
    type: String,
    default: "",
  },
  // active: {
  //   type: Boolean,
  //   default: false,
  // },
  // activeToken: String,
  // activeExpires: Date,
});

//.statics are the methods defined on the Model.
//.methods are the methods defined on document or instance or schema

userSchema.methods.matchPassword = async function (enterPassword) {
  // this is the way of writing method in mongoose   (SchemaName.methods.methodName)
  // Note :-> a arrow function or fat arrow function not allowed this keyword thats why we r making this fucntion as a anonymous function
  try {
    return await bcrypt.compare(enterPassword, this.password);
  } catch (error) {
    console.log(error);
  }
};

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      // something modification or changes happining in password filed (NOTE:-> there is ! logical not sign
      next(); // next() method indicates do next after this event (save) don't wait
    }

    console.log(`The current password is ${this.password}`);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`The current password after hash is ${this.password}`);

    // this.confirmpassword = undefined;         // just on user side for password matching with confirmpassword and after doing it undefined it not store on database
  } catch (error) {
    console.log(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
