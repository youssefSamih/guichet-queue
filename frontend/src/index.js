import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { TicketApp } from "./TicketApp";

require("dotenv").config();

ReactDOM.createRoot(document.getElementById("root")).render(<TicketApp />);
