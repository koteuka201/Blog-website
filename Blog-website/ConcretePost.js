import { UrlPost, UrlComment, UrlChangeComment } from "./RequestURL.js";
import { GetSubcomment, fetchAddLike, fetchDeleteLike, fetchPostComment, fetchPost, getProfile, fetchChangeComment, fetchDeleteComment} from "./fetchRequests.js";
const token=localStorage.getItem('token')

const url=window.location.href
const sign = url.indexOf('=')
const id=url.substring(sign + 1)

const likeBtn=document.getElementById('LikeBtn')

const commentBtn=document.getElementById('CommentBtn')
const commentsContainer = document.getElementById('headCommentsContainer');
const createHeadCommentBtn=document.getElementById('createHeadCommentBtn')
const headCommentError=document.getElementById('headCommentError')
const commentsBlock=document.getElementById('commentsBlock')

const UrlTorequest=UrlPost+'/'+id
const UrlToLike=UrlTorequest+'/like'
const UrlTOPostComment=UrlTorequest+'/comment'

const post=await fetchPost(UrlTorequest,token)

let likeFlag;
if(post.hasLike){
    likeFlag=true
    likeBtn.classList.replace("bi-heart","bi-heart-fill");
    likeBtn.style.color='red'
}
else{
    likeFlag=false
}
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

document.getElementById('updown').innerText = `${post.author} - ${createDate} ${createtime} ${community}`;document.getElementById('title').innerText = post.title;
document.getElementById('image').innerHTML = post.image ? `<div class="text-center"><img src="${post.image}" class="img-fluid mb-3" alt="Post Image"></div>` : '';
document.getElementById('tags').innerText = post.tags.map(tag => `#${tag.name}`).join(' ');
document.getElementById('timeReading').innerText = `Время чтение ${post.readingTime} мин.`;
document.getElementById('commentsCount').innerText = `${post.commentsCount}`;
document.getElementById('likesCount').innerText = `${post.likes}`;

likeBtn.addEventListener('click', async function(event){

    const Token=localStorage.getItem('token')
    if (Token && likeFlag ){
        await fetchDeleteLike(UrlToLike,Token)
        const likesCountElement = document.getElementById('likesCount')
        const currentLikes = parseInt(likesCountElement.innerText)
        likesCountElement.innerText = currentLikes - 1;
        
        likeFlag=false
        likeBtn.classList.replace("bi-heart-fill","bi-heart");
        likeBtn.style.color=''

    }
    else{
        if (Token && !likeFlag){
            await fetchAddLike(UrlToLike, Token)
            const likesCountElement = document.getElementById('likesCount')
            const currentLikes = parseInt(likesCountElement.innerText)
            likesCountElement.innerText = currentLikes + 1
    
            likeFlag=true

            likeBtn.classList.replace("bi-heart","bi-heart-fill");
            likeBtn.style.color='red'
        }
    }
    
})
commentsContainer.style.display='block'
let commentBtnFlag=true

commentBtn.addEventListener('click', async function(event){
    if (commentBtnFlag){
        commentsBlock.style.display='none'
        commentBtnFlag=false
    }
    else{
        commentsBlock.style.display='block'
        commentBtnFlag=true
    }
})

createHeadCommentBtn.addEventListener('click', async function(event){
    const token=localStorage.getItem('token')
    if(token){
        const content=document.getElementById('createHeadComment').value
        if (content!=''){
            const parentId=''
        
            const commentData={
                content,
            }
            const response=fetchPostComment(commentData, UrlTOPostComment,token)
            console.log(response)
            location.reload()
        }
        else{
            headCommentError.style.display='block'
        }
    }
    
})

AddComments(post)

let descriptionToShow = post.description.replace(/\n/g, ' <br> ');
let showReadMore = false;

if (post.description.length > 200) {
    descriptionToShow = `${post.description.slice(0, 200).replace(/\n/g, ' <br> ')}... <span class="read-more" style="color: #15317E; font-weight: bold;">Читать полностью</span>`;
    showReadMore = true;
}

const descriptionElement = document.getElementById('description');
descriptionElement.innerHTML = descriptionToShow;

if (showReadMore) {
    const readMoreBtn = document.querySelector('.read-more');
    readMoreBtn.addEventListener('click', () => {
        const fullDescription = document.querySelector('.full-description');
        const shortDescription = document.querySelector('.post-description');
        fullDescription.innerHTML=post.description
        shortDescription.innerHTML = fullDescription.textContent.replace(/\n/g, ' <br> ');
        readMoreBtn.style.display = 'none';
    });
}

