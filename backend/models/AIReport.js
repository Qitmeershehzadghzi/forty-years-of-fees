import mongoose from 'mongoose';
export const AIReport=mongoose.model('AIReport',new mongoose.Schema({fingerprint:{type:String,unique:true,required:true},model:String,text:String,selection:mongoose.Schema.Types.Mixed,evidence:mongoose.Schema.Types.Mixed,createdAt:{type:Date,default:Date.now}}));
