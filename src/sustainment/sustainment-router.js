const express = require('express')
const SustainmentService = require('./sustainment-service')
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
    const { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, s_contract, retainer, additional_notes } = req.body
    const newStudy = { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, s_contract, retainer, additional_notes }
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
    const { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, s_contract, retainer, worksheets_yr1, worksheets_yr2, worksheets_yr3, yr1_billed, yr2_billed, yr3_billed, sustainment_letter, additional_notes } = req.body
    const updatedInfo = { association, manager_firstname, manager_email, fy_end, client_number, assigned_to, total_price, s_contract, retainer, worksheets_yr1, worksheets_yr2, worksheets_yr3, yr1_billed, yr2_billed, yr3_billed, sustainment_letter, additional_notes }
    if(res.study.yr1_billed === false && updatedInfo.yr1_billed == 'true' || res.study.yr1_billed === null && updatedInfo.yr1_billed == 'true') {
      updatedInfo.yr1_billed_date = new Date()
    }
    if(res.study.yr1_billed === true && updatedInfo.yr1_billed == 'false') {
      updatedInfo.yr1_billed_date = null
    }
    if(res.study.yr2_billed === false && updatedInfo.yr2_billed == 'true' || res.study.yr2_billed === null && updatedInfo.yr2_billed == 'true') {
      updatedInfo.yr2_billed_date = new Date()
    }
    if(res.study.yr2_billed === true && updatedInfo.yr2_billed == 'false') {
      updatedInfo.yr2_billed_date = null
    }
    if(res.study.yr3_billed === false && updatedInfo.yr3_billed == 'true' || res.study.yr3_billed === null && updatedInfo.yr3_billed == 'true') {
      updatedInfo.yr3_billed_date = new Date()
    }
    if(res.study.yr3_billed === true && updatedInfo.yr3_billed == 'false') {
      updatedInfo.yr3_billed_date = null
    }
    SustainmentService.updateSustainment(
        req.app.get('db'),
        res.study.s_id,
        updatedInfo
      )
      .then(study => {
        res
          .status(204)
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