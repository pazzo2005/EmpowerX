import mongoose,{Schema,Document } from 'mongoose';
import bcrypt from 'bcryptjs';
export interface IUser extends Document {
    name:string;
    email:string;
    password:string;
    role:'student' | 'teacher' | 'admin';
    comparePassword:(candidatePassword:string) => Promise<boolean>;
}
const userSchema:Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true,
    },
    password:{
        type : String,
        enum:['student','teacher','admin'],
        default:'student',
    },
    role :{
        type:String,
        enum:['student','teacher','admin'],
        default:'student',
    },
},
{
    timestamps:true,
}
);
userSchema.pre<IUser>('save',async function(next){
    if(!this.isModified('password')) return next();
    const salt= await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});
 userSchema.methods.comparePassword = async function(candidatePassword:string):Promise<boolean>{
    return bcrypt.compare(candidatePassword,this.password);

 };
 const User = mongoose.model<IUser>('User',userSchema);
 export default User;