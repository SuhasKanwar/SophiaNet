/** Local evaluation account/session only; no production OAuth bypass is installed. */
import fs from 'node:fs';
import http from 'node:http';
import dns from 'node:dns/promises';
import { spawnSync } from 'node:child_process';
import { encode } from 'next-auth/jwt';

const manifest='/tmp/sophianet-evaluation-fixture.json';
const mode=process.argv[2];
if (!['start','cleanup'].includes(mode)) throw new Error('Use start or cleanup');
if(mode==='start' && fs.existsSync(manifest)) throw new Error('Clean up the existing evaluation fixture before creating another');
const id=mode==='start' ? `sophianet-eval-${Date.now()}` : JSON.parse(fs.readFileSync(manifest,'utf8')).id;
if (!/^sophianet-eval-\d+$/.test(id)) throw new Error('Invalid fixture identifier');
const url=new URL(process.env.DATABASE_URL);
const address=await dns.lookup(url.hostname,{family:4});
const sql=mode==='start' ? `INSERT INTO "User" (id,name,"updatedAt") VALUES ('${id}','SophiaNet Evaluation',CURRENT_TIMESTAMP);` : `DELETE FROM "User" WHERE id = '${id}';`;
const result=spawnSync('psql',['--no-psqlrc','--set=ON_ERROR_STOP=1'],{
  input:sql,encoding:'utf8',timeout:25000,
  env:{...process.env,PGHOST:url.hostname,PGHOSTADDR:address.address,PGPORT:url.port||'5432',PGUSER:decodeURIComponent(url.username),PGPASSWORD:decodeURIComponent(url.password),PGDATABASE:decodeURIComponent(url.pathname.slice(1)),PGSSLMODE:'require',PGCONNECT_TIMEOUT:'15'},
});
if(result.status!==0) throw new Error('Evaluation fixture database operation failed; credentials are not logged');
if(mode==='cleanup') { fs.unlinkSync(manifest);console.log('Evaluation account and cascaded conversations removed'); }
else {
  fs.writeFileSync(manifest,JSON.stringify({id,port:3003}));
  const token=await encode({token:{id,sub:id,name:'SophiaNet Evaluation'},secret:process.env.NEXTAUTH_SECRET,maxAge:3600});
  http.createServer((request,response)=>{
    response.writeHead(302,{'Set-Cookie':`next-auth.session-token=${token}; Path=/; HttpOnly; SameSite=Lax`,Location:'http://localhost:3001/chatbot'});
    response.end();
  }).listen(3003,'127.0.0.1',()=>console.log('Local evaluation session ready at http://localhost:3003; OAuth login is not evaluated'));
}
