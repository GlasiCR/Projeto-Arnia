//_variáveis cadastro de usuário
let cad_nameUser = document.querySelector('.cad_nameUser')
let cad_emailUser = document.querySelector('.cad_emailUser')
const txt_pass_noCheck = document.querySelector('.txt_pass_noCheck')
const text_passInvalid = document.querySelector('.text_passInvalid')
const bt_prosseguir1 = document.querySelector('.bt_prosseguir1')
const bt_prosseguir2 = document.querySelector('.bt_prosseguir2')
const first_cadUser = document.querySelector('.first_cadUser')
const second_cadUser = document.querySelector('.second_cadUser')
const div_cadUser = document.querySelector('.div_cadUser')
const text_inputClean = document.querySelector('.text_inputClean')
const text_inputClean2 = document.querySelector('.text_inputClean2')
//_variáveis login usuário
const div_form_login = document.querySelector('.div_form_login')
const bt_entrar = document.querySelector('.bt_entrar')
const bt_cadastro = document.querySelector('.bt_cadastro')
let text_cadInvalid = document.querySelector('.text_cadInvalid')
const cad_checkPasswordUser = document.querySelector('.cad_checkPasswordUser')

//_variáveis adicionais
let status_logado = false

//_tela de login
async function create_user(user){
    await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
}

async function get_user(email, senha){
    const res_fetch = await fetch('http://localhost:3000/user?email='+ email + '&password='+ senha)
    const list_users = await res_fetch.json()
    console.log('http://localhost:3000/user?email='+ email + '&password='+ senha)
    return list_users
}

bt_entrar.addEventListener('click', async function check_cadUser(e){
    e.preventDefault()
    let email_user = document.querySelector('.email_user').value
    let password_user = document.querySelector('.password_user').value
    let list_users = await get_user(email_user, password_user)  
    if(list_users.length > 0){
        const userLogado = list_users[0]
        //window.location.href = `patient.html?nome=${userLogado.name}&email=${userLogado.email}`;
        window.location.href = `patient.html`;
    }else if(email_user == "" || password_user == ""){
        text_inputClean.style.display = "block"
        text_inputClean.innerHTML = "Todos os campos devem ser preenchidos" 
        console.log("campos em branco")
    }else{
        text_cadInvalid.style.display = "block"
        text_cadInvalid.innerHTML = "Usuário ou senha inválido. Se ainda não tem cadastro, clique em 'Cadastre-se'" 
        console.log("não tem cadastro")
    }
})

bt_cadastro.addEventListener('click', (e) => {
    e.preventDefault()
    div_form_login.style.display = "none"
    div_cadUser.style.display = "block"
    first_cadUser.style.display = "block"
    second_cadUser.style.display = "none"
    console.log("chamei a parte de cadastro, 74")
})
bt_prosseguir1.addEventListener('click', (e) => {
    e.preventDefault()
    if(cad_emailUser.value == "" || cad_nameUser.value == ""){
        text_inputClean2.style.display = "block"
        text_inputClean2.innerHTML = "Todos os campos devem ser preenchidos" 
    }else{
        first_cadUser.style.display = "none"
        div_cadUser.style.display = "block"
        second_cadUser.style.display = "block"
        div_form_login.style.display = "none"
    }
})
function cleanTexts(){
    txt_pass_noCheck.style.display = "none"
    text_passInvalid.style.display = "none"
    text_cadInvalid.style.display = "none"
    text_inputClean.style.display = "none"
    text_inputClean2.innerHTML = ""
    console.log("clean texts")
}
bt_prosseguir2.addEventListener('click', async function add_user(e){
    e.preventDefault()
    //console.log(cad_passwordUser.value)
    let cad_passwordUser = document.querySelector('.cad_passwordUser')
    let cad_checkPasswordUser = document.querySelector('.cad_checkPasswordUser')        
    if(validatorPassword(cad_passwordUser.value)===true && cad_passwordUser.value === cad_checkPasswordUser.value){
        const user = {
            name: cad_nameUser.value,
            email: cad_emailUser.value,
            password: cad_passwordUser.value,
        }   
        await create_user(user)
        
        localStorage.setItem('nome', user.name);
        localStorage.setItem('email', user.email);
                
        return_pageFirst()
    }else if(validatorPassword(cad_passwordUser.value)===false){
        text_passInvalid.style.display = "block"
        text_passInvalid.innerHTML = "A senha digitada não é válida"
        console.log("erro regex")
    }else if(cad_passwordUser.value !== cad_checkPasswordUser.value){
        txt_pass_noCheck.style.display = "block"
        txt_pass_noCheck.innerHTML = "Senhas não conferem"
        console.log("erro confirmação senha")
    }else{
        txt_pass_noCheck.innerHTML=""
    }
})
//Regex: validação e-mail
function validatorPassword(password){
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
    return regexPassword.test(password)
}
function return_pageFirst(){
    div_form_login.style.display = "block"
    div_cadUser.style.display = "none"
    first_cadUser.style.display = "none"
    second_cadUser.style.display = "none"
    console.log("função retorna")
}