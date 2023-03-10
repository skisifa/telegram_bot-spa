import { Bot } from "https://deno.land/x/grammy@v1.15.0/mod.ts";
import "https://deno.land/std@0.178.0/dotenv/load.ts";
import {cron, daily, monthly, weekly} from 'https://deno.land/x/deno_cron/cron.ts';





// const env = await load();
// PATH JSON;
const PATH_JSON = "./data/data.json"; 
// URL;
const URL_API = "https://faq-comp.deno.dev/api";

//timmer
let timer = 1;

const bot = new Bot(Deno.env.get("TOKEN"));
let id_chat = Deno.env.get("CHATID");

async function readJson(){
    const str = await Deno.readTextFile(PATH_JSON);
    return JSON.parse(str);
    
}
async function writeJson(data:string){
    const json = JSON.stringify(data);
    await Deno.writeTextFile(PATH_JSON,json);
}
async function getInfo(){
    // console.log("hi i load it!");
    let data = await readJson();
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
    await writeJson(data); 
}
let runing = false; 
cron(`*/${timer} * * * * *`,async ()=>{
    console.log("LOAD!");
    if(!runing){
        console.log("GET IT!");
        runing = true;
        await getInfo();
        runing = false;

    }
});


bot.start();
console.log("start bot!");




