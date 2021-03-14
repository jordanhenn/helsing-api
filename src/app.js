const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const ReserveStudyRouter = require('./reservestudy/reservestudy-router')
const SustainmentRouter = require('./sustainment/sustainment-router')
const TimeAndMaterialRouter = require('./timeandmaterial/timeandmaterial-router')
const EmployeeRouter = require('./employee/employee-router')

const app = express()
app.use(cors())

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(helmet())

app.use(express.json());
app.use('/api/reservestudy', ReserveStudyRouter)
app.options('/api/reservestudy', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  });
app.use('/api/sustainment', SustainmentRouter)
app.options('/api/sustainment', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  });
app.use('/api/timeandmaterial', TimeAndMaterialRouter)
app.options('/api/timeandmaterial', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  });
app.use('/api/employee', EmployeeRouter)
app.options('/api/employee', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  });

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app