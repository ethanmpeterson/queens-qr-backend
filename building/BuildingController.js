var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var levenshtein = require('levenshtein');

const fs = require('fs');
const fileUpload = require('express-fileupload');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(fileUpload());

var Building = require('./Building');

const distanceCap = 10; // the levenshtein distance cap for search endpoint

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

router.post('/upload', function (req, res) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send("No files given")
    }
    let file = req.files.image;
    console.log(file);
    let floorNum = parseInt(req.body.number)
    console.log(floorNum)
    console.log(typeof(floorNum))
    if (floorNum == NaN) {
        res.status(400).send("Floor number is not a number");
    }
    let id = String(req.body.id);
    Building.findById(id, function (err, building) {
        if (err) return res.status(500).send("There was a problem finding the Building");
        if (!building) return res.status(404).send("No building found for given id");
    });
    let fileName = String(floorNum) + ".png";
    console.log(fileName);

    if (!fs.existsSync('./floorplans')) { // was having trouble with this directory getting pushed to g cloud
        fs.mkdirSync('./floorplans');
    }

    const path = './floorplans/' + id + '/';

    if (!fs.existsSync(path))  {
        // then create the folder using building ID
        fs.mkdirSync(path);
    }
    
    // load the file into building ID folder
    file.mv(path + fileName, function (err) {
        console.log(err);
        if (err) return res.status(500).send(err);
    });
    const response = {
        "file_name" : fileName,
        "id_folder" : id
    };
    return res.status(200).send(response);

});

function containsID(buildings, id) {
    // make array of IDs
    var ids = []
    for (var i = 0; i < buildings.length; i++) {
        ids.push(buildings[i]['_id']);
    }
    return ids.includes(id);
} 

router.post('/building_search', function (req, res) {
    if (!String(req.body.query)) {
        res.status(400).send("No query given")
    }
    Building.find({}, function (err, buildings) {
        if (err) return res.status(500).send("Could not get building list");
        var matches = [];
        var query = req.body.query;
        for (var i = 0; i < buildings.length; i++) {
            
            var nameMatch = new levenshtein(buildings[i]['name'], query);
            if (nameMatch.distance <= distanceCap) matches.push(buildings[i]);

            alias = buildings[i]['alias'];
            for (var j = 0; j < alias.length; j++) {
                var aliasMatch = new levenshtein(alias[i], query);
                if (aliasMatch.distance <= distanceCap) matches.push(buildings[i]);
            }
        }
        // remove duplicate buildings
        var uniqueBuildings = []
        for (var i = 0; i < buildings.length; i++) {
            if (!containsID(uniqueBuildings, buildings[i]['id'])) uniqueBuildings.push(buildings[i]);
        }
        if (uniqueBuildings.length > 0) return res.status(200).send(uniqueBuildings);
        return res.status(204).send("");
    });
});

router.post('/service_search', function (req, res) {
    if (req.body.id != null) {
        Building.findById(req.body.id, function (err, building) {
            if (err) return res.status(500).send("There was a problem finding the Building");
            if (!building) return res.status(404).send("No Building found.");
            
            var services = []
            for (var i = 0; i < building['services'].length; i++) {
                s = building['services'][i];
                services.push(s['name']);
            }
            var results = []
            for (var j = 0; j < services.length; j++) {
                var l = new levenshtein(services[j], req.body.query);
                if (l.distance <= distanceCap) {
                    results.push(services[j]);
                }
            }
            if (results.length > 0) {
                res.status(200).send(results);
            } else {
                res.status(204).send("");
            }
        });
    } else {
        Building.find({}, function (err, buildings) {
            if (err) return res.status(500).send("error getting list");
            // collect all services in one array
            var services = []
            for (var i = 0; i < buildings.length; i++) {
                for (var j = 0; j < buildings[i]['services'].length; j++) {
                    var s = buildings[i]['services'][j];
                    services.push(s['name']);
                }
            }

            var results = []
            for (var k = 0; k < services.length; k++) {
                var l = new levenshtein(services[k], req.body.query);
                if (l.distance <= distanceCap) {
                    results.push(services[k]);
                }
            }
            if (results.length > 0) {
                res.status(200).send(results);
            } else {
                res.status(204).send("");
            }

        });
    }
});

module.exports = router;