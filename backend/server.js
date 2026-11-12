import "./config/env.js";
import app from "./app.js";
import {connectDatabase} from "./config/database.js";
try {
await connectDatabase();
app.listen(process.env.PORT||5000,()=>console.log("Fees API ready"));
} catch(error){console.error(error.message);process.exit(1);}
