const Appointment = require("../model/Appointment");
const Clinic = require("../model/Clinic");
const Patient = require("../model/Patient");
const User = require("../model/User");
const VerificationContent = require("../model/VerificationContent");
const Terminal = require("../model/Terminal");
const mongoose = require("mongoose");
const {
  updateAppointmentValidation,
  getAppointmentsValidation,
} = require("../component/validation");

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

const updateAppointmentById = async (req, res) => {
  const { error } = updateAppointmentValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { appointmentId } = req.params;
  let appointment = {};
  // Check if appointment exists
  try {
    const appt = await Appointment.findById(appointmentId);
    if (appt) {
      appointment = appt;
    }
  } catch (err) {
    return res.status(400).send({ error: "Invalid appointment ID." });
  }
  // Update appointment in clinic
  try {
    if (appointment.clinic && appointment.clinic != req.body.clinic) {
      const oldClinic = await Clinic.findById(appointment.clinic);
      oldClinic.appointments.pull(appointment._id);
      oldClinic.save();
      const newClinic = await Clinic.findById(req.body.clinic);
      newClinic.appointments.push(appointment._id);
      newClinic.save();
    } else if (!appointment.clinic && req.body.clinic) {
      const newClinic = await Clinic.findById(req.body.clinic);
      newClinic.appointments.push(appointment._id);
      newClinic.save();
    }
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Failed to update appointment in clinic." });
  }
  // Update appointment in patient
  try {
    if (appointment.patient && appointment.patient != req.body.patient) {
      const oldPatient = await Patient.findById(appointment.patient);
      oldPatient.appointments.pull(appointment._id);
      await oldPatient.save();
      const newPatient = await Patient.findById(req.body.patient);
      newPatient.appointments.push(appointment._id);
      await newPatient.save();
    } else if (!appointment.patient && req.body.patient) {
      const newPatient = await Patient.findById(req.body.patient);
      newPatient.appointments.push(appointment._id);
      await newPatient.save();
    }
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Failed to update appointment in patient." });
  }
  // Update clinic and patient in appointment
  try {
    appointment.appointmentTime = req.body.appointmentTime;
    appointment.doctorName = req.body.doctorName;
    appointment.reason = req.body.reason;
    appointment.status = req.body.status;
    appointment.comment = req.body.comment;
    appointment.clinic = req.body.clinic;
    appointment.patient = req.body.patient;
    await appointment.save();
    return res.status(200).send(appointment);
  } catch (err) {
    return res.status(400).send({ error: "Failed to update appointment." });
  }
};



const getVerificationContent = async (req, res) => {
  const { terminalId } = req.params;
  try {
    const terminalExists = await Terminal.findOne({
      _id: terminalId,
      status: "ENABLED",
    });
    if (terminalExists) {
      try {
        const verificationContent = await VerificationContent.findById(
          terminalExists.verificationContent
        );
        return res.status(200).send(verificationContent);
      } catch (err) {
        return res
          .status(400)
          .send({ error: "Failed to get Verification Contents." });
      }
    }
  } catch (err) {
    return res.status(400).send({ error: "Invalid data request." });
  }
};

module.exports.getAppointmentById = getAppointmentById;
module.exports.updateAppointmentById = updateAppointmentById;

module.exports.getVerificationContent = getVerificationContent;
