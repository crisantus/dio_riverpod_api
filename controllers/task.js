const Task = require('../models/Task')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllTask = async (req, res) => {
  
  const task = await Task.find({createdBy: req.user.userId})
  if(!task){
   throw new CustomError.NotFoundError(`There is no task found`);
  }
   res.status(StatusCodes.OK).send(task);
 };

const getTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req

  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
  }).select('-__v')
  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`)
  }
  res.status(StatusCodes.OK).json({ task: task })
}

const createTask = async (req, res) => {
  req.body.createdBy = req.user.userId
  const task = await Task.create(req.body)
  res.status(StatusCodes.CREATED).json({ task: task })
  return;
}

const updateTask = async (req, res) => {
  const {
    body: { task, description },
    user: { userId },
    params: { id: taskId },
  } = req

  if (task === '' || description === '') {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }
  const updateTask = await Task.findByIdAndUpdate(
    { _id: taskId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!updateTask) {
    throw new NotFoundError(`No task with id ${taskId}`)
  }
  res.status(StatusCodes.OK).json({ task: updateTask })
  return;
}

const deleteTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req

  const task = await Task.findByIdAndRemove({
    _id: taskId,
    createdBy: userId,
  })
  if (!task) {
    throw new NotFoundError(`No job with id ${taskId}`)
  }
  res.status(StatusCodes.OK).send()
  return;
}


module.exports = {
  createTask,
  deleteTask,
  getAllTask,
  updateTask,
  getTask,
}
