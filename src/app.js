const express = require("express");
const cors = require("cors");
require("dotenv").config();


const scanRoutes = require("./routes/scanRoutes");
const leadRoutes = require("./routes/leadRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const emailDraftRoutes = require("./routes/emailDraftRoutes");
const emailPolishRoutes = require("./routes/emailPolishRoutes");



const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api", scanRoutes);
app.use("/api", leadRoutes);
app.use("/api", approvalRoutes);
app.use("/api", emailDraftRoutes);
app.use("/api", emailPolishRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
