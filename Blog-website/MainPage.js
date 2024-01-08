import { GetTags, UrlPost } from "./RequestURL.js";
import { fetchAddLike, fetchDeleteLike,fetchPosts, getTags } from "./fetchRequests.js";
const Posts=document.getElementById('Posts')

const applyBtn=document.getElementById('ApplyBtn')
const createPostBtn=document.getElementById('CreatePostBtn')
const pageBtn=document.getElementById('pageBtn')
const nextPageBtn=document.getElementById('nextPageBtn')
const prevPageBtn=document.getElementById('prevPageBtn')

const labelPages=document.getElementById('labelPages')
const pageCount=document.getElementById('pageCount')
const pageSize=pageCount.value
labelPages.style.display='block'
nextPageBtn.style.display='block'
prevPageBtn.style.display='block'
pageCount.style.display='block'


const token=localStorage.getItem('token');

let page=1
let size;
await getTags()

const urlParams = new URLSearchParams(window.location.search);
page=parseInt(urlParams.get('page')) || 1

pageCount.value=urlParams.get('size') || '5'

console.log(size)
let totalPages=1

document.getElementById('authorSearch').value = urlParams.get('author') || '';
document.getElementById('sortPostsSelect').value = urlParams.get('sorting') || 'CreateDesc';
document.getElementById('readTimeMin').value = urlParams.get('min') || '';
document.getElementById('readTimeMax').value = urlParams.get('max') || '';

const onlyMyCommunitiesParam = urlParams.get('onlyMyCommunities');
document.getElementById('onlyMyGroups').checked = onlyMyCommunitiesParam === 'true';

const tagsParam = urlParams.get('tags');

const responseTags=await fetch(GetTags,{
    method: 'GET',
    headers: {         
        'Content-Type': 'application/json',
    },
})
const responseDataTags=await responseTags.json()

const tagSelect = document.getElementById('tagSearch');

const options = tagSelect.options;

const tagsArray = [];

if (tagsParam) {

    tagsArray.push(...tagsParam.split(','));
}
tagSelect.selectedIndex = -1;

tagsArray.forEach((Tag)=> {
    const selTagName=responseDataTags.find(tag=> tag.id===Tag)
    const option = tagSelect.querySelector(`option[value="${selTagName.name}"]`);
    console.log(option)
    if (option) {
        option.selected = true;
    }
});

await ShowPost(page,size)


applyBtn.addEventListener('click', async function(event){
    //event.preventDefault()
    await ShowPost(page,size)
})
if (!token){
    createPostBtn.style.display='none'
}

createPostBtn.addEventListener('click', async function(event){
    const Token=localStorage.getItem('token');
    if(Token){
        window.location.href='/CreatePost'
    }
})

nextPageBtn.addEventListener('click', async function(event){
    if(page<totalPages){
        page+=1
        ShowPost(page,size)
    }
    
})
prevPageBtn.addEventListener('click', async function(event){
    if(page>1){
        page-=1
        ShowPost(page,size)
    }
    
})

