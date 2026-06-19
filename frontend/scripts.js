const API_URL = "http://localhost:5000";

const button = document.querySelector('button');
const username_box = document.getElementById('username_box');
const password_box = document.getElementById('password_box');

async function Login() 
{
    const username = username_box.value.trim();
    const password = password_box.value.trim();

    if(!username || !password){
        alert('Введите имя пользователя и пароль!');
        return;
    }
    const url = API_URL+`/Auth?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    try{
        const response = await fetch(url);
        const result = await response.json();
    }
    catch(error){
        alert("Ошибка при авторизации!");
    }
}