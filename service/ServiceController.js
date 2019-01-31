var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Service = require('./Service');

router.post('/', function (req, res) {
    Service.create({
        name: req.body.name,
        room_number: req.body.room_number,
        faculty: req.body.faculty,
        hours: req.body.hours,
        description: req.body.description
    }, function (err, service) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(service);
    });
});

router.get('/', function (req, res) {
    Service.find({}, function (err, services) {
        if (err) return res.status(500).send("error getting list");
        return res.status(200).send(services);
    });
});

router.get('/:id', function (req, res) {
    Service.findById(req.params.id, function (err, service) {
        if (err) return res.status(500).send("There was a problem finding the Service");
        if (!service) return res.status(404).send("No user found.");
        res.status(200).send(service);
    });
});

module.exports = router;