const router = require("express").Router();

const { getAppointmentById, deleteTerminal, updateAppointmentById, getAppointments, getVerificationContent, getTerminalById, getTerminals, updateTerminalById, createDummyAppointments, createTerminal, } = require("../controller/clientController")

const { auth } = require("./verifyToken");

// Put Client/Appointment/{id}
router.put("/appointment/:appointmentId", auth("CLIENT_ADMIN"), async (req, res) => {
  return await updateAppointmentById(req, res);
});

// Get Client/Appointment/{id}
router.get("/appointment/:appointmentId", auth("CLIENT_ADMIN"), async (req, res) => {
  return await getAppointmentById(req, res);
});

// Get Client/Appointments
router.get("/appointments", auth("CLIENT_ADMIN"), async (req, res) => {
  return await getAppointments(req, res);
});

// Get Client/Terminal/{id}
router.get("/terminal/:terminalId", auth("CLIENT_ADMIN"), async (req, res) => {
  return await getTerminalById(req, res);
});

// Delete Client/Terminal/{id}
router.delete("/terminal/:terminalId",
  auth("CLIENT_ADMIN"),
  async (req, res) => {
    return await deleteTerminal(req, res)
  })

// Post Client/Terminal
router.post(
  "/terminal/:terminalName",
  auth("CLIENT_ADMIN"),
  async (req, res) => {
    return await createTerminal(req, res);
  }
);

// Put Client/Appointment/{id}
router.put("/appointment/:appointmentId", auth("CLIENT_ADMIN"), async (req, res) => {
  return await updateAppointmentById(req, res);
});

// Get Client/Appointments
router.get("/appointments", auth("CLIENT_ADMIN"), async (req, res) => {
  return await getAppointments(req, res);
});

// Get Client/terminal/verificationcontent
router.get(
  "/terminal/verificationContent/:terminalId",
  auth("CLIENT_ADMIN"),
  async (req, res) => {
    return await getVerificationContent(req, res);
  }
);

// Get Client/terminal/{id}
router.get(
  "/terminal/:terminalId",
  auth("CLIENT_ADMIN"),
  async (req, res) => {
    return await getTerminalById(req, res);
  }
);

// Get Client/Terminals
router.get("/terminals",
  auth("CLIENT_ADMIN"),
  async (req, res) => {
    return await getTerminals(req, res);
  });

// Put Client/Terminal/{id}
router.put("/terminal/:terminalId", auth("CLIENT_ADMIN"), async (req, res) => {
  return await updateTerminalById(req, res);
});

// Post Client/createDummyAppointments
router.post("/createDummyAppointments", auth("CLIENT_ADMIN"), async (req, res) => {
  return await createDummyAppointments(req, res)
})
module.exports = router
