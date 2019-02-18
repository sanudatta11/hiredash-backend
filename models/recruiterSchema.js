var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
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
            type: String,
            required: true
        },
        "imgUrl" : {
            type : String
        },
        "companyId" : {
            type : ObjectId,
            required: true,
            ref: 'Company'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Recruiter', userSchema);