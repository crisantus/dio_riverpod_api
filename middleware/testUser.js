const {BadRequestError} = require('../errors/index')

const testUser = (req,res,next)=>{
    if(req.user.testUser){
        throw new BadRequestError('Test User. Only read');
    }
    next();
}

module.exports = testUser;