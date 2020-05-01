const Appointment = require("../model/Appointment");
const Terminal = require("../model/Terminal");

const getAppointmentById = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const appointment = await Appointment.findById(appointmentId).select(
      "-__v"
    );
    return res.status(200).send(appointment);
  } catch (err) {
    return res.status(400).send({ error: "Invalid appointment ID." });
  }
};

const getTerminalById = async (req, res) => {
  const { terminalId } = req.params;
  try {
    const terminal = await Terminal.findById(terminalId).select("-__v");
    return res.status(200).send(terminal);
  } catch (err) {
    return res.status(400).send({ error: "Invalid Terminal ID." });
  }
};

const deleteTerminal = async (req, res) => {
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { terminalId } = req.params;
  try {
    await Terminal.findById(terminalId);
  } catch (err) {
    return res.status(400).send({ error: "Invalid Terminal Id." });
  }
  if (terminal.status == "DELETED") {
    return res.status(400).send({ error: "The Terminal is already Deleted." });
  }
  try {
    await Terminal.findByIdAndUpdate(terminalId, {
      status: "DELETED",
    });
    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: "Failed to update Terminal." });
  }
};

module.exports.getAppointmentById = getAppointmentById;
module.exports.getTerminalById = getTerminalById;
module.exports.deleteTerminal = deleteTerminal;
