const API_URL = "http://localhost:5000";

async function Login() 
{
    const username_box = document.getElementById('username_box');
    const password_box = document.getElementById('password_box');
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
        if(result == 1){
            window.location.href = 'Main.html';
        }
        else{
            alert('Неверный логин или пароль');
        }
    }
    catch(error){
        alert("Ошибка при авторизации!");
    }
}
async function Registration()
{
    const username_box = document.getElementById('username_box');
    const password_box = document.getElementById('password_box');
    const username = username_box.value.trim();
    const password = password_box.value.trim();

    if(!username || !password){
        alert('Введите имя пользователя и пароль!');
        return;
    }

    const url = API_URL + `/Reg?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    try{
        const response = await fetch(url);
        const result = await response.json();
        if (result ==1){
            alert('Аккаунт успешно создан!');
            window.location.href = 'Index.html';
        }
        else{
            alert('Аккаунт с таким именем уже существует, пожалуйста, выберите другое');
        }
    }
    catch(error){
        alert('Ошибка при создании аккаунта, попробуйте ещё раз');
    }
}