async function ShowPost(page,size){
    size=parseInt(pageCount.value)

    const response=await fetch(GetTags,{
        method: 'GET',
        headers: {         
            'Content-Type': 'application/json',
        },
    })
    const responseData=await response.json()
    
    const tags=document.getElementById('tagSearch')

    const selectedTags= Array.from(tags.selectedOptions).map(option => option.value)
    selectedTags.forEach((selectedTagName, index) => {
        const selectedTagObject = responseData.find(tag => tag.name === selectedTagName)
        selectedTags[index] = selectedTagObject.id
    });

    const author= document.getElementById('authorSearch').value
    const sort=document.getElementById('sortPostsSelect').value
    const timeMin=document.getElementById('readTimeMin').value
    const timeMax=document.getElementById('readTimeMax').value
    const myGroup=document.getElementById('onlyMyGroups').checked

    const urlToFetch=UrlPost
    const query = new URLSearchParams()

    if (selectedTags.length > 0) {
        query.append('tags', selectedTags);
    }
    if (author.trim() !== "") {
        query.append('author', author);
    }
    if (timeMin.trim() !== "") {
        query.append('min', timeMin);
    }
    if (timeMax.trim() !== "") {
        query.append('max', timeMax);
    }
    if (sort) {
        query.append('sorting', sort);
    }
    if (myGroup !== undefined) {
        query.append('onlyMyCommunities', myGroup);
    }
    if (page !== undefined) {
        query.append('page', page);
    }
    if (size !== undefined) {
        query.append('size', size);
    }
    const Url = `${urlToFetch}?${query.toString()}`;
    const UrlTorequest=Url.replace(/%2C/g, '&tags=')
    Posts.innerHTML = '';
    
    const Token=localStorage.getItem('token');

    const responsePost = await fetchPosts(UrlTorequest, Token)
    if(window.location.href!=('http://localhost/'+`?${query.toString()}`)){
        window.location.href='/'+`?${query.toString()}`
        totalPages=responsePost.pagination.count
        await AddPosts(responsePost);
    }
    else{
        totalPages=responsePost.pagination.count
        await AddPosts(responsePost);
    }
    // totalPages=responsePost.pagination.count
    // await AddPosts(responsePost);

}
async function AddPosts(response){


    response.posts.forEach(post=>{
        const postElement = document.createElement('div');

        let community= post.communityName;

        if (community==null){
            community=''
        }
        else{
            community='в сообществе' + ' ' + community
        }

        const inputDate = post.createTime.substring(0, 10);
        const [year, month, day] = inputDate.split('-');
        const createDate=`${day}.${month}.${year}`;

        const createtime = post.createTime.substring(11, 16);

        let descriptionToShow = post.description.replace(/\n/g, ' <br> ');
        let showReadMore = false;
        
        if (post.description.length > 200) {
            descriptionToShow = `${post.description.slice(0, 200).replace(/\n/g, ' <br> ')}... <span class="read-more" style="color: #15317E; font-weight: bold;">Читать полностью</span>`;
            showReadMore = true;
        }

        postElement.innerHTML = `
            <div class="container mt-4">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <p>${post.author} - ${createDate} ${createtime} ${community}</p>
                            </div>
                        </div>
                        <h5 class="card-title"><a href="/ConcretePost?id=${post.id}">${post.title}</a></h5>
                        <hr>
                        ${post.image ? `<div class="text-center"><img src="${post.image}" class="img-fluid mb-3" alt="Post Image"></div>` : ''}
                        <p class="post-description">${descriptionToShow}</p>
                        ${showReadMore ? `<span class="full-description" style="display: none;">${post.description}</span>` : ''}
                        <div class="row">
                            <div class="col-md-12">
                                ${post.tags.map(tag => `<span style="opacity: 0.7;">#${tag.name}</span>&nbsp;`).join(' ')}
                            </div>
                            <div class="col-md-12">
                                Время чтения: ${post.readingTime} мин.
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-muted">
                        <div class="row mt-2">
                            <div class="col-md-6">
                                <i class="bi bi-chat-left-text me-1" id="CommentBtn"></i><span id="commentsCount">&nbsp;${post.commentsCount}</span>
                            </div>
                            <div class="col-md-6 text-end">
                                <i class="bi bi-heart me-1" id="LikeBtn"></i><span id="likesCount">${post.likes}</span>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        Posts.appendChild(postElement);
        const likeBtn = postElement.querySelector('#LikeBtn');
        const likesCountElement = postElement.querySelector('#likesCount');

        let likeFlag;
        if (post.hasLike) {
            likeFlag = true;
            likeBtn.classList.replace("bi-heart","bi-heart-fill");
            likeBtn.style.color='red'
        } else {
            likeFlag = false;
        }

        likeBtn.addEventListener('click', async function (event) {
            const postId = post.id;
            const UrlLike=`${UrlPost}/${postId}/like`

            const Token=localStorage.getItem('token')
            //console.log(UrlLike)
            if (Token && likeFlag) {
                await fetchDeleteLike(UrlLike, Token);

                const currentLikes = parseInt(likesCountElement.innerText);
                likesCountElement.innerText = currentLikes - 1;

                likeFlag = false;
                likeBtn.classList.replace("bi-heart-fill","bi-heart");
                likeBtn.style.color=''
            } else {
                if (Token && !likeFlag) {

                    await fetchAddLike(UrlLike, Token);

                    const currentLikes = parseInt(likesCountElement.innerText);
                    likesCountElement.innerText = currentLikes + 1;

                    likeFlag = true;
                    likeBtn.classList.replace("bi-heart","bi-heart-fill");
                    likeBtn.style.color='red'
                }
            }
        });
        if (showReadMore) {
            const readMoreBtn = postElement.querySelector('.read-more');
            readMoreBtn.addEventListener('click', () => {
                const fullDescription = postElement.querySelector('.full-description');
                const shortDescription = postElement.querySelector('.post-description');

                shortDescription.innerHTML = fullDescription.textContent.replace(/\n/g, ' <br> ');;
                readMoreBtn.style.display = 'none';
            });
        }

    });
}


