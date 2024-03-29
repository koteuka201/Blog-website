import { Login } from "./RequestURL.js";

const headListBtn=document.getElementById('dropdownMenuButton');

const EmptyLoginError = document.getElementById('EmptyLoginError');
const LoginError = document.getElementById('LoginError');

const submitBtn=document.getElementById('SubmitButton')
const loginBtn=document.getElementById('LoginButton')

submitBtn.addEventListener('click', async function(event){
    window.location.href='/Register'
})

loginBtn.addEventListener('click', async function(event){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const LoginData = {
        email,
        password
    };
    if (email !== '' && password !== '') {
        const response= await GetLogin(LoginData);
        if (response===400){
            LoginError.style.display='block';
        }
        else{
            const token=response.token;
            console.log('token', token)

            EmptyLoginError.style.display = 'none';
            LoginError.style.display='none';

            localStorage.setItem('token', token);

            headListBtn.textContent = email
            window.location.href='/'


        }
    }
    else {
        EmptyLoginError.style.display = 'block';
    }
})

async function GetLogin(LoginData){
    const response= await fetch(Login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(LoginData)
    })
   if (response.ok){
        return await response.json();
   }
   else{
        return response.status;
   }
}