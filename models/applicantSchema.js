var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var applicantSchema = new Schema({
        "email" : {
            type: String,
            required: true,
            unique: true
        },
        "firstName":{
            type: String,
            required: true
        },
        "lastName":{
            type: String,
            required: true
        },
        "password" : {
            type: String
        },
        "about" : {
            type: String
        },
        "imgUrl": {
            type: String
        },
        "resume" : {
            type: String
        },
        "github" : {
            type: String
        },
        "linkedIn" : {
            type: String
        },
        "fiverr" : {
            type: String
        },
        "codeforces" : {
            type: String
        },
        "codechef"  : {
            type: String
        },
        "behance": {
            type: String
        },
        "deviantArt" : {
            type: String
        },
        "codepen" : {
            type: String
        },
        "positions" : {
            type : Object
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Applicant', applicantSchema);