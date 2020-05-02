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

const getTerminals = async (req, res) => {
  try {
    const terminals = await Terminal.find();
    return res.status(200).send(terminals);
  } catch (err) {
    return res.status(400).send({ error: "Failed to get terminals." });
  }
};

const deleteTerminal = async (req, res) => {
  const { terminalId } = req.params;

  try {
    const terminal = await Terminal.findById(terminalId);
    if (terminal.status == "DELETED") {
      return res
        .status(400)
        .send({ error: "The Terminal is already Deleted." });
    }
  } catch (err) {
    return res.status(400).send({ error: "Invalid Terminal Id." });
  }

  try {
    await Terminal.findByIdAndUpdate(terminalId, {
      status: "DELETED",
    });
    return res.status(200).send("Terminal Deleted");
  } catch (err) {
    return res.status(400).send({ error: "Failed to update Terminal." });
  }
};

const createTerminal = async (req, res) => {
  const { terminalName } = req.params;
  try {
    const terminalExists = await Terminal.findOne({
      name: terminalName,
      status: 'DISABLED'
    }) + await Terminal.findOne({
      name: terminalName,
      status: 'ENABLED'
    });
    if (terminalExists) {
      return res.status(400).send({ error: "The Terminal is already exists." });
    }
  } catch (err) {
    return res.status(400).send({ error: "Invalid Terminal Name." });
  }

  const terminal = new Terminal({
    name: terminalName,
    token: "",
    creationDate: Date.now(),
    status: "DISABLED",
    // verificationContent: ,
    // clinic: ,
  });

  try {
    terminal.save();
    return res.status(201).send("Successfully created terminal");
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};

module.exports.getAppointmentById = getAppointmentById;
module.exports.getTerminals = getTerminals;
module.exports.deleteTerminal = deleteTerminal;
module.exports.createTerminal = createTerminal;
