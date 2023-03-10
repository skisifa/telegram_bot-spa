import { Bot } from "https://deno.land/x/grammy@v1.15.0/mod.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";
import {cron, daily, monthly, weekly} from 'https://deno.land/x/deno_cron/cron.ts';
const env = await load();
// PATH JSON;
const PATH_JSON = "./data/data.json"; 
// URL;
const URL_API = "https://faq-comp.deno.dev/api";

//timmer
let timer = 1;

const bot = new Bot(env["TOKEN"]);

let id_chat = env["CHATID"];



function readJson(){
    const str = Deno.readTextFileSync(PATH_JSON);
    return JSON.parse(str);
    
}
function writeJson(data:string){
    const json = JSON.stringify(data);
    Deno.writeTextFileSync(PATH_JSON,json);
}





async function getInfo(){
    // console.log("hi i load it!");
    let data = readJson();
    const res = await fetch(URL_API);

    let f_data = JSON.parse(await res.text());
    for (let i = 0; i < f_data["links"].length; i++) {
        let now = false;
        try{
            now = data["titles"][f_data["titles"][i]]["here"];
        }
        catch(e){
            now = false;
        }
        
        if(!now){
            // console.log(data);
            await bot.api.sendPhoto(id_chat,f_data["images"][i],{caption:`${f_data["titles"][i]}\n${f_data["links"][i]}`});
            data["titles"][f_data["titles"][i]] = {"link":f_data["links"][i],"image":f_data["images"][i],"here":true};
            
        }
    }
    // console.log(f_data);
    writeJson(data);
    
     
    




    // 
    // const me =await bot.api.getMe();
    // console.log(readJson());
     
    // console.log(me);
    
    
}


let runing = false; 
 
cron(`*/${timer} * * * * *`,async ()=>{
    // console.log("load");
    if(!runing){
        // console.log("get");
        runing = true;
        await getInfo();
        runing = false;

    }
});
bot.start();
console.log("bot=> start!");
