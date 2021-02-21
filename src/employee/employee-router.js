const express = require('express')
const EmployeeService = require('./Employee-service')
const jsonBodyParser = express.json()

const EmployeeRouter = express.Router()

EmployeeRouter
  .route('/')
  .get((req, res, next) => {
    EmployeeService.getAllItems(req.app.get('db'))
      .then(items => {
        res.json(items)
      })
      .catch(next)
})
  .post(jsonBodyParser, (req, res, next) => {
    const { employee_firstname, employee_lastname, employee_email } = req.body
    const newEmployee = { employee_firstname, employee_lastname, employee_email }

      if (employee_firstname == null || employee_lastname == null || employee_email == null)
        return res.status(400).json({
          error: `Missing info in request body`
    })
    
    EmployeeService.postEmployee(
      req.app.get('db'),
      newEmployee
    )
      .then(employee => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${employee.e_id}`))
          .json(employee)
      })
      .catch(next)
  })

EmployeeRouter
  .route('/:e_id')
  .all(checkEmployeeExists)
  .get((req, res) => {
    res.json(res.employee)
  })
  .delete((req, res, next) => {
      EmployeeService.deleteEmployee(
          req.app.get('db'),
          res.study.e_id
      )
      .then(
          res.status(204)
      )
      .catch(next)
  })


async function checkEmployeeExists(req, res, next) {
  try {
    const study = await EmployeeService.getEmployeeById(
      req.app.get('db'),
      req.params.e_id
    )

    if (!study)
      return res.status(404).json({
        error: `Employee doesn't exist`
    })

    res.employee = employee
    next()
  } catch (error) {
    next(error)
  }
}



module.exports = EmployeeRouter