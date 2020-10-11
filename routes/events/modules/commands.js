const database = require('../../../db/database')
const tableFormatter = require('text-table');

const message = require('./message')
module.exports = {

    generateLeaderboard: function (channel, type) {
        let blocks = []
        let headerText;
        switch (type) {
            case 'users':
                headerText = ":medal: PlusPlus Bot Top 10 Users :medal:"
                break;
            case 'things':
                headerText = ":medal: PlusPlus Bot Top 10 Things :medal:"
                break;
            default:
                break;
        }
        blocks.push({
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": headerText,
                "emoji": true
            }
        })
        database.connect().then(async dbClient => {
            const collection = dbClient.collection(type);
            collection.find().sort({score: 1}).limit(10).toArray(function (err, results) {
                let i = 1;
                let table = [['Score'.padEnd(10), type === 'users' ? 'User' : 'Thing']]
                table.push(['--------------------', '--------------------']);
                for (let result of results) {
                    if (type === 'users') {
                        table.push([result.score, '<@' + result._id + '>'])
                    } else {
                        table.push([result.score, result._id])
                    }
                    i++;
                }
                blocks.push({
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "```" + tableFormatter(table) + "```"
                    }
                })
                let params = {
                    token: process.env.SLACK_ACCESS_TOKEN,
                    channel: channel,
                    blocks: JSON.stringify(blocks)
                };
                message.post(params);
            });
        });
    }
}
