import fs from 'fs';
import path from 'path';

export interface Identity{
    id: string;
    email: string;
    password: string;
}

export class IdentityProvider {
    load(): Identity[] {

        const raw=JSON.parse(fs.readFileSync(path.resolve(__dirname, 'users.template.json'), 'utf-8'));

       return raw.map((u:any)=>{
        const email=process.env[u.emailEnv];
        const password=process.env[u.passwordEnv];
        if(!email || !password) throw new Error(`${u.emailEnv} or ${u.passwordEnv} is not set in .env`);
        return {id: u.id, email, password }

    })
}
}