async function AddComments(post){
    const Token=localStorage.getItem('token')

    for (let i = 0; i < post.comments.length; i++){

        const comment=post.comments[i]

        const inputDate = comment.createTime.substring(0, 10);
        const [year, month, day] = inputDate.split('-');
        const createDate=`${day}.${month}.${year}`;
        const createtime = comment.createTime.substring(11, 16);

        const commentElement=document.createElement('div')
        commentElement.innerHTML = `
            <div class="mt-1">
                <div class="d-flex">
                    <p class="comment-author" id="authorComment">${comment.author}</p>
                    <div id="titleBtn">
                        <i class="bi bi-pencil-fill me-1 ms-2" id="editCommentBtn"></i>
                        <i class="bi bi-trash" id="deleteCommentBtn"></i>
                    </div>
                    <span class="ms-2" id="changed" style="opacity:0.7">(изменено)</span>
                    
                </div>
                <p class="comment-content fs-5" id="comContent">${comment.content}</p>
                <div class="d-flex">
                    <p class="comment-date me-2">${createDate} ${createtime}</p>
                    <span id="request">Ответить</span>
                    <div id="subsBtn">
                        <span class="ms-2" id="openSubs"><i class="bi bi-chevron-down"></i>Раскрыть ответы</span>
                        <span class="ms-2" id="closeSubs"><i class="bi bi-chevron-up"></i>Скрыть ответы</span>
                    </div>
                </div>
                <div id="requestForm">
                    <div class="d-flex">
                        <input class="form-control" id="commentInput"placeholder="Оставьте комментарий" rows="3"></input>
                        <button type="button" id="childCreateCommentBtn" class="btn btn-primary ms-2">Отправить</button>
                    </div>
                    <small id="childCommentError" class="text-danger" style="display: none;">Поле не должно быть пустым</small>
                </div>
                <div id="requestFormEdit" style="display:none">
                    <div class="d-flex">
                        <input class="form-control" id="commentInputEdit" rows="3"></input>
                        <button type="button" id="childCreateCommentBtnEdit" class="btn btn-warning ms-2">Редактировать</button>
                    </div>
                    <small id="childEditCommentError" class="text-danger" style="display: none;">Поле не должно быть пустым</small>
                </div>

            </div>
            <div id="subCommentsContainer">

            </div>
            `; 
        commentsContainer.appendChild(commentElement);

        const authorComment=commentElement.querySelector('#authorComment')
        const comContent=commentElement.querySelector('#comContent')
        const requestFormEdit=commentElement.querySelector('#requestFormEdit')
        const changed=commentElement.querySelector('#changed')
        commentElement.querySelector('#commentInputEdit').value=comment.content
        const childCreateCommentBtnEdit=commentElement.querySelector('#childCreateCommentBtnEdit')
        const childEditCommentError=commentElement.querySelector('#childEditCommentError')

        const titleBtn=commentElement.querySelector('#titleBtn')
        const editCommentBtn=commentElement.querySelector('#editCommentBtn')
        const deleteCommentBtn=commentElement.querySelector('#deleteCommentBtn')

        const request=commentElement.querySelector('#request')
        const requestForm=commentElement.querySelector('#requestForm')
        const childCreateCommentBtn=commentElement.querySelector('#childCreateCommentBtn')
        const subsBtn=commentElement.querySelector('#subsBtn')
        const childCommentError=commentElement.querySelector('#childCommentError')

        const commentId=comment.id
        const UrlToFetch=UrlComment+commentId+'/tree'
        const UrlTOChangeComment=UrlChangeComment+commentId
        const commentData= await GetSubcomment(UrlToFetch,Token)

        const subCommentsContainer = commentElement.querySelector('#subCommentsContainer');
        for (let i = 0; i < commentData.length; i++){
            const subComment=commentData[i]

            const inputDateSub = subComment.createTime.substring(0, 10);
            const [year, month, day] = inputDateSub.split('-');
            const createDateSub=`${day}.${month}.${year}`;
            const createtimeSub = subComment.createTime.substring(11, 16);

            const subCommentElement=document.createElement('div')
            subCommentElement.innerHTML = `
                <div class="ms-5 border-start border-primary border-3 border-info">
                    <div class="ms-2">
                        <div class="d-flex" >
                            <p class="comment-author" id="authorSubComment">${subComment.author}</p>
                            <div id="subTitleBtn" style="display:none">
                                <i class="bi bi-pencil-fill me-1 ms-2" id="editSubCommentBtn"></i>
                                <i class="bi bi-trash" id="deleteSubCommentBtn"></i>
                            </div>
                            <span class="ms-2" id="subChanged" style="opacity:0.7">(изменено)</span>
                        </div>
                        <p class="comment-content fs-5" id="subComContent">${subComment.content}</p>
                        <div class="d-flex">
                            <p class="comment-date me-2">${createDateSub} ${createtimeSub}</p><span id="subRequest">Ответить</span>
                            
                        </div>
                        <div id="subRequestForm">
                            <div class="d-flex">
                                <input class="form-control" id="subCommentInput"placeholder="Оставьте комментарий" rows="3"></input>
                                <button type="button" id="subCreateCommentBtn" class="btn btn-primary ms-2">Отправить</button>
                            </div>
                            <small id="subCommentError" class="text-danger" style="display: none;">Поле не должно быть пустым</small>
                        </div>
                        <div id="subRequestFormEdit" style="display:none" >
                            <div class="d-flex">
                                <input class="form-control" id="subCommentInputEdit" rows="3"></input>
                                <button type="button" id="childCreateCommentBtnEdit" class="btn btn-warning ms-2">Редактировать</button>
                            </div>
                            <small id="subChildEditCommentError" class="text-danger" style="display: none;">Поле не должно быть пустым</small>
                        </div>
                    </div>
                </div>
                `; 
            subCommentsContainer.appendChild(subCommentElement);
            
            const UrlTOChangeSubComment=UrlChangeComment+subComment.id

            const authorSubComment=subCommentElement.querySelector('#authorSubComment')
            const subComContent=subCommentElement.querySelector('#subComContent')

            const subChanged=subCommentElement.querySelector('#subChanged')
            const subRequestFormEdit=subCommentElement.querySelector('#subRequestFormEdit')
            const subCommentInputEdit=subCommentElement.querySelector('#subCommentInputEdit')
            const childCreateCommentBtnEdit=subCommentElement.querySelector('#childCreateCommentBtnEdit')
            const subChildEditCommentError=subCommentElement.querySelector('#subChildEditCommentError')
            const subTitleBtn=subCommentElement.querySelector('#subTitleBtn')
            
            const editSubCommentBtn=subCommentElement.querySelector('#editSubCommentBtn')
            const deleteSubCommentBtn=subCommentElement.querySelector('#deleteSubCommentBtn')
            
            const subRequest=subCommentElement.querySelector('#subRequest')
            const subRequestForm=subCommentElement.querySelector('#subRequestForm')
            const subCommentInput=subCommentElement.querySelector('#subCommentInput').value
            const subCreateCommentBtn=subCommentElement.querySelector('#subCreateCommentBtn')
            const subCommentError=subCommentElement.querySelector('#subCommentError')

            subRequestForm.style.display='none'
            
            editSubCommentBtn.classList.replace("bi-heart","bi-heart-fill")
            editSubCommentBtn.style.color='orange'
            deleteSubCommentBtn.classList.replace("bi-heart","bi-heart-fill")
            deleteSubCommentBtn.style.color='red'

            subCommentElement.querySelector('#subCommentInputEdit').value=subComment.content

            const tokenCheck=localStorage.getItem('token')
            if (tokenCheck){
                const response= await getProfile(tokenCheck)
                if((response!==400 || response!==401)&&subComment.deleteDate==null){
                    if (subComment.authorId==response.id){
                        subTitleBtn.style.display='block'
                    }
                }
            }
            const dateEdit=subComment.modifiedDate
            const dateObjectEdit = new Date(dateEdit)

            const formattedDateEdit = `${addLeadingZero(dateObjectEdit.getDate())}.${addLeadingZero(dateObjectEdit.getMonth() + 1)}.${dateObjectEdit.getFullYear()} ${addLeadingZero(dateObjectEdit.getHours())}:${addLeadingZero(dateObjectEdit.getMinutes())}`;
            if(subComment.modifiedDate!=null){
                subChanged.style.display='block'
                subChanged.addEventListener('mouseover', async function(event){
                    this.textContent = `Последнее изменение: ${formattedDateEdit}`
                })
                subChanged.addEventListener('mouseout', async function(event){
                    this.textContent = '(изменено)'
                })
            }
            else{
                subChanged.style.display='none'
            }

            if(subComment.deleteDate!=null){
                authorSubComment.textContent='[Комментарий удален]'
                subComContent.textContent='[Комментарий удален]'
            }

            deleteSubCommentBtn.addEventListener('click', async function(event){
                const token=localStorage.getItem('token')
                if(token){
                    fetchDeleteComment(UrlTOChangeSubComment,token)
                    location.reload()

                }
            })

            childCreateCommentBtnEdit.addEventListener('click', async function(event){
                const token=localStorage.getItem('token')
                if(token){
                    const content=subCommentElement.querySelector('#subCommentInputEdit').value
                    if(content!=''){
                        const editData={
                            content
                        }
                        await fetchChangeComment(editData, UrlTOChangeSubComment, token)
                        location.reload()
                    }
                    else{
                        subChildEditCommentError.style.display='block'
                    }
                }
            })

            editSubCommentBtn.addEventListener('click', async function(event){
                const token=localStorage.getItem('token')
                if(token){
                    subRequestFormEdit.style.display='block'
                }
            })
            subRequest.addEventListener('click', async function(event){
                const token=localStorage.getItem('token')
                if (token){
                    subRequestForm.style.display='block'
                }
            })

            subCreateCommentBtn.addEventListener('click', async function(event){
                const token=localStorage.getItem('token')
                if(token){
                    const content=subCommentElement.querySelector('#subCommentInput').value
                    if (content!=''){
                        const parentId=subComment.id
                    
                        const commentData={
                            content,
                            parentId
                        }
                        
                        fetchPostComment(commentData, UrlTOPostComment,token)
                        location.reload()
                    }
                    else{
                        subCommentError.style.display='block'
                        console.log('no')
                    }
                }
            })

        }
        requestForm.style.display='none'
        subCommentsContainer.style.display='none'
        titleBtn.style.display='none'
        
        const openSubs=commentElement.querySelector('#openSubs')
        const closeSubs=commentElement.querySelector('#closeSubs')

        editCommentBtn.classList.replace("bi-heart","bi-heart-fill")
        editCommentBtn.style.color='orange'
        deleteCommentBtn.classList.replace("bi-heart","bi-heart-fill")
        deleteCommentBtn.style.color='red'

        const dateEdit=comment.modifiedDate
        const dateObjectEdit = new Date(dateEdit)

        const formattedDateEdit = `${addLeadingZero(dateObjectEdit.getDate())}.${addLeadingZero(dateObjectEdit.getMonth() + 1)}.${dateObjectEdit.getFullYear()} ${addLeadingZero(dateObjectEdit.getHours())}:${addLeadingZero(dateObjectEdit.getMinutes())}`;
        
        if(comment.modifiedDate!=null){
            changed.style.display='block'
            changed.addEventListener('mouseover', async function(event){
                this.textContent = `Последнее изменение: ${formattedDateEdit}`
            })
            changed.addEventListener('mouseout', async function(event){
                this.textContent = '(изменено)'
            })
        }
        else{
            changed.style.display='none'
        }
        if(comment.deleteDate!=null){
            authorComment.textContent='[Комментарий удален]'
            comContent.textContent='[Комментарий удален]'
        }
        

        const tokenCheck=localStorage.getItem('token')
        if (tokenCheck){
            const response= await getProfile(tokenCheck)
            if((response!==400 || response!==401)&&comment.deleteDate==null){
                if (comment.authorId==response.id){
                    titleBtn.style.display='block'
                }
            }
        }
        if(comment.subComments==0){
            subsBtn.style.display='none'
        }
        else{
            closeSubs.style.display='none'
            openSubs.style.display='block'
        }

        deleteCommentBtn.addEventListener('click', async function(event){
            const token=localStorage.getItem('token')
            if(token){
                fetchDeleteComment(UrlTOChangeComment,token)
                location.reload()

            }
        })

        editCommentBtn.addEventListener('click', async function(event){
            const token=localStorage.getItem('token')
            if(token){
                requestFormEdit.style.display='block'
            }
        })

        childCreateCommentBtnEdit.addEventListener('click', async function(event){
            const token=localStorage.getItem('token')
            if(token){
                const content=commentElement.querySelector('#commentInputEdit').value
                if(content!=''){
                    const editData={
                        content
                    }
                    await fetchChangeComment(editData, UrlTOChangeComment, token)
                    location.reload()
                }
                else{
                    childEditCommentError.style.display='block'
                }
                
            }
        })

        
        childCreateCommentBtn.addEventListener('click', async function(event){
            const token=localStorage.getItem('token')
            if(token){
                const content=commentElement.querySelector('#commentInput').value
                if (content!=''){
                    const parentId=comment.id
                
                    const commentData={
                        content,
                        parentId
                    }
                    fetchPostComment(commentData, UrlTOPostComment,token)
                    location.reload()
                }
                else{
                    console.log(content)
                    childCommentError.style.display='block'
                }
            }
        })

        request.addEventListener('click', async function(event){
            const token=localStorage.getItem('token')
            if (token){
                requestForm.style.display='block'
            }
        })

        openSubs.addEventListener('click', async function(event){
            subCommentsContainer.style.display='block'

            openSubs.style.display='none'
            closeSubs.style.display='block'
        })

        closeSubs.addEventListener('click', async function(event){
            subCommentsContainer.style.display='none'

            closeSubs.style.display='none'
            openSubs.style.display='block'
        })
    }
    function addLeadingZero(value) {
        return value < 10 ? `0${value}` : value;
    }
}
