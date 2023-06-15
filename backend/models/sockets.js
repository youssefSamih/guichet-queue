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
      });

      socket.on("next-ticket-work", (userData, callback) => {
        const suTicket = this.ticketList.assignTicket(userData);

        callback(suTicket);

        this.io.emit(
          "ticket-assigned",
          this.ticketList.lastTickets.map((ticket) => ({
            ...ticket,
            logName: userData?.logName,
          }))
        );
      });
    });
  }
}

module.exports = Sockets;
