const userModel =require("../models/user.model")
const bycrypt =require('bcryptjs')
const jwt =require('jsonwebtoken')
const foodPartnerModel =require("../models/foodpartner.model")

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
}

/**
 * @function registerUser
 * @access Public
 * @description Registers a new user by validating email uniqueness, hashing the password, creating the user, and issuing a JWT auth cookie.
 */
async function registerUser(req, res){
    const {fullName, email , password} =req.body

    const isUserAlreadyExsist = await userModel.findOne({
        email
    })

    if(isUserAlreadyExsist){
        return res.status(400).json({
            message:"User already exsist"
        })
    }

    const hashedPassword = await bycrypt.hash(password,10)
    const user = await userModel.create({
        fullName,email,password:hashedPassword
    })
    
   const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET
);
    res.cookie("token", token, COOKIE_OPTIONS)
    res.status(201).json({
        message:"User register sccessfully",
        user:{
            _id: user.id,
            _email: user.email,
            _fullName: user.fullName
        }
    })
}

/**
 * @function loginUser
 * @access Public
 * @description Authenticates a user by verifying email and password, then issuing a JWT auth cookie.
 */

async function loginUser(req,res){
    const {email,password} =req.body 
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    
    const isPasswordValid = await bycrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET
    )
    res.cookie("token", token, COOKIE_OPTIONS)
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            _id: user.id,
            _email: user.email,
            _fullName: user.fullName
        }
    })
}

/**
 * @function logoutUser
 * @access Public
 * @description Logs out the current user by clearing the auth token cookie.
 */
async function logoutUser(req,res){
    res.clearCookie("token", COOKIE_OPTIONS)
    res.status(200).json({
        message:"User logout successfully"
    })


}

/**
 * @function registerFoodPartner
 * @access Public
 * @description Registers a new user by validating email uniqueness, hashing the password, creating the user, and issuing a JWT auth cookie.
 */
async function registerFoodPartner(req,res){
    const {name,email,password,phone,address,contactName}=req.body;
    const isAccountAlreadyExist = await foodPartnerModel.findOne({email})
    if(isAccountAlreadyExist){
        return res.status(400).json({
            message:"Food Partner accont already exist"
        })
    }
    const hashedPassword = await bycrypt.hash(password,10)

    const foodPartner = await foodPartnerModel.create({
    name,email,password:hashedPassword,phone,address,contactName
    })

       const token = jwt.sign(
  { id: foodPartner._id },
  process.env.JWT_SECRET
);
    res.cookie("token", token, COOKIE_OPTIONS)
    res.status(201).json({
        message:"Food Partner registered successfully",
        foodPartner:{
            _id: foodPartner._id,
            email: foodPartner.email,
            fullName: foodPartner.name,
            phone: foodPartner.phone,
            address: foodPartner.address,
            contactName: foodPartner.contactName
        }
    })
}

/**
 * @function loginFOodPartner
 * @access Public
 * @description Authenticates a user by verifying email and password, then issuing a JWT auth cookie.
 */
async function loginFoodPartner(req,res){
    const {email,password} =req.body 
    const foodPartner = await foodPartnerModel.findOne({email})

    if(!foodPartner){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    
    const isPasswordValid = await bycrypt.compare(password,foodPartner.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign(
        {id:foodPartner._id},
        process.env.JWT_SECRET
    )
    res.cookie("token", token, COOKIE_OPTIONS)
    res.status(200).json({
        message:"Food Partner logged in successfully",
        foodPartner:{
            _id: foodPartner.id,
            _email: foodPartner.email,
            _fullName: foodPartner.name
        }
    })
}

/**
 * @function logoutFoodPartner
 * @access Public
 * @description Logs out the current user by clearing the auth token cookie.
 */
async function logoutFoodPartner(req,res){
    res.clearCookie("token", COOKIE_OPTIONS)
    res.status(200).json({
        message:"Food Partner logout successfully"
    })

}




module.exports ={ 
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
};