let config = require('../apiKeys/config');
var express = require('express');
var router = express.Router();
var request = require('request');
const requestPromise = require('request-promise');
var cheerio = require('cheerio');


let Behance = require("node-behance-api");

let behance = new Behance({"client_id": config.behanceAPIKey});


let Company = require('../models/companySchema');
let JobApp = require('../models/jobApplicationSchema');
let JobSubmission = require('../models/jobSubmissionsSchema');
let Question = require('../models/questionSchema');
let Applicant = require('../models/applicantSchema');


let codeChefURI = "https://www.codechef.com/users/";
let fiverrURI = "https://www.fiverr.com/";
const linkedInURL = 'https://www.linkedin.com/in/';

var customHeaderRequest = request.defaults({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
    }
});

/* GET users listing. */
router.createCompany = (req, res, next) => {
    let companyObj = new Company({
        "name": req.body.name,
        "about": req.body.about,
        "yearFounded": req.body.yearFounded,
        "funding": req.body.funding,
    });

    companyObj.save(function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data)
            res.status(404).json({
                info: "Data not saved! not some error"
            });
        else
            res.status(200).json(data);
    });
};

router.getCompany = (req, res, next) => {
    Company.find({}, function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data.length)
            res.status(404).json({
                info: "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};

router.createJob = (req, res, next) => {
    let jobApp = new JobApp({
        name: req.body.name,
        about: req.body.about,
        companyId: req.body.companyId,
        questions: req.body.questions,
    });
    if(req.body.salary)
        jobApp.salary = req.body.salary;
    jobApp.save(function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data)
            res.status(404).json({
                info: "Data not saved!"
            });
        else
            res.status(200).json(data);
    });
};

router.getJobs = (req, res, next) => {
    JobApp.find({}).populate('companyId').exec(function (err, data) {
        console.log(data);
        if (err)
            res.status(500).json(err);
        else if (!data.length)
            res.status(404).json({
                info: "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};

router.applyjob = (req, res, next) => {
    JobApp.findById(req.body.jobId, function (err, jobAppData) {
        if (err)
            res.status(500).json(err);
        else if (!jobAppData)
            res.status(404).json({
                info: "Data not found!"
            });
        else {
            let jobSub = new JobSubmission({
                "companyId": req.body.companyId,
                "userId": req.userId || req.body.userId,
                "answers": req.body.answers
            });

            jobSub.save(function (err, data) {
                if (err)
                    res.status(500).json(err);
                else if (!data)
                    res.status(404).json({
                        info: "Data not saved!"
                    });
                else
                    res.status(200).json(data);
            });
        }
    });
};

router.getQuestions = (req, res, next) => {
    Question.find({}, function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data.length)
            res.status(404).json({
                info: "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};

router.createQuestions = (req, res, next) => {
    let question = new Question({
        question: req.body.question
    });

    question.save(function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data)
            res.status(404).json({
                info: "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};

router.getAllApplicants = (req, res, next) => {
    JobSubmission.find({}).populate('userId').exec(function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data.length)
            res.status(404).json({
                info: "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};

router.selectApplicant = (req, res, next) => {
    let submissionId = req.params.subId;
    JobSubmission.findById(submissionId, function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data)
            res.status(404).json({
                info: "Data not found!"
            });
        else {
            data.status = 3;
            data.save(function (err, data) {
                if (err)
                    res.status(500).json(err);
                else if (!data)
                    res.status(404).json({
                        info: "Data not found!"
                    });
                else
                    res.status(200).json(data);
            });
        }
    });
};

router.rejectApplicant = (req, res, next) => {
    let submissionId = req.params.subId;
    JobSubmission.findById(submissionId, function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data)
            res.status(404).json({
                info: "Data not found!"
            });
        else {
            data.status = 2;
            data.save(function (err, data) {
                if (err)
                    res.status(500).json(err);
                else if (!data)
                    res.status(404).json({
                        info: "Data not found!"
                    });
                else
                    res.status(200).json(data);
            });
        }
    });
};

router.jobsApplied = (req, res, next) => {
    JobSubmission.find({
        userId: req.userId || req.body.userId
    }, function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data)
            res.status(404).json({
                info: "Data not found!"
            });
        else
            res.status(200).json(data);
    });
};


router.completeProfile = (req, res, next) => {
    let imgUrl = req.body.imgUrl;
    let resume = req.body.resume;
    let github = req.body.github;
    let linkedIn = req.body.linkedIn;
    let fiverr = req.body.fiverr;
    let codeforces = req.body.codeforces;
    let codechef = req.body.codechef;
    let behance = req.body.behance;
    let deviantArt = req.body.deviantArt;
    let codepen = req.body.codepen;

        Applicant.findById(req.body.userId, function (err, data) {
            if (err)
                res.status(500).json(err);
            else if (!data)
                res.status(404).json({
                    info: "Data not found!"
                });
            else {
                data.imgUrl = imgUrl;
                if (resume)
                    data.resume = resume;
                if (github)
                    data.github = github;
                if (linkedIn)
                    data.linkedIn = linkedIn;
                if (fiverr)
                    data.fiverr = fiverr;
                if (codeforces)
                    data.codeforces = codeforces;
                if (codechef)
                    data.codechef = codechef;
                if (behance)
                    data.behance = behance;
                if (deviantArt)
                    data.deviantArt = deviantArt;
                if (codepen)
                    data.codepen = codepen;

                data.save(function (err, data) {
                    if (err)
                        res.status(500).json(err);
                    else if (!data)
                        res.status(404).json({
                            info: "Data not saved!"
                        });
                    else
                        res.status(200).json(data);
                });
            }
        });
};

router.isCompleteProfile = (req, res, next) => {
    Applicant.findById(req.params.userId, function (err, data) {
        if (err)
            res.status(500).json(err);
        else if (!data)
            res.status(404).json({
                info: "Data not found!"
            });
        else {
            if (data.imgUrl && data.github)
                res.status(200).json(data);
            else
                res.status(400).json({
                    info : "Not Full"
                });
        }
    });
};

router.getCodeChef = (req, res, next) => {
    let URI = codeChefURI +req.params.codechef;
    customHeaderRequest.get(URI, function (err, response, html) {
        if (!err && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var globalRank, countryRank, rating;
            var json = {globalRank: "", countryRank: "", rating: ""};
            $('.rating-number').filter(function () {
                var data = $(this);
                rating = data.text();
                json.rating = rating;
            })
            globalRank = $('.rating-ranks').find('strong').eq(0).text();
            countryRank = $('.rating-ranks').find('strong').eq(1).text();
            json.globalRank = globalRank;
            json.countryRank = countryRank;

            json.longChallenge= {
              rating : $('#hp-sidebar-blurbRating').find('td').eq(1).text(),
              globalRank : $('#hp-sidebar-blurbRating').find('td').eq(2).text(),
              countryRank : $('#hp-sidebar-blurbRating').find('td').eq(3).text()
            };

            json.cookOffChallenge= {
                rating : $('#hp-sidebar-blurbRating').find('td').eq(5).text(),
                globalRank : $('#hp-sidebar-blurbRating').find('td').eq(6).text(),
                countryRank : $('#hp-sidebar-blurbRating').find('td').eq(7).text()
            };

            json.lunchtimeChallenge= {
                rating : $('#hp-sidebar-blurbRating').find('td').eq(9).text(),
                globalRank : $('#hp-sidebar-blurbRating').find('td').eq(10).text(),
                countryRank : $('#hp-sidebar-blurbRating').find('td').eq(11).text()
            };
            res.status(200).json(json);
        }
        else{
            res.status(500).json(err);
        }
    })
}

router.getCodeChefGraph = (req, res, next) => {
    let URI = codeChefURI +req.params.codechef;
    customHeaderRequest.get(URI, function (err, response, html) {
        if (!err && response.statusCode == 200) {
            var $ = cheerio.load(html);

            $('#highcharts-md1xkx1-6').filter(function () {
                var data = $(this);
                console.log(data.text());
                console.log(data);
                res.send(data.text());
            })
        }
        else{
            res.status(500).json(err);
        }
    })
};

router.getFiverr = (req,res,next) => {
    let URI = fiverrURI + req.params.fiverr;
    customHeaderRequest.get(URI, function (err, response, html) {
        if (!err && response.statusCode === 200) {
            var $ = cheerio.load(html);
            var json = {};
            console.log($('#UserPageReviews-component').text());
            json.avgReview = $('span.total-rating-out-five').eq(0).text();
            json.reviewsRating = $('.review-list').find('.total-rating-out-five').toArray().map(function(x){ return $(x).text()});
            json.reviewers = $('.review-list h5').toArray().map(function(x){ return $(x).text()});
            json.reviews = $('.review-list p').toArray().map(function(x){ return $(x).text()});
            res.status(200).json(json);
        }
        else{
            res.status(500).json(err);
        }
    })
};

router.getApplicantDetail = (req,res,next) => {
    let userId = req.params.userId;
      Applicant.findById(userId,
          function (err,data) {
          if (err)
              res.status(500).json(err);
          else if (!data)
              res.status(404).json({
                  info: "Applicant Data not found!"
              });
          else
              res.status(200).json(data);
      });
};

router.getBehanceUserDetail = (req,res,next) => {
    request({
        uri: 'https://api.behance.net/v2/users/' + req.params.behance ,
        qs: {
            api_key: config.behanceAPIKey
        }
    }).pipe(res);
};

router.getBehanceProjectDetail = (req,res,next) => {
    request({
        uri: 'https://api.behance.net/v2/users/' + req.params.behance +'/projects',
        qs: {
            api_key: config.behanceAPIKey
        }
    }).pipe(res);
};
router.getBehanceCollectionDetail = (req,res,next) => {
    request({
        uri: 'http://www.behance.net/v2/users/' + req.params.behance +'/collections',
        qs: {
            api_key: config.behanceAPIKey
        }
    }).pipe(res);
};

module.exports = router;
