import { Logout } from "./RequestURL.js";

let response;
let responseT;
let contentCard;

const token=localStorage.getItem('token')

const pathName=window.location.pathname;

switch(pathName){
    case '/login':
        response = await fetch('/LoginPage.html');
        responseT= await response.text()
        contentCard = document.getElementById('ContentCard');
        contentCard.innerHTML = responseT;
        contentCard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        });
        break
    case '/':
        response = await fetch('/MainPage.html');
        responseT=await response.text()
        contentCard = document.getElementById('ContentCard');
        contentCard.innerHTML = responseT;

        contentCard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        })
        break
    case '/Profile':
        response = await fetch('/ProfilePage.html');
        responseT=await response.text()
        contentCard = document.getElementById('ContentCard');
        contentCard.innerHTML = responseT;

        contentCard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        })
        break
    case '/Register':
        response = await fetch('/registration.html');
        responseT=await response.text()
        contentCard = document.getElementById('ContentCard');
        contentCard.innerHTML = responseT;

        contentCard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        })
        break
    case '/logout':
        await GetLogout(token)
        localStorage.clear()
        window.location.href='/login'
        break

    case '/CreatePost':
        response = await fetch('/CreatePost.html');
        responseT=await response.text()
        contentCard = document.getElementById('ContentCard');
        contentCard.innerHTML = responseT;

        contentCard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        })
        break
    case '/Authors':
        response = await fetch('/Authors.html');
        responseT=await response.text()
        contentCard = document.getElementById('ContentCard');
        contentCard.innerHTML = responseT;

        contentCard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        })
        break
    case '/Community':
        response = await fetch('/Community.html');
        responseT=await response.text()
        contentCard = document.getElementById('ContentCard');
        contentCard.innerHTML = responseT;

        contentCard.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement("script")
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(script.innerHTML))
            script.parentNode.replaceChild(newScript, script)
        })
        break
    default:
        const url = /^\/ConcretePost\?id=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
        if(pathName=='/ConcretePost'){
            response = await fetch('/ConcretePost.html');
            responseT=await response.text()
            contentCard = document.getElementById('ContentCard');
            contentCard.innerHTML = responseT;

            contentCard.querySelectorAll('script').forEach(script => {
                const newScript = document.createElement("script")
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value)
                })
                newScript.appendChild(document.createTextNode(script.innerHTML))
                script.parentNode.replaceChild(newScript, script)
            })
        }

    break
}
async function GetLogout(token){
    const response= await fetch(Logout, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,          
            'Content-Type': 'application/json',
        },
    });
    return response.status
}