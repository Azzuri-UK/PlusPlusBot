const crypto = require('crypto');

let signVerification = (req, res, next) => {
    if (req.body.hasOwnProperty('challenge')){
        res.json(req.body.challenge)
    } else {
        res.sendStatus(200)
        const signature = req.headers['x-slack-signature']
        const timestamp = req.headers['x-slack-request-timestamp']
        const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
        const [version, hash] = signature.split('=')
        hmac.update(`${version}:${timestamp}:${req.rawBody}`)
        if (hmac.digest('hex') === hash) {
            next();
        } else {
            console.log('bad hmac')
        }
    }
}
module.exports = signVerification;