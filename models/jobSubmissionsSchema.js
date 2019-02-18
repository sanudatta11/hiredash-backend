var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var jobSubmissionSchema = new Schema({
        "companyId" : {
            type: ObjectId,
            required: true,
            ref: 'Company'
        },
        "userId" : {
            type: ObjectId,
            required: true,
            ref: 'Applicant'
        },
        "answers" : [{
            "question": {
                type: ObjectId,
                ref: 'Question'
            },
            "answer" : {
                type: String
            }
        }],
        "status" : {
            type: Number,
            default: 1     //1 = Pending 2 = Fail 3= Pass
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('JobSubmission', jobSubmissionSchema);