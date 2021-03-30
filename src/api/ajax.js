import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, type='GET'){
    return new Promise((resolve, reject)=>{
        let Promise;
        if(type==="GET"){
            Promise= axios.get(url, {params: data});
        }
        else{
            Promise= axios.post(url,data);
        }
        Promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{
            message.error('error:' + error.message);
        })
    })

}

// //Login
// ajax('login', {username: 'Tom', password: '123456'}, 'POST').then();
// //Add user
// ajax('/manage/user/add', {username: 'Tom', password: '123456'}, 'POST').then();