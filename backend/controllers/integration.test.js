import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {randomUUID} from 'node:crypto';
import {MongoMemoryServer} from 'mongodb-memory-server-core';
const root='C:/Program Files/MongoDB/Server';
if(process.platform==='win32'&&existsSync(root)){for(const version of readdirSync(root).sort().reverse()){const binary=path.join(root,version,'bin/mongod.exe');if(existsSync(binary)){process.env.MONGOMS_SYSTEM_BINARY=binary;process.env.MONGOMS_VERSION=execFileSync(binary,['--version'],{encoding:'utf8',windowsHide:true}).match(/db version v([\d.]+)/)[1];break}}}
test('local workspace: setup, auth, persistence, references, calculation, edits and AI failure isolation',{timeout:120000},async()=>{
 let mongo,server,cookie='',log='';const origin='http://localhost:5173',port=5099;
 async function call(url,method='GET',body,requestOrigin=origin){const response=await fetch(`http://127.0.0.1:${port}/api${url}`,{method,headers:{Origin:requestOrigin,'Content-Type':'application/json',Cookie:cookie},body:body?JSON.stringify(body):undefined});const data=await response.json();if(response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];return {status:response.status,data};}
 try{
  mongo=await MongoMemoryServer.create();server=spawn(process.execPath,['server.js'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),MONGODB_URI:mongo.getUri(),APP_ORIGIN:origin,NODE_ENV:'development',OPENAI_API_KEY:'',GEMINI_API_KEY:'',ADMIN_EMAIL:'',ADMIN_PASSWORD_HASH:'',SEED_PBS_REFERENCE:'false'},windowsHide:true,stdio:['ignore','pipe','pipe']});server.stdout.on('data',b=>log+=b);server.stderr.on('data',b=>log+=b);
  let ready=false;for(let i=0;i<100;i++){try{if((await call('/health')).status===200){ready=true;break}}catch{}await delay(150)}assert.ok(ready,log);
  assert.equal((await call('/workspace/data')).status,401);
  assert.equal((await call('/workspace/status')).data.setupRequired,true);
  const account={email:'research@example.invalid',password:'Synthetic-research-password-2026'};
  assert.equal((await call('/workspace/setup','POST',account,'https://untrusted.invalid')).status,403);
  assert.equal((await call('/workspace/setup','POST',account)).status,201);
  assert.equal((await call('/workspace/setup','POST',account)).status,409);
  assert.equal((await call('/auth/login','POST',account)).status,200);
  const programme=await call('/workspace/programmes','POST',{name:'Synthetic BBA'});assert.equal(programme.status,201);
  const evidence={title:'Synthetic test document',url:'https://example.invalid/source',page:'1',verified:true};
  const fee={key:randomUUID(),year:2020,programmeKey:programme.data.key,amount:20000,unit:'course',component:'tuition',period:'calendar',campus:'Karachi',academicTerm:'annual-observation',notes:'test only',evidence};
  assert.equal((await call('/workspace/fees','PUT',{...fee,amount:''})).status,400);
  assert.equal((await call('/workspace/fees','PUT',fee)).status,200);
  assert.equal((await call('/workspace/fees','PUT',{...fee,key:randomUUID()})).status,409);
  for(const [year,index] of [[2020,100],[2025,300]])assert.equal((await call('/workspace/cpi','POST',{year,index,series:'test',baseYear:'test-base',period:'calendar',evidence})).status,200);
  assert.equal((await call('/workspace/fees','PUT',{...fee,key:randomUUID(),year:2025,amount:40000})).status,200);
  const selection={programme:programme.data.key,series:'test',referenceYear:2025,from:2020,to:2025,unit:'course',component:'tuition',period:'calendar',campus:'Karachi',academicTerm:'annual-observation'};
  let result=await call('/workspace/report?'+new URLSearchParams(selection));assert.equal(result.data.rows[0].real,60000);assert.equal(result.data.counts.adjusted,2);
  assert.equal((await call('/workspace/explain','POST',selection)).status,503);
  assert.equal((await call('/workspace/data')).data.fees.length,2);
  assert.equal((await call('/workspace/fees','PUT',{...fee,amount:25000})).status,200);
  result=await call('/workspace/report?'+new URLSearchParams(selection));assert.equal(result.data.rows[0].real,75000);
  assert.equal((await call('/workspace/cpi','POST',{year:2020,index:999,series:'test',baseYear:'test-base',period:'calendar',evidence})).status,409);
  assert.equal((await call('/auth/logout','POST')).status,200);assert.equal((await call('/workspace/data')).status,401);
 }finally{if(server){server.kill();await new Promise(resolve=>{if(server.exitCode!==null)resolve();else{server.once('exit',resolve);setTimeout(resolve,3000)}})}if(mongo)await mongo.stop();}
});
