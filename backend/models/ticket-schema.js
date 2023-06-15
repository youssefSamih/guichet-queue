const mongoose = require("mongoose");
const User = require("./user");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  numero: {
    type: Number,
    required: true,
  },
  desk: {
    type: Number,
    required: true,
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const TicketModel = mongoose.model("Ticket", TicketSchema);

module.exports = TicketModel;
