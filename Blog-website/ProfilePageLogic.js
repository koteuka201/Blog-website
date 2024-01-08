import { GetProfile } from "./RequestURL.js";

const token=localStorage.getItem('token');
if(!token){
    window.location.href='/login'
}
const profileData=await getProfile(token);
if(profileData===401){
    window.location.href='/login'
}
console.log(profileData);
document.getElementById('email').value = profileData.email;
document.getElementById('name').value = profileData.fullName;
document.getElementById('phone').value = await refactorPhone(profileData.phoneNumber);
document.getElementById('gender').value = profileData.gender.toLowerCase();
document.getElementById('datebirth').value = (profileData.birthDate).substring(0, 10);

const saveBtn=document.getElementById('saveProfileBtn');

saveBtn.addEventListener('click', async function(event){
    
    const email=document.getElementById('email').value;
    const phoneNumber=document.getElementById('phone').value;
    const fullName=document.getElementById('name').value;
    const gender=document.getElementById('gender').value;
    const birthDate=document.getElementById('datebirth').value;

    const emailError=document.getElementById('mailError');
    const phoneError=document.getElementById('phoneError');
    const dateError=document.getElementById('dateError');

    const emailCheck=await IsValidEmail(email);
    const phoneCheck=await IsValidPhone(phoneNumber);
    const dateCheck=await IsValidDate(birthDate);

    const profileDataEdit={
        email,
        fullName,
        birthDate,
        gender,
        phoneNumber,
    }

    if(!emailCheck){
        emailError.style.display='block'
    }
    else{
        emailError.style.display='none'
    }
    if(!dateCheck || birthDate==''){
        dateError.style.display='block'
    }
    else{
        dateError.style.display='none'
    }
    if(!phoneCheck){
        phoneError.style.display='block'
    }
    else{
        phoneError.style.display='none'
    }
    if (fullName!='' && emailCheck && dateCheck && birthDate!='' && emailCheck && phoneCheck){
        const response=EditProfile(profileDataEdit,token);
        if (response===401){
            window.location.href='/login'
        }
        //location.reload()

        console.log('log', profileDataEdit)
    }
    
})
async function IsValidEmail(email){
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
async function IsValidPhone(phone){

    const Mask = /^\+7\d{10}$/.test(phone);
  
    if (Mask) {
      return true;
    }
  
    return false;
}
async function IsValidDate(date){
    const compDate = new Date('2009-01-01');
    const selDate= new Date(date);
    if (selDate>compDate){
        return false;
    }
    else{
        return true;
    }
}

async function getProfile(token){
    const response= await fetch(GetProfile, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,          
            'Content-Type': 'application/json',
        },
    });
    if(response.ok){
        return await response.json();
    }
    else{
        response.status;
    }
}
async function EditProfile(EditData, token){
    const response= await fetch(GetProfile, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,          
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(EditData)
    });
    return response.status;
}
async function refactorPhone(phone){
    const cleanNumber = phone.replace(/\D/g, '');
    const outputPhone='+'+cleanNumber;
    return outputPhone;
}
