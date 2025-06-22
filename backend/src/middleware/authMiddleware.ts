import {Request,Respone,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
interface DecodedToken {
    id:string;
    email:string;
    role:string;
}
declare global {
    namespace Express{
        interface Request{
            user?:DecodedToken;
        }
    }
}
export const protect = (req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message:'Unauthorized:No token provider'});
    }
    const token = authHeader.split('')[1];
    try{
        const decoded = jwt.verify(token,process.env.JWTSECRET ||'') as DecodedToken;
        req.user =decoded;
        next();
    }catch(error){
        console.error('JWT verfication failed',err);
        return res.status(401).json({message:'Unauthorized:Invalid Token'});
    }
};