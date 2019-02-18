var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var companySchema = new Schema({
        "name":{
            type: String,
            required: true
        },
        "about" : {
            type: String,
            required: true
        },
        "yearFounded" : {
            type: Number
        },
        "funding" : {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Company', companySchema);