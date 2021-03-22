const express = require('express')
const ReserveStudyService = require('./reservestudy-service')
const jsonBodyParser = express.json()

const ReserveStudyRouter = express.Router()

ReserveStudyRouter
  .route('/')
  .get((req, res, next) => {
    ReserveStudyService.getAllItems(req.app.get('db'))
      .then(items => {
        res.json(items)
      })
      .catch(next)
})
  .post(jsonBodyParser, (req, res, next) => {
    const { association, manager_firstname, manager_email, assigned_to, fy_end, client_number, total_price, csa, scope, retainer, ccrs, hoa_questionnaire, budget, site_plan, reserve_study, annual_review, income_statement, balance_sheet, additional_notes, date_added } = req.body
    const newStudy = { association, manager_firstname, manager_email, assigned_to, fy_end, client_number, total_price, csa, scope, retainer, ccrs, hoa_questionnaire, budget, site_plan, reserve_study, annual_review, income_statement, balance_sheet, additional_notes, date_added }

      if (association == null)
        return res.status(400).json({
          error: `Missing association name in request body`
    })
    
    ReserveStudyService.postReserveStudy(
      req.app.get('db'),
      newStudy
    )
      .then(study => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${study.rs_id}`))
          .json(study)
      })
      .catch(next)
  })

ReserveStudyRouter
  .route('/:rs_id')
  .all(checkReserveStudyExists)
  .get((req, res) => {
    res.json(res.study)
  })
  .delete((req, res, next) => {
      ReserveStudyService.deleteReserveStudy(
          req.app.get('db'),
          res.study.rs_id
      )
      .then(
          res.status(204)
      )
      .catch(next)
  })
  .put((req, res, next) => {
    const { association, manager_firstname, manager_email, assigned_to, fy_end, client_number, total_price, csa, scope, retainer, ccrs, hoa_questionnaire, budget, site_plan, reserve_study, annual_review, income_statement, balance_sheet, draft_billed, final_billed, date_in_queue, additional_notes } = req.body
    const updatedInfo = { association, manager_firstname, manager_email, assigned_to, fy_end, client_number, total_price, csa, scope, retainer, ccrs, hoa_questionnaire, budget, site_plan, reserve_study, annual_review, income_statement, balance_sheet, draft_billed, final_billed, date_in_queue, additional_notes }
    if(res.study.draft_billed === false && updatedInfo.draft_billed === true) {
      updatedInfo.draft_billed_date = new Date()
    }
    if(res.study.final_billed === false && updatedInfo.final_billed === true) {
      updatedInfo.final_billed_date = new Date()
    }
    ReserveStudyService.updateReserveStudy(
        req.app.get('db'),
        res.study.rs_id,
        updatedInfo
      )
      .then(study => {
        res
          .status(204)
          .location(path.posix.join(req.originalUrl, `/${study.rs_id}`))
          .json(study)
      })
      .catch(next)

})

async function checkReserveStudyExists(req, res, next) {
  try {
    const study = await ReserveStudyService.getReserveStudyById(
      req.app.get('db'),
      req.params.rs_id
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



module.exports = ReserveStudyRouter