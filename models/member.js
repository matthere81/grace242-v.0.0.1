var mongoose = require("mongoose");

var memberSchema = new mongoose.Schema({
  name: String,
  firstName: String,
  partnerName: String,
  numOfChildren: Number,
  email: String,
  image: String,
  tel: String,
  aboutUs: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Member", memberSchema);

//======== Schema Setup ========
// var memberSchema = new mongoose.Schema({
//   family_name: String,
//   first_name: String,
//   // spouseName: String,
//   // children: { type: Number },
//   // email: String,
//   // tel: String,
//   // image: String,
// //   about: String,
//   author: {
//       id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User"
//       },
//       username: String,
//   }, 
//     comments: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Comment"
//       }
// ]
// });

// module.exports = mongoose.model("Member", memberSchema);  