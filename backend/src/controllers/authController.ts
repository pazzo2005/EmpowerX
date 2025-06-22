import {Request ,Response} from 'express';
import User,{IUser} from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const generateToken = (user:IUser) => {
    return jwt.sign(
        {id:user._id,email:user.email,role:user.role},
        process.enc.JWT_SECRET || 'supersecret',
        {expiresln:'1d'}
    );
};
export const signup = async (req:Request,res:Response) =>{
    const{name,email.password,role} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User aready exists!'});
        }
        const newUser = new User({name,email,password,role});
        await newUser.save();
        const token = generateToken(newUser);
        re.status(201).json({
            message:'User created succesfully',
            token,
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role,
            },
        });
    }catch(error){
        console.error('Signup error:',error);
        res.status(500).json({message:'Server error during signup'});
    }
};
export const login = async(req:Request,res:response)=>{
    const{email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message:'Invalid  email or password'});
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(401).json({message:'Invalid email or password'});
        const token  = generateToken(user);
        res.status(200).json({
            message:'Login successful',
            token,
            user:{
                id:user_id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
        });
    } catch (error){
        console.error('login error',error);
        res.status(500).json({message:'Server error during login'});
    }
};