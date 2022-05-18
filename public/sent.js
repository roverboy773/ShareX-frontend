const id=JSON.parse(localStorage.getItem('@Auth'))._id

fetch(`${host}sent_files/${id}`)
.then(res=>res.json())
.then((res)=>{
    res.sent_files.forEach(ele=>{
        const indi=document.createElement('div')
        indi.classList.add('indi')
        const link=document.createElement('a')
        link.classList.add('link')
        const name=document.createElement('p')
        const img=document.createElement('img')
        img.setAttribute('src',"./download-sd.svg")
        img.classList.add('w-1/2')
        img.classList.add('block')
        img.classList.add('mx-auto')
        const time=document.createElement('p')
        const id=document.createElement('p')
   
        name.innerText="Sent to : "+ele.name
        id.innerText="User ID : "+ele._id
        time.innerText="Sent at : "+ele.Time
        link.setAttribute("href",ele.link)
        link.innerText="File Link"
   
        document.querySelector('.all_sent_files').appendChild(indi)
        indi.appendChild(img)
        indi.appendChild(name)
        indi.appendChild(time)
        indi.appendChild(id)
        indi.appendChild(link)
    })
//     <section class="download">
//     <img class="download__icon" src="/img/download-sd.svg" alt="download">
//     <% if(locals.error){ %>
//     <h4><%= locals.error %> </h4>
//     <% } else { %>
//     <h2>Your file is ready to download</h2>
//     <p>Link expires in 24 hours</p>
//     <div class="download__meta">
//         <h5>FileName:<%=fileName %></h5> 
//         <small>Size:<%= parseInt(fileSize/1000) %> KB</small>
//     </div>
//     <div class="send-btn-container">
//         <a href="<%= downloadLink %>">Download file</a>
//     </div>
//     <% } %>
// </section>
})


document.querySelector('.logout').addEventListener('click',(e)=>{
    localStorage.removeItem('@Auth')
    document.querySelector('.login').style.display="flex";
    document.querySelector('.logout').style.display="none"

})


if(localStorage.getItem('@Auth')){
    document.querySelector('.login').style.display="none";
    document.querySelector('.logout').style.display="block"
    document.querySelector('.user').innerText=JSON.parse(localStorage.getItem('@Auth')).name
   
}else{
      document.querySelector('.login').style.display="flex";
      document.querySelector('.logout').style.display="none"
      document.querySelector('.user').innerText=""
      
}