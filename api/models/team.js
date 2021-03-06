'use strict';

const shortid = require('shortid');

const app_config = require('../config');

const dynamoose = require('dynamoose');
dynamoose.AWS.config.update(app_config.aws);

const Schema = dynamoose.Schema;

if (process.env.DDB_REMOTE !== true) {
    dynamoose.local(app_config.aws.db);
}

const options = {
    create: true,
    udpate: true,
    timestamps: true,
};

const teamSchema = new Schema({
    id: {
        type: String,
        hashKey: true,
        index: {
            global: true,
            rangeKey: 'tournament',
            name: 'TournamentRangeIndex',
        },
        default: shortid.generate,
    },
    name: {
        type: String,
        required: true,
        default: () => {
            return "Team " + shortid.generate().substr(3);
        },
    },
    avatar: {
        type: String,
        required: false,
    },
    tournament: {
        type: String,
        required: true,
    },
    members: {
        type: [String],
        required: false,
    }
});


let Team = dynamoose.model('Team', teamSchema, options);

module.exports = Team;
