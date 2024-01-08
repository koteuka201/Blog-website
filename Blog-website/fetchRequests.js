import { UrlPost, GetTags, GetProfile } from "./RequestURL.js";
export async function getTags(){
    const response=await fetch(GetTags, {
        method: 'GET',
        headers: {         
            'Content-Type': 'application/json',
        },
    });
    const tags=document.getElementById('tagSearch')
    const tagNames=await response.json()
    tags.innerHTML=''
    tagNames.forEach(tag => {
        const option=document.createElement('option')
        option.value=tag.name
        option.text=tag.name
        tags.appendChild(option)
    });    
}
export async function fetchCreatePost(CreatePostData, token){
    const response=await fetch(UrlPost, {
        method: 'POST',
        headers: {         
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(CreatePostData)
    });
    return response.json() 
}
// export function fetchComments(){

// }
export async function fetchPosts(urlFetch, token){
    if(token){
        const response=await fetch(urlFetch, {
            method: 'GET',
            headers: {         
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.json()
    }
    else{
        const response=await fetch(urlFetch, {
            method: 'GET',
            headers: {         
                'Content-Type': 'application/json',
            },
        });
        return response.json()
    }
    
}
export async function fetchAddLike(UrlToLike, token){
    const response=await fetch(UrlToLike, {
        method: 'POST',
        headers: {         
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
}
export async function fetchDeleteLike(UrlToLike, token){
    const response=await fetch(UrlToLike, {
        method: 'DELETE',
        headers: {   
            'Authorization': `Bearer ${token}`,      
            'Content-Type': 'application/json'
        },
    });
}
export async function fetchAuthors(UrlToAuthor){
    const response=await fetch(UrlToAuthor, {
        method: 'GET',
        headers: {        
            'Content-Type': 'application/json',
        },
    });
    return response.json()
}
export async function fetchCommunityGet(UrlToCommunity){
    const response=await fetch(UrlToCommunity, {
        method: 'GET',
        headers: {        
            'Content-Type': 'application/json',
        },
    });
    return response.json()
}
export async function fetchCheckRole(UrlToCommunity, token){
    const response=await fetch(UrlToCommunity, {
        method: 'GET',
        headers: {        
            'Authorization': `Bearer ${token}`,      
            'Content-Type': 'application/json'
        },
    });
    return response.json()
}
export async function fetchSubscribeCommunity(UrlToCommunitySub, token){
    const response=await fetch(UrlToCommunitySub, {
        method: 'POST',
        headers: {        
            'Authorization': `Bearer ${token}`,      
            'Content-Type': 'application/json'
        },
    });
}
export async function fetchUnSubscribeCommunity(UrlToCommunityUnSub, token){
    const response=await fetch(UrlToCommunityUnSub, {
        method: 'DELETE',
        headers: {        
            'Authorization': `Bearer ${token}`,      
            'Content-Type': 'application/json'
        },
    });
}
export async function GetSubcomment(UrlToSubCom, token){
    if(token){
        const response=await fetch(UrlToSubCom, {
            method: 'GET',
            headers: {         
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return response.json()
    }
    else{
        const response=await fetch(UrlToSubCom, {
            method: 'GET',
            headers: {         
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return response.json()
    }
    
}
export async function fetchPostComment(Comment, UrlTOPostComment, token){
    const response=await fetch(UrlTOPostComment, {
        method: 'POST',
        headers: {         
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Comment)
    });
}
export async function fetchChangeComment(Comment, UrlTOChangeComment, token){
    const response=await fetch(UrlTOChangeComment, {
        method: 'PUT',
        headers: {         
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Comment)
    });
}
export async function fetchDeleteComment(UrlTOChangeComment, token){
    const response=await fetch(UrlTOChangeComment, {
        method: 'DELETE',
        headers: {         
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
}
export async function fetchPost(UrlTorequest,token){
    if(token){
        const response=await fetch(UrlTorequest, {
            method: 'GET',
            headers: {         
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        return response.json()
    }
    else{
        const response=await fetch(UrlTorequest, {
            method: 'GET',
            headers: {         
                'Content-Type': 'application/json',
            },
        });
        return response.json()
    }
    
}
export async function getProfile(token){
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