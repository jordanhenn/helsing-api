const express = require('express')
const SustainmentService = require('./Sustainment-service')
const jsonBodyParser = express.json()

const SustainmentRouter = express.Router()

SustainmentRouter
  .route('/')
  .get((req, res, next) => {
    SustainmentService.getAllItems(req.app.get('db'))
      .then(items => {
        res.json(items)
      })
      .catch(next)
})
  .post(jsonBodyParser, (req, res, next) => {
    const { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, contract, retainer, additional_notes } = req.body
    const newStudy = { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, contract, retainer, additional_notes }
    newStudy.date_added = new Date()

      if (association == null)
        return res.status(400).json({
          error: `Missing association name in request body`
    })
    
    SustainmentService.postSustainment(
      req.app.get('db'),
      newStudy
    )
      .then(study => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${study.s_id}`))
          .json(study)
      })
      .catch(next)
  })

SustainmentRouter
  .route('/:s_id')
  .all(checkSustainmentExists)
  .get((req, res) => {
    res.json(res.study)
  })
  .delete((req, res, next) => {
      SustainmentService.deleteSustainment(
          req.app.get('db'),
          res.study.s_id
      )
      .then(
          res.status(204)
      )
      .catch(next)
  })
  .put((req, res, next) => {
    const { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, contract, retainer, worksheets_yr1, worksheets_yr2, worksheets_yr3, yr1_billed, yr2_billed, yr3_billed, sustainment_letter, additional_notes } = req.body
    const updatedInfo = { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, contract, retainer, worksheets_yr1, worksheets_yr2, worksheets_yr3, yr1_billed, yr2_billed, yr3_billed, sustainment_letter, additional_notes }
    SustainmentService.updateSustainment(
        req.app.get('db'),
        res.study.s_id,
        updatedInfo
      )
      .then(study => {
        res
          .status(204)
          .location(path.posix.join(req.originalUrl, `/${study.s_id}`))
          .json(study)
      })
      .catch(next)

})

async function checkSustainmentExists(req, res, next) {
  try {
    const study = await SustainmentService.getSustainmentById(
      req.app.get('db'),
      req.params.s_id
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



module.exports = SustainmentRouter