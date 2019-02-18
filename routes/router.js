var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let jwt = require('jsonwebtoken');

let companyRoute = require('./companyRouter');
//
// router.use(function(req, res, next) {
//     var token = req.body.token || req.query.token || req.headers.authorization;
//     try {
//         if (token) {
//             jwt.verify(token, 'supersecret', function (err, decoded) {
//                 if (err) {
//                     console.log(err);
//                     return res.status(403).json({
//                         success: false,
//                         message: 'Failed to authenticate token.'
//                     });
//                 } else {
//                     req.userId = decoded.userId;
//                     req.companyId = decoded.companyId;
//                     next();
//                 }
//             });
//
//         } else {
//             return res.status(403).send({
//                 success: false,
//                 message: 'No token provided.'
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(501).json({
//             info : "Exception in JWT decoding",
//             error : error
//         })
//     }
// });


/* GET users listing. */
router.get('/getCompany',companyRoute.getCompany);
router.post('/createJob',companyRoute.createJob);
router.get('/getJobs',companyRoute.getJobs);
router.post('/applyjob',companyRoute.applyjob);


router.get('/getQuestions',companyRoute.getQuestions);
router.post('/createQuestions',companyRoute.createQuestions);

//Only Recruiters API
router.get('/getApplicantDetail/:userId',companyRoute.getApplicantDetail);
router.get('/getAllApplicants',companyRoute.getAllApplicants);
router.get('/selectApplicant/:subId',companyRoute.selectApplicant);
router.get('/rejectApplicant/:subId',companyRoute.rejectApplicant);

//Applicant Only -- Also Returns Status
router.get('/jobsApplied',companyRoute.jobsApplied);
router.post('/completeProfile',companyRoute.completeProfile);
router.get('/isCompleteProfile/:userId',companyRoute.isCompleteProfile);

//Scrappers
router.get('/getCodechefProfile/:codechef',companyRoute.getCodeChef);
router.get('/getCodeChefGraph/:codechef',companyRoute.getCodeChefGraph);
router.get('/getFiverrProfile/:fiverr',companyRoute.getFiverr);
router.get('/getBehanceUserDetail/:behance',companyRoute.getBehanceUserDetail);
router.get('/getBehanceProjectDetail/:behance',companyRoute.getBehanceProjectDetail);
router.get('/getBehanceCollectionDetail/:behance',companyRoute.getBehanceCollectionDetail);
module.exports = router;
