import { fetchCommunityGet,fetchCheckRole, fetchSubscribeCommunity,fetchUnSubscribeCommunity } from "./fetchRequests.js";
import { UrlCommunity} from "./RequestURL.js";

const communityContainer=document.getElementById('communityContainer')

const Token=localStorage.getItem('token')

const response= await fetchCommunityGet(UrlCommunity)


for (let i = 0; i < response.length; i++){
    
    const community=response[i]
    const communityElement=document.createElement('div')

    communityElement.innerHTML=`
        <div class="container">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center ">
                        <div id="communityName" class="fw-bold fs-3">
                            <span>${community.name}</span>
                        </div>
                        <div id="communityBtn" class="ms-auto text-center">
                            <button id="followBtn" class="btn btn-primary">Подписаться</button>
                            <button id="unFollowBtn" class="btn btn-danger" style="display:none">Отписаться</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    communityContainer.appendChild(communityElement)
    const token=localStorage.getItem('token')

    const communityId=community.id

    const UrlToCheckRole=UrlCommunity+'/'+communityId+'/role'
    const UrlToSubscribe=UrlCommunity+'/'+communityId+'/subscribe'
    const UrlToUnSubscribe=UrlCommunity+'/'+communityId+'/unsubscribe'

    const followBtn=communityElement.querySelector('#followBtn')
    const unFollowBtn=communityElement.querySelector('#unFollowBtn')

    followBtn.addEventListener('click', async function(event){
        if(token){
            const roleResponse=await fetchCheckRole(UrlToCheckRole,token)
            if (roleResponse==null){
                await fetchSubscribeCommunity(UrlToSubscribe, token)
                followBtn.style.display='none'
                unFollowBtn.style.display='block'
            }
        }
        else{
            window.location.href='/login'
        }
    })
    unFollowBtn.addEventListener('click', async function(event){
        if(token){
            const roleResponse=await fetchCheckRole(UrlToCheckRole,token)
            if(roleResponse=='Subscriber'){
                await fetchUnSubscribeCommunity(UrlToUnSubscribe, token)
                unFollowBtn.style.display='none'
                followBtn.style.display='block'
            }
        }
        else{
            window.location.href='/login'
        }
    })
    if(token){
        const roleResponse=await fetchCheckRole(UrlToCheckRole,token)
        if (roleResponse==null){
            unFollowBtn.style.display='none'
            followBtn.style.display='block'
            
        }
        else{
            if(roleResponse==='Administrator'){
                followBtn.style.display='none'
                unFollowBtn.style.display='none'
                
            }
            if(roleResponse==='Subscriber'){
                followBtn.style.display='none'
                unFollowBtn.style.display='block'
            }

            
        }
        console.log(roleResponse)
    }
}
    