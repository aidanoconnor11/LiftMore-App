const { v4: uuidv4 } = require("uuid");
uuidv4();
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Lift = require("../models/lift");
const User = require("../models/user");

const getLiftById = async (req, res, next) => {
  const liftId = req.params.lid;

  let lift;
  try {
    lift = await Lift.findById(liftId);
  } catch (err) {
    const error = new Error("Couldn't find lift.");
    error.code = 500;
    return next(error);
  }

  if (!lift) {
    const error = new Error("Could not find a lift for the provided id.");
    error.code = 404;
    return next(error);
  }

  res.json({ lift: lift.toObject({ getters: true }) });
};

const getLiftsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithLifts;
  try {
    userWithLifts = await User.findById(userId).populate("lifts");
  } catch (err) {
    const error = new Error("Couldn't find lifts.");
    error.code = 500;
    return next(error);
  }

  res.json({
    lifts: userWithLifts.lifts.map((lift) => lift.toObject({ getters: true })),
  });
};

const createLift = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs.");
    error.code = 422;
    return next(error);
  }

  let date_ob = new Date();
  let day = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let date = month + "-" + day + "-" + year;
  const { title, location, description, creator } = req.body;
  const createdLift = new Lift({
    date,
    title,
    location,
    description,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new Error("Creating lift failed.");
    error.code = 500;
    return next(error);
  }

  if (!user) {
    const error = new Error("Couldn't find user for provided id.");
    error.code = 404;
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdLift.save({ session: sess });
    user.lifts.push(createdLift);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error("Creating lift failed.");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ lift: createdLift });
};

const updateLift = async (req, res, next) => {
  const { title, description } = req.body;
  const liftId = req.params.lid;

  let lift;
  try {
    lift = await Lift.findById(liftId);
  } catch (err) {
    const error = new Error("Couldn't update lift.");
    error.code = 500;
    return next(error);
  }

  lift.title = title;
  //lift.location = location;
  lift.description = description;

  try {
    await lift.save();
  } catch (err) {
    const error = new Error("Couldn't update lift.");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ lift: lift.toObject({ getters: true }) });
};

const deleteLift = async (req, res, next) => {
  const liftId = req.params.lid;

  let lift;
  try {
    lift = await Lift.findById(liftId).populate("creator");
  } catch (err) {
    const error = new Error("Couldn't delete lift.");
    error.code = 500;
    return next(error);
  }

  if (!lift) {
    const error = new Error("Couldn't find lift for this id.");
    error.code = 500;
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await lift.remove({ session: sess });
    lift.creator.lifts.pull(lift);
    await lift.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error("Couldn't delete lift.");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ message: "Deleted Lift" });
};

exports.getLiftById = getLiftById;
exports.getLiftsByUserId = getLiftsByUserId;
exports.createLift = createLift;
exports.updateLift = updateLift;
exports.deleteLift = deleteLift;
