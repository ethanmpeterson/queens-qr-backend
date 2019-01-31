var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Building = require('./Building');

router.post('/', function (req, res) {
    Building.create({
        name: req.body.name,
        address: req.body.address,
        faculty: req.body.faculty,
        hours: req.body.hours,
        history: req.body.history,
        alias: [
            req.body.alias
        ],
        services: [
            req.body.services
        ]
    }, function (err, building) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(building);
    });
});

router.get('/', function (req, res) {
    Building.find({}, function (err, buildings) {
        if (err) return res.status(500).send("error getting list");
        return res.status(200).send(buildings);
    });
});

router.get('/:id', function (req, res) {
    Building.findById(req.params.id, function (err, building) {
        if (err) return res.status(500).send("There was a problem finding the Building");
        if (!building) return res.status(404).send("No user found.");
        res.status(200).send(building);
    });
});

module.exports = router;