import dotenv from 'dotenv';
import {fileURLToPath} from 'node:url';
dotenv.config({path:fileURLToPath(new URL('../.env',import.meta.url)),quiet:true});
if(!process.env.MONGODB_URI&&process.env.NODE_ENV!=='production')process.env.MONGODB_URI='mongodb://127.0.0.1:27017/forty_years_of_fees';

for(const key of ['GEMINI_API_KEY','OPENAI_API_KEY']){const value=process.env[key]?.trim();if(!value||/^(your_|replace|example)/i.test(value))delete process.env[key];else process.env[key]=value;}
