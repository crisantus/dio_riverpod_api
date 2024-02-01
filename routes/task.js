const express = require('express')
const testUser = require('../middleware/testUser')
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/authentication');

const router = express.Router()
const  {
  createTask,
  deleteTask,
  getAllTask,
  updateTask,
  getTask,

} = require('../controllers/task')

router.route('/').post(authenticateUser,createTask).get(authenticateUser,getAllTask)
router.route('/:id').get(authenticateUser,getTask).delete(authenticateUser,deleteTask).patch(authenticateUser,updateTask)

module.exports = router
