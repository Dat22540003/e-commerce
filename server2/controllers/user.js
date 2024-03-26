const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')

const jwt = require('jsonwebtoken')
const register = asyncHandler(async(req, res) => {
    const {email, password, firstname, lastname} = req.body
    if (!email || !password || !lastname || !firstname)
    return res.status(400).json({
        success: false,
        mes: 'Missing inputs'
})

    const user = await User.findOne({email})
    if (user)
        throw new Error('User has existed!')
    else{
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register is sucessfully. Please go login~' : 'Something went wrong'
        })
    }

})
// Refresh token => Cap moi access token
// Access token => Xac thuc nguoi dung, phan quyen nguoi dung
const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if (!email || !password)
    return res.status(400).json({
        success: false,
        mes: 'Missing inputs'
})
    const response = await User.findOne({email})
    //console.log(await response.isCorrectPassword(password));
    if (response && await response.isCorrectPassword(password)){
        //Tach password va role ra khoi response
        const {password, role, ...userData} = response.toObject()
        //Tao access tken
        const accessToken = generateAccessToken(response._id, role)
        // Tao refresh token
        const refreshToken = generateRefreshToken(response._id)
        //Luu refresh token vao database
        await User.findByIdAndUpdate(response._id, {refreshToken}, {new:true})
        //Luu refresh token vao cookie
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    }else{
        throw new Error('Invalid credentials')
    }
})

const getCurrent = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const user = await User.findById(_id)
    return res.status(200).json({
        success: false,
        rs: user ? user : 'User not found'
    })
})
const refreshAccessToken = asyncHandler(async(req, res) => {
    // Lay token tu cookies
    const cookie = req.cookies
    // Check xem co token hay khong
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Check token co hop le hay khong
    jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async(err, decode) => {
        if (err) throw new Error('Invalid refresh token')
        // Check xem token co khop voi token da luu trong db
        const response = await User.findOne({_id: decode._id, refreshToken: cookie.refreshToken})
        return res.status(200).json({
            sucess: response ? true : false,
            newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
        })
    })
})
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken
}