var fs = require("fs");

const Ticket = require("./ticket");

const TicketModel = require("./ticket-schema");

// const ticketJsonData = require("../data/ticket-data.json");

class TicketList {
  constructor() {
    this.lastNumber = 0;

    this.getLatestTicket();

    this.patients = [];
    this.assigned = [];
  }

  async getLatestTicket() {
    try {
      const latestTicket = await TicketModel.find({})
        .select("numero")
        .sort({ date: -1 })
        .limit(1);

      if (latestTicket?.length) {
        this.lastNumber = latestTicket[0].numero;
      }
    } catch (error) {
      this.lastNumber = 0;
    }
  }

  get nextNumber() {
    this.lastNumber++;
    return this.lastNumber;
  }

  // 3 to be seen on cards and 10 in history
  get lastTickets() {
    return this.assigned.slice(0, 13);
  }

  createTicket() {
    const newTicket = new Ticket(this.nextNumber);

    this.patients.push(newTicket);

    return newTicket;
  }

  assignTicket(userData) {
    if (this.patients.length === 0) {
      return null;
    }

    const nextTicket = this.patients.shift();

    nextTicket.agent = userData.id;

    nextTicket.desk = userData.desk;

    const ticket = new TicketModel(nextTicket);

    ticket.save();

    this.assigned.unshift({
      ...nextTicket,
      logName: userData?.logName,
      imgProfile: userData?.imgProfile,
    });

    return nextTicket;
  }
}

module.exports = TicketList;
