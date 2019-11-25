import { writeJson } from "fs-extra"
import recursive from "recursive-readdir-synchronous";
import axios from "axios"
import { async } from "rxjs/internal/scheduler/async";

export function writeFile(name, object){
    writeJson(name, object, {spaces:2}, err => {
        if (err) return console.error(err)
      
        console.log('success!')
      })
}

export function getFiles(path: string, ignore: string[]){
    return recursive(path, ignore);
}

export function saveData(url:string, data){
    if(url){
        axios.post(url, {
            data
        }, { headers : {'Content-Type': 'application/json;charset=UTF-8'}}).then( res =>{
            console.log(`statusCode: ${res.status}`)
            console.log(res.data)
        }).catch( err => {
            console.error(err);
        })
    } else {
        writeFile("all_result.json", data)
    }
}