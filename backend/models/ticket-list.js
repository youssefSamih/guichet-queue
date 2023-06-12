var fs = require("fs");

const Ticket = require("./ticket");

// const ticketJsonData = require("../data/ticket-data.json");

class TicketList {
  constructor() {
    this.lastNumber = 0;

    this.patients = [];
    this.assigned = [];
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

  assignTicket(agent, desk) {
    if (this.patients.length === 0) {
      return null;
    }

    const nextTicket = this.patients.shift();

    nextTicket.agent = agent;

    nextTicket.desk = desk;

    this.assigned.unshift(nextTicket);

    return nextTicket;
  }
}

module.exports = TicketList;
