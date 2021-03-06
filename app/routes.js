var express = require('express')
var router = express.Router()

router.use(function (req, res, next) {
 // Store common vars in string

  res.locals.formData = ''
  res.locals.formQuery = '?'
  res.locals.data = {}

  for (var name in req.query) {
    var value = req.query[name]
    res.locals.formData += '<input type="hidden" name="' + name + '" value="' + value + '">\n'
    res.locals.formQuery += name + '=' + value + '&'
    res.locals.data[name] = value
  }

  next()
})

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// add your routes here

// routes for 'check eligibility, cost and time' pattern

// question in /example/over-18
router.get('/example/passengers', function (req, res) {
  // get the answer from the query string (eg. ?over18="yes")
  var over18 = req.query.over18

  console.log(over18)

  if (over18 === 'no') {
    // if users is NOT 18 or over
    res.redirect('/example/result/ineligible' + res.locals.formQuery)
  } else {
    // if users IS 18 or over
    res.render('example/passengers/index.html')
  }
})

// question in /example/passengers
router.get('/example/weight/empty', function (req, res) {
  console.log('passengers')

  // get the answer from the query string (eg. ?over18="yes")
  var passengers = req.query.passengers

  if (passengers === 'yes') {
    // if vehicles WILL be carrying passengers
    res.redirect('/example/result/ineligible' + res.locals.formQuery)
  } else {
    // if vehicles will NOT be carrying passengers
    res.render('example/weight/empty/index.html')
  }
})

// question in /example/weight/empty/index.html
// question in /example/weight/loaded/index.html
router.get('/example/how-many-vehicles', function (req, res) {
  console.log('weight')

  // get the answer from the query string (eg. ?over18="yes")
  var weightEmpty = req.query.weight_empty
  var weightLoaded = req.query.weight_loaded

  if (weightEmpty === 'less than 1,525 kg' && weightLoaded === undefined) {
    // if vehicles are TOO LIGHT when empty for licence
    res.redirect('/example/weight/loaded' + res.locals.formQuery)
  } else if (weightEmpty === 'less than 1,525 kg' && weightLoaded === 'less than 3,5000 kg') {
    // if vehicles are TOO LIGHT when empty and loaded for licence
    res.redirect('/example/result/ineligible' + res.locals.formQuery)
  } else {
    // if vehicles are HEAVY ENOUGH when empty or loaded for licence
    res.render('example/how-many-vehicles/index.html')
  }
})

// question in /example/licence-type/just-your-goods/index.html
router.get('/example/result/eligible', function (req, res) {
  console.log('just_your_goods')

  // get the answer from the query string (eg. ?over18="yes")
  var justYourGoods = req.query.just_your_goods
  var outsideUk = req.query.outside_uk

  if (justYourGoods === 'no' && outsideUk === undefined) {
    // user needs INTERNATIONAL licence
    res.redirect('/example/licence-type/outside-uk' + res.locals.formQuery)
  } else {
    // user needs STANDARD licence
    res.render('example/result/eligible/index.html')
  }
})

// calculate amounts in /example/result/cost
router.get('/example/result/cost', function (req, res) {
  console.log('application_cost')

  // get the answer from the query string (eg. ?over18="yes")
  var amount = req.query.amount

  if (amount === 'value') {
    // if user IS related to child
    res.redirect('/example/result/ineligible' + res.locals.formQuery)
  } else {
    var applicationCost = 257 + 401 + 6650 + (req.query.how_many_vehicles - 1) * 3700

    applicationCost = applicationCost.toString().replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    var maintenanceCosts = 6650 + (req.query.how_many_vehicles - 1) * 3700

    maintenanceCosts = maintenanceCosts.toString().replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // if user is NOT related to child
    res.render('example/result/cost/index.html', {applicationCost: applicationCost, maintenanceCosts: maintenanceCosts})
  }
})

module.exports = router