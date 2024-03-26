const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// Bearer token
// headers: { authorization: Bearer token}
const verifyAccessToken = asyncHandler(async(req, res, next) => {
    if(req?.headers?.authorization?.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) return res.status(401).json({
                sucess: false,
                mes: 'Invalid acess token'
            })
            console.log(decode);
            req.user = decode
            next()
        })
    } else {
        return res.status(401).json({
            sucess: false,
            mes: 'Require authentication!!!'
        })
    }
})


module.exports = {
    verifyAccessToken
}