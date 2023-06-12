const TicketList = require("./ticket-list");

class Sockets {
  constructor(io) {
    this.io = io;

    // Create the instance of our ticket list
    this.ticketList = new TicketList();

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", (socket) => {
      console.log("client connected");

      socket.on("request-ticket", (data, callback) => {
        const newTicket = this.ticketList.createTicket();
        callback(newTicket);
        console.log(newTicket);
      });

      socket.on("next-ticket-work", ({ agent, desk }, callback) => {
        const suTicket = this.ticketList.assignTicket(agent, desk);
        callback(suTicket);
        console.log(suTicket);
        this.io.emit("ticket-assigned", this.ticketList.lastTickets);
      });
    });
  }
}

module.exports = Sockets;
