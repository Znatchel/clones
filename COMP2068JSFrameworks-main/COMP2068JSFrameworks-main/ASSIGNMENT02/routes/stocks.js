// IMPORT EXPRESS AND CREATE ROUTER
const express = require('express');
const router = express.Router();
const Stock = require('../models/stock');

function AuthenticationMiddleware (req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        else{
            res.redirect('/login')
        }
}
// get handler for /stocks/ the root page
router.get('/',  function(req, res, next) {
    Stock.find({})
        .then(stocks => {
            res.render('stocks/index', { title: 'Stock Tracker', dataset: stocks, user: req.user });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

// get handler for /stocks/add
router.get('/add',AuthenticationMiddleware, function(req, res, next)  {
    res.render('stocks/add', { title: 'Add a new stock', user: req.user });
});

// post handler for /stocks/add
router.post('/add', AuthenticationMiddleware,function(req, res, next) {
    Stock.create({
        name: req.body.name,
        value: req.body.value,
        purchDate: req.body.purchDate
    })
    .then(newStock => {
        res.redirect('/stocks');
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
});

// get handler for delete function
router.get('/delete/:_id', AuthenticationMiddleware, function(req, res, next) {
    Stock.deleteOne({ _id: req.params._id })
        .then(() => {
            res.redirect('/stocks');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
});

// get handler for edit
router.get('/edit/:_id',AuthenticationMiddleware, function(req, res, next) {
    Stock.findById(req.params._id).exec()
        .then(stock => {
            res.render('stocks/edit', { title: 'Edit the Stock', stock: stock, user: req.user });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
});

router.post('/edit/:_id',AuthenticationMiddleware, function(req, res, next) {
    const stockId = req.params._id;

    Stock.findOneAndUpdate(
        { _id: stockId },
        {
            name: req.body.name,
            value: req.body.value,
            purchDate: req.body.purchDate,
            soldOn: req.body.soldOn
        },
        { new: true }
    )
    .then(updatedStock => {
        if (!updatedStock) {
            return res.status(404).send('Stock not found');
        }
        res.redirect('/stocks');
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
});

module.exports = router;