const axios = require('axios')
const qs = require('qs');
const database = require('../../../db/database')

module.exports = {
    post: async (args) => {
        const result = await axios.post(`${process.env.API_URL}/chat.postMessage`, qs.stringify(args));
        try {
            if (result.data.ok === false){
                console.log(result.data);
            }
        } catch (e) {
            console.log(e.message);
        }
    },
    increaseUser:  (user, channel) => {
        database.connect().then(async dbClient => {
            const users = dbClient.collection('users');
            const query = { _id: user.trim() };
            const update = {$inc: { score: 1 }};
            const options =  { upsert: true }
            let upsertResult = await users.updateOne(query, update, options);
            if (upsertResult.modifiedCount === 1 || upsertResult.upsertedCount === 1) {
                let updatedUser = await users.findOne(query);
                let params = {
                    token: process.env.SLACK_ACCESS_TOKEN,
                    channel: channel,
                    text: ':thumbsup: Point added to <@' + user.trim() + '>.  They now have ' + updatedUser.score + ' points.',
                };
                await module.exports.post(params);
            }

        })
    },
    decreaseUser: (user, channel) => {
        database.connect().then(async dbClient => {
            const users = dbClient.collection('users');
            const query = { _id: user.trim() };
            const update = {$inc: { score: -1 }};
            const options =  { upsert: true }
            let upsertResult = await users.updateOne(query, update, options);
            if (upsertResult.modifiedCount === 1 || upsertResult.upsertedCount === 1) {
                let updatedUser = await users.findOne(query);
                let params = {
                    token: process.env.SLACK_ACCESS_TOKEN,
                    channel: channel,
                    text: ':thumbsdown: Point removed from <@' + user.trim() + '>.  They now have ' + updatedUser.score + ' points.',
                };
                await module.exports.post(params);
            }

        })
    },

    increaseThing: (thing, channel) => {
        console.log(thing)
        database.connect().then(async dbClient => {
            const things = dbClient.collection('things');
            const query = { _id: thing };
            const update = {$inc: { score: 1 }};
            const options =  { upsert: true }
            let upsertResult = await things.updateOne(query, update, options);
            if (upsertResult.modifiedCount === 1 || upsertResult.upsertedCount === 1) {
                let updatedUser = await things.findOne(query);
                let params = {
                    token: process.env.SLACK_ACCESS_TOKEN,
                    channel: channel,
                    text: ':thumbsup: Point added to ' + thing + '.  It now has ' + updatedUser.score + ' points.',
                };
                await module.exports.post(params);
            }
        })
    },

    decreaseThing: (thing, channel) => {
        database.connect().then(async dbClient => {
            const things = dbClient.collection('things');
            const query = { _id: thing };
            const update = {$inc: { score: -1 }};
            const options =  { upsert: true }
            let upsertResult = await things.updateOne(query, update, options);
            if (upsertResult.modifiedCount === 1) {
                let updatedUser = await things.findOne(query);
                let params = {
                    token: process.env.SLACK_ACCESS_TOKEN,
                    channel: channel,
                    text: ':thumbsdown: Point removed from ' + thing + '.  It now has ' + updatedUser.score + ' points.',
                };
                await module.exports.post(params);
            }
        })
    },
    shame(user,channel){
        let blocks = [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":shame: SHAME :shame: \n\n\n<@" + user.trim() + "> tried to modify their own score!"
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "https://media.giphy.com/media/W81qSImkIxkNq/giphy.gif",
                        "alt_text": "SHAME!"
                    }
                }
            ]
        let params = {
            token: process.env.SLACK_ACCESS_TOKEN,
            channel: channel,
            blocks: JSON.stringify(blocks),
        }
        module.exports.post(params);
    }

};