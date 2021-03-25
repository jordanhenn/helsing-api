const express = require('express')
const TimeAndMaterialService = require('./timeandmaterial-service')
const jsonBodyParser = express.json()

const TimeAndMaterialRouter = express.Router()

TimeAndMaterialRouter
  .route('/')
  .get((req, res, next) => {
    TimeAndMaterialService.getAllItems(req.app.get('db'))
      .then(items => {
        res.json(items)
      })
      .catch(next)
})
  .post(jsonBodyParser, (req, res, next) => {
    const { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, tm_contract, worksheets, additional_notes } = req.body
    const newStudy = { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, tm_contract, worksheets, additional_notes }
    newStudy.date_added = new Date()

      if (association == null)
        return res.status(400).json({
          error: `Missing association name in request body`
    })
    
    TimeAndMaterialService.postTimeAndMaterial(
      req.app.get('db'),
      newStudy
    )
      .then(study => {
        res
          .status(201)
          .json(study)
      })
      .catch(next)
  })

TimeAndMaterialRouter
  .route('/:tm_id')
  .all(checkTimeAndMaterialExists)
  .get((req, res) => {
    res.json(res.study)
  })
  .delete((req, res, next) => {
      TimeAndMaterialService.deleteTimeAndMaterial(
          req.app.get('db'),
          res.study.tm_id
      )
      .then(
          res.status(204)
      )
      .catch(next)
  })
  .put((req, res, next) => {
    const { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, tm_contract, worksheets, additional_notes, billed } = req.body
    const updatedInfo = { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, tm_contract, worksheets, additional_notes, billed }
    if(res.study.billed === false && updatedInfo.billed == 'true' || res.study.billed === null && updatedInfo.billed == 'true') {
      updatedInfo.billed_date = new Date()
    }
    if(res.study.billed === true && updatedInfo.billed == 'false') {
      updatedInfo.billed_date = null
    }
    TimeAndMaterialService.updateTimeAndMaterial(
        req.app.get('db'),
        res.study.tm_id,
        updatedInfo
      )
      .then(study => {
        res
          .status(204)
          .json(study)
      })
      .catch(next)

})

async function checkTimeAndMaterialExists(req, res, next) {
  try {
    const study = await TimeAndMaterialService.getTimeAndMaterialById(
      req.app.get('db'),
      req.params.tm_id
    )

    if (!study)
      return res.status(404).json({
        error: `Reserve study doesn't exist`
    })

    res.study = study
    next()
  } catch (error) {
    next(error)
  }
}



module.exports = TimeAndMaterialRouter