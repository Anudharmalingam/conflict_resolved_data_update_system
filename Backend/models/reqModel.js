const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth"); 
const Request = require("../models/reqModel"); 

const secretCode = "SECRETKEY"; 

const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "CONFLICT"],
    default: "PENDING"
  },

  requestedOn: {
    type: Date,
    default: Date.now
  },

  actionTakenOn: {
    type: Date
  },

  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  requestedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Record"
  },

  clientVersion: Number,
  serverVersion: Number
});

const RequestModel = mongoose.model("Request", requestSchema);

router.post("/change-request/create", async (req, res) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.json({
      message: "Authorization token missing"
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretCode);

    //const { title, description, requestedTo, recordId, clientVersion } = req.body;
    const title = req.body.title
    const description = req.body.description
    const requestedTo = req.body.requestedTo
    const recordId = req.body.recordId
    const clientVersion = req.body.clientVersion

    if (!title || !description || !requestedTo || !recordId || clientVersion === undefined) {
      return res.json({
        message: "Please send all required details"
      });
    }

    const request = new RequestModel({
      title,
      description,
      status: "PENDING",
      requestedBy: decoded.userId,
      requestedTo,
      recordId,
      clientVersion
    });

    await request.save();

    return res.json({
      message: "Change request created successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
});

module.exports = router;
