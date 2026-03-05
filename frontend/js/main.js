const API_URL = "http://localhost:5000";
let currentItemType = 0;
let current_saving_name = '';
let username = sessionStorage.getItem('username') || '';

class DataObject{
    constructor(type,name,value,constant,progress){
        this.type = type;
        this.name = name;
        this.value = value;
        this.constant = constant;
        this.progress = progress;
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
            sessionStorage.setItem('username', username);
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
    let summary_income = 0;
    let summary_stable_income = 0;
    let summary_expence = 0;
    let summary_stable_expence = 0;

    const incomes_list = document.getElementById("incomes-items");
    const expences_list = document.getElementById("expences-items");
    const savings_list = document.getElementById("savings-items");

    userData.forEach(element => {
        const item = CreateItem(element);
        if (element.type == 0)
        {
            incomes_list.appendChild(item);
            summary_income += parseFloat(element.value);
            if (element.constant == 1)
            {
                summary_stable_income += parseFloat(element.value);
            }
        }
        if (element.type == 1)
        {
            expences_list.appendChild(item);
            summary_expence += parseFloat(element.value);
            if (element.constant == 1)
            {
                summary_stable_expence += parseFloat(element.value);
            }
        }
        if(element.type ==2)
        {
            savings_list.appendChild(item);
        }
    });
    document.getElementById("summary_income").innerText = `Суммарный доход: ${summary_income.toString()}`;
    document.getElementById("summary_stable_income").innerText = `Постоянный доход: ${summary_stable_income.toString()}`;
    document.getElementById("summary_expence").innerText = `Суммарный расход: ${summary_expence.toString()}`;
    document.getElementById("summary_stable_expence").innerText = `Постоянный расход: ${summary_stable_expence.toString()}`;
    document.getElementById("free_money").innerText = `Остаток: ${(summary_income - summary_expence).toString()}`;
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

       if(!response.ok){
        alert('Не удалось создать запись');
       }
    }
}
function CreateItem(item)
{
    const div = document.createElement('div');
    div.className = 'list-item';
    if (item.type ==2){
        div.innerHTML = `<div class="item-content">${item.name+':'+item.progress+'/'+item.value}</div>`;
    }
    else{
        div.innerHTML = `<div class="item-content">${item.name+':'+item.value}</div>`;
    }
    div.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showContextMenu(e, item);});

    return div;
}
async function RemoveItem(name){
    let url = API_URL + `/RemoveData?username=${encodeURIComponent(username)}&item_name=${encodeURIComponent(name)}`;
    let response = await fetch(url ,{method: 'DELETE'});
    if (!response.ok){
        alert('Не удалось удалить запись');
    }
}
function OpenModal(type)
{ 
    currentItemType = type;
    document.getElementById("add_window").style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function closeModal()
{
    document.getElementById("add_window").style.display = 'none';
    document.body.style.overflow = 'auto';
}
function showContextMenu(e, item) {
    const menu = document.getElementById('context-menu');
    
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
    menu.style.display = 'flex';
    
    menu.setAttribute('data-current-item', item.name);
    menu.setAttribute('data-current-type', item.type);
    
    const deleteBtn = document.getElementById('delete-button');
    const editBtn = document.getElementById('replenish-button');
    
    deleteBtn.onclick = function() {
        RemoveItem(item.name);
    };
    
    if (item.type == 2){
        editBtn.style .display = 'block';
    }
    editBtn.onclick = function() {
        show_topup_window(item.name);
    }
}
function show_topup_window(name){
    current_saving_name = name;
    document.getElementById("topup_window").style.display = 'block';
    document.body.style.overflow = 'hidden';
}
async function topup_saving(){
    const valuebox = document.getElementById("valuebox");
    let data = {
        name: name,
        value: valuebox.value
    };
    let url = API_URL + `/AddData?username=${encodeURIComponent(username)}`;
    let response = await fetch(url, {method:'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(data)});

    if (!response.ok){
        alert('Не удалось удалить запись');
    }
}
function closeTopup()
{
    document.getElementById("topup_window").style.display = 'none';
    document.body.style.overflow = 'auto';
}