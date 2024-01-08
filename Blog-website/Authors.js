import { fetchAuthors } from "./fetchRequests.js";
import { UrlAuthors } from "./RequestURL.js";
const response=await fetchAuthors(UrlAuthors)

const authorContainer=document.getElementById('authorContainer')

const authorsCopy = response.slice();
authorsCopy.sort((a, b) => {
    if (a.posts !== b.posts) {
        return b.posts - a.posts;
    } else {
        return b.likes - a.likes; 
    }
});

const topThreeAuthors = authorsCopy.slice(0, 3);
console.log(topThreeAuthors[0].fullName)
response.forEach(author => {
    let reward=''
    if(author.fullName==topThreeAuthors[0].fullName){
        reward='<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Gouden_medaille.svg/150px-Gouden_medaille.svg.png?20230429162412" alt="награда" class="top-0 start-0 img-fluid">'
    }
    if(author.fullName==topThreeAuthors[1].fullName){
        reward='<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/archive/2/2e/20190110174346%21Silver_medal_icon.svg/120px-Silver_medal_icon.svg.png" alt="награда" class="top-0 start-0 img-fluid">'
    }
    if(author.fullName==topThreeAuthors[2].fullName){
        reward='<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Bronzen_medaille.svg/150px-Bronzen_medaille.svg.png?20230429162458" alt="награда" class="top-0 start-0 img-fluid">'
    }

    const tempBD = author.birthDate
    const tempCreated=author.created
    
    let birthDate=''
    let createTime=''

    if (tempBD && tempBD!=null){
        const day = tempBD.substring(8, 10);
        const month = tempBD.substring(5, 7);
        const year = tempBD.substring(0, 4);
        
        birthDate = `${day}.${month}.${year}`
    }

    if(tempCreated ){
        const dayC = tempCreated.substring(8, 10);
        const monthC = tempCreated.substring(5, 7);
        const yearC = tempCreated.substring(0, 4);
        
        createTime = `${dayC}.${monthC}.${yearC}`
    }

    const authorElement=document.createElement('div')
    authorElement.innerHTML=`
    <div class="container">
        <div class="card">
            <div class="card-body">
                <div class="d-flex">
                    <div class="col-sm-1 me-3" >
                        <div style="width: 30px; height: 30px;" class="position-absolute" >
                            ${reward}
                        </div>
                        <img src="${author.gender === 'Male' ? 'https://avatars.mds.yandex.net/i?id=3981d6631830f786dfe5e7f70aec5a24-5239793-images-thumbs&n=13' : 'https://dapdebica.protrainup.com/assets/images/people/member-dafault-w.jpeg'}" alt="${author.fullName}" class="rounded-circle border img-fluid img-thumbnail">
                        
                    </div>
                    <div>
                        <div class=" d-flex align-items-center justify-content-center">
                            <a href='/?author=${author.fullName}&sorting=CreateDesc&onlyMyCommunities=false&page=1&size=5' style="text-decoration: none;" class="text-dark">
                                <span class="fs-4 fw-bold">${author.fullName}</span> 
                            </a>
                            <span class="fs-5 mt-1 ms-3"style="opacity: 0.8">Создан: ${createTime}</span>
                        </div>
                        <span class="fs-5 me-1 fw-bold" style="opacity: 0.6">Дата рождения:</span><span class="fs-5">${birthDate}</span> 
                    </div>
                    <div class="ms-auto mb-4  d-flex align-items-center">
                        <span class="btn btn-primary btn-sm me-2">Постов: ${author.posts}</span>
                        <span class="btn btn-primary btn-sm">Лайки: ${author.likes}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    authorContainer.appendChild(authorElement)

});