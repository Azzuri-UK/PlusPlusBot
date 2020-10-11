const express = require('express');
const router = express.Router();
const commands = require('./modules/commands');
const message = require('./modules/message');


router.post('/', function (req, res, next) {
    switch (req.body.event.type) {
        case 'app_mention':
            processAppMention(req.body.event);
            break;
        case 'message':
            processMessage(req.body.event);
            break;
        default:

    }
});

module.exports = router;

const processAppMention = (event) => {
    let command = event.text.replace(/<.*?> ?/g, '');
    switch (command) {
        case 'leaderboard':
            commands.generateLeaderboard(event.channel,'users')
            break;
        case 'leaderboard things':
            commands.generateLeaderboard(event.channel,'things')
            break;
    }
}

const processMessage = (event) => {
    // ++ a user
    let regEx = /<.*?> ?\+\+/g;
    let matches;
    while ((matches = regEx.exec(event.text)) != null) {
        let user = matches[0].replace(/\<|\>|\@|\+/g, '').trim()
        if (user === event.user){
            message.shame(event.user,event.channel);
        } else {
            message.increaseUser(user, event.channel)
        }
    }

    // -- a user
    regEx = /<.*?> ?--/g;
    while ((matches = regEx.exec(event.text)) != null) {
        let user = matches[0].replace(/\<|\>|\@|-/g, '').trim()
        if (user === event.user){
            message.shame(event.user,event.channel);
        } else {
            message.decreaseUser(user, event.channel)
        }
    }

    // ++ a thing
    regEx = /#.*?\+\+/g;
    while ((matches = regEx.exec(event.text)) != null) {
        message.increaseThing(matches[0].replace(/#|\+/g, '').trim(), event.channel)
    }

    // -- a thing
    regEx = /#.*?--/g;
    while ((matches = regEx.exec(event.text)) != null) {
        message.decreaseThing(matches[0].replace(/#|-/g, '').trim(), event.channel)
    }
}