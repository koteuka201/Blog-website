import { UrlPost, GetTags } from "./RequestURL.js";
import { getTags, fetchCreatePost } from "./fetchRequests.js";

const Token=localStorage.getItem('token')
if(!Token){
    window.location.href='/login'
}
const CreatePostBtn=document.getElementById('CreatePostBtn')

readingTime.addEventListener('input', function(event) {
    const inputValue = event.target.value;
    const filteredValue = inputValue.replace(/\D/g, '');
    event.target.value = filteredValue;
});
const titleError=document.getElementById('titleError')
const timeError=document.getElementById('timeError')
const textError=document.getElementById('textError')
const createError=document.getElementById('createError')

await getTags()

CreatePostBtn.addEventListener('click', async function(event){
    await buildPost()
})

async function buildPost(){
    const token=localStorage.getItem('token')
    const title = document.getElementById('title').value
    const readingTime= document.getElementById('readingTime').value
    const groupOption = document.getElementById('groupSelect').value
    const addressId="3fa85f64-5717-4562-b3fc-2c963f66afa6"
    const image = document.getElementById('imageLink').value
    const description = document.getElementById('postText').value

    const response=await fetch(GetTags,{
        method: 'GET',
        headers: {         
            'Content-Type': 'application/json',
        },
    })
    const responseData=await response.json()
    const tagsList=document.getElementById('tagSearch')

    const tags= Array.from(tagsList.selectedOptions).map(option => option.value)
    tags.forEach((selectedTagName, index) => {
        const selectedTagObject = responseData.find(tag => tag.name === selectedTagName)
        tags[index] = selectedTagObject.id
    });
    
    const postData = {
        title,
        description,
        readingTime,
        image,
        //addressId,
        tags
    }

    if (title!=''){
        titleError.style.display='none'
    }
    else {
        titleError.style.display='block'
    }

    if (description!=''){
        textError.style.display='none'
    }
    else{
        textError.style.display='block'
    }
    if (readingTime!=''){
        timeError.style.display='none'
    }
    else{
        timeError.style.display='block'
    }
    if (title!='' && description!='' && readingTime!=''){
        if(token){
            console.log(postData)
            await fetchCreatePost(postData,token)
            window.location.href='/'

        }
        else{
            window.location.href='/login'
        }
    }
    else{
        createError.style.display='block'
    }

}




