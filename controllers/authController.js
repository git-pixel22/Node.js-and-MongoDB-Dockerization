const User = require("../models/userModel");

exports.signUp = async (req, res) => {
    try{
        const newUser = await User.create(req.body);
        req.status(201).json({
            status: 'success',
            data: {
                user: newUser
            },
        });
    }catch(e){
        res.status(400).json({
            status: 'fail',
        });
    }
}