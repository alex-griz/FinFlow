const API_URL = "http://localhost:5000";
let username = ''

class DataObject{
    constructor(type,name,value,constant){
        this.type = type;
        this.name = name;
        this.value = value;
        this.constant = constant;
    }
}
async function Login() 
{
    const username_box = document.getElementById('username_box');
    const password_box = document.getElementById('password_box');
    username = username_box.value.trim();
    let password = password_box.value.trim();

    if(!username || !password){
        alert('Введите имя пользователя и пароль!');
        return;
    }
    let url = API_URL+`/Auth?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    try{
        let response = await fetch(url);
        let result = await response.json();
        if(result === 1){
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
    username = username_box.value.trim();
    let password = password_box.value.trim();

    if(!username || !password){
        alert('Введите имя пользователя и пароль!');
        return;
    }

    let url = API_URL + `/Reg?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    try{
        let response = await fetch(url);
        let result = await response.json();
        if (result === 1){
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
async function LoadData()
{
    let url = API_URL +`/LoadData?username=${encodeURIComponent(username)}`;
    let response = await fetch(url);
    let userData = (await response.json()).map(item => new DataObject(item.type,item.name, item.value, item.constant));

    const incomes_list = document.getElementById("incomes-items");
    const expences_list = document.getElementById("expences-items");
    const savings_list = document.getElementById("savings-items");

    userData.forEach(element => {
        const item = CreateItem(element);
        if (element.type == 0)
        {
            incomes_list.appendChild(item);
        }
        if (element.type == 1)
        {
            expences_list.appendChild(item);
        }
        if(element.type ==2)
        {
            savings_list.appendChild(item);
        }
    });
}
async function AddData(item_type)
{
    const namebox = document.getElementById("name-box");
    const valuebox = document.getElementById("value-box");
    const constvaluebox = document.getElementById("const-value");
    if(!namebox.value || !valuebox.value){
        alert('Заполните все поля!');
        return;
    }
    else{
        let userData = {
        type: item_type,
        name: namebox.value,
        value: valuebox.value,
        constant: constvaluebox.checked ? 1 : 0
       };
       let url = API_URL + `/AddData?username=${encodeURIComponent(username)}`;
       let response = await fetch(url, {method:'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(userData)});

       if(response.ok){
        alert('Запись успешно добавлена!');
       }
       else{
        alert('Не удалось создать запись');
       }
    }
}
function CreateItem(item)
{
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
    <div class="item-content">${item.name+':'+item.value}</div>`;
    return div;
}
function OpenModal()
{ 
    document.getElementById("add_window").style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function closeModal()
{
    document.getElementById("add_window").style.display = 'none';
    document.body.style.overflow = 'auto';
}