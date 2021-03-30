import ajax from "./ajax";
import jsonp from 'jsonp';

const BASE='';


// export function reqLogin(username, password){
//     return ajax('login', {username, password}, 'POST')
// }

export const reqLogin=(username, password)=>ajax(BASE+'/login', {username, password}, 'POST');

// export const reqAddUser=(user)=>ajax('/manage/user/add', user, 'POST');

export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST');

export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST');

export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize});

export const reqWeather = (city)=>{
    const url='https://community-open-weather-map.p.rapidapi.com/weather?q={city}%2Cuk&lat=0&lon=0&callback=test&id=2172797&lang=null&units=%22metric%22%20or%20%22imperial%22&mode=xml%2C%20html';
    jsonp(url, {}, (err, data)=>{
        console.log( 'jsonp()',err, data);
    })
}

export const  reqSearchProducts=({pageNum, pageSize, searchName, searchType})=>ajax(BASE + '/manage/product/search', {
    pageNum, pageSize, 
    [searchType]: searchName,
});

export const reqCategory =(categoryId)=>ajax(BASE+'/manage/category/info', {categoryId});

export const reqUpdateStatus =(productId, status)=>ajax(BASE+'/manage/product/updateStatus', {productId, status}, 'POST');

export const reqDeleteImg = (name) =>ajax(BASE+'/manage/img/delete', {name}, 'POST');

export const reqAddOrUpdateProduct = (product) =>ajax(BASE+'/manage/product/'+(product._id?'update':'add'), product, 'POST');

export const reqRoles= () =>ajax(BASE+'/manage/role/list');

export const reqAddRole= (roleName) =>ajax(BASE+'/manage/role/add', {roleName}, 'POST');

export const reqUpdateRole= (role) =>ajax(BASE+'/manage/role/update', role, 'POST');

export const reqUsers= () =>ajax(BASE+'/manage/user/list');

export const reqDeleteUser= (userId) =>ajax(BASE+'/manage/user/delete',{userId},"POST");

export const reqAddOrUpdateUser= (user) =>ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,"POST");