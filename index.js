const dropZone=document.querySelector('.dropbox');
const fileOpener= document.querySelector('#fileopener');
const file_selector_btn=document.querySelector('.file_selector_btn');
const progessContainer=document.querySelector('.progress_container')

const uploadedPercentage=document.querySelector('#value');
const progressBar=document.querySelector('.progress_bar')
const showURL=document.querySelector('#fileURL');
const sharingContainer=document.querySelector('.sharing_container');
const copyButton=document.querySelector('#copy');
const copyMessage=document.querySelector('.msg');

// const host="https://share--x.herokuapp.com/";
const host="http://localhost:5000/"
const uploadURL=host+"api/file";

if(localStorage.getItem("mode")==="bright"){
  document.querySelector('main').style.backgroundColor="white"
  document.querySelector('.info h4').classList.remove('text-gray-50')
  document.querySelector('.title').classList.remove('text-gray-50')
  if(document.querySelector('.precValue'))
  document.querySelector('.precValue').classList.remove('text-gray-50')
}else{
  document.querySelector('main').style.backgroundColor="rgb(9, 2, 27)"
    document.querySelector('.info h4').classList.add('text-gray-50')
    document.querySelector('.title').classList.add('text-gray-50')
    if(document.querySelector('.precValue'))
  document.querySelector('.precValue').classList.remove('text-gray-50')

}

dropZone.addEventListener('dragover',(e)=>{
    e.preventDefault();

    if(!dropZone.classList.contains('dragged'))
        dropZone.classList.add('dragged')
})

dropZone.addEventListener('dragleave',(e)=>{
    if(dropZone.classList.contains('dragged'))
        dropZone.classList.remove('dragged');
})

dropZone.addEventListener('drop',(e)=>{
    e.preventDefault();

    if(dropZone.classList.contains('dragged'))
       dropZone.classList.remove('dragged');
      const files=e.dataTransfer.files;
       if(files.length)
         {
             fileOpener.files=files; 
             upload();
         }
})

file_selector_btn.addEventListener('click',(e)=>{
    if(!localStorage.getItem('@Auth'))
    window.location.href="/public/loginType.html"
    else
  fileOpener.click();
})

fileOpener.addEventListener("change",()=>{
    upload();
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
  document.querySelector('.more_info').style.display="block"
}else{
    document.querySelector('.login').style.display="flex";
    document.querySelector('.logout').style.display="none"
    document.querySelector('.user').innerText=""
    document.querySelector('.more_info').style.display="none"
}
const upload=()=>{
    const file=fileOpener.files[0];
    const formData=new FormData();
    
   console.log(JSON.parse(localStorage.getItem("@Auth"))._id)
     formData.append("myFile",file);
     formData.append("file_owner",JSON.parse(localStorage.getItem("@Auth"))._id)
     const xhr=new XMLHttpRequest();
     xhr.onreadystatechange=()=>{
           if(xhr.readyState===XMLHttpRequest.DONE){
            //console.log(xhr.response);  
            localStorage.setItem("file",JSON.stringify({uuid:JSON.parse(xhr.response).file.split('/')[4]}))
            const result=JSON.parse(xhr.response)
            showLink(result);
            // console.log(result)
            if(result.file){
              Toastify({
                  text:"File Uploaded Successfully",
                  duration: 3000,
                  newWindow: true,
                  close: true,
                  gravity: "top", // `top` or `bottom`
                  position: "right", // `left`, `center` or `right`
                  stopOnFocus: true, // Prevents dismissing of toast on hover
                  style: {
                    background:"#46c837" ,
                    borderRadius:"40px"
                  },
                }).showToast();
           
  
           }       
     }
    }
    if(file.size<1000000*100){
     document.querySelector('.progress_container').style.display="block";
     xhr.upload.onprogress=progressReport;
     xhr.open('POST',uploadURL );
     xhr.send(formData);
    }else{
      Toastify({
        text:"File File Size Must be Less Than 100MBs",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background:"#46c837" ,
          borderRadius:"40px"
        },
      }).showToast();
    }
};

const progressReport=(e)=>{
    progressBar.style.transform=`scaleX(0)`;
   progessContainer.style.display="block"
    const perc=parseInt((e.loaded/e.total)*100);
  //  console.log(perc);
   
    uploadedPercentage.innerText=perc;
    progressBar.style.transform=`scaleX(${perc/100})`;
}

const showLink=(link)=>{
    document.querySelector('.progress_container').style.display="none";
    sharingContainer.style.display="block";
  //  console.log(link);
   document.querySelector('.progress_container').style.display="none";
    showURL.value=link.file;

    
    if(document.querySelector("#qrcode").hasChildNodes()){
      document.querySelector("#qrcode").innerHTML=""
    }

    var QR_CODE = new QRCode("qrcode", {
        width: 220,
        height: 220,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      QR_CODE.makeCode(link.file);
}



copyButton.addEventListener('click',()=>{
    showURL.select();
    document.execCommand('copy');
    copyMessage.style.display='block';
    // window.scrollBy(0,200)
    let copyMsg;
    clearTimeout(copyMsg);
    copyMsg=setTimeout(()=>{
        copyMessage.style.display='none';
    },3000);
})


if(window.location.href.includes('_id',0)){
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

console.log(params);
localStorage.setItem('@Auth',JSON.stringify(params))

window.location.href="/public/index.html"
}

// console.log(typeof localStorage.getItem('@Auth'))

document.querySelector('.sent_to_btn').addEventListener('click',async(e)=>{
   const receiver=document.querySelector('.send_to').value
   if(receiver===JSON.parse(localStorage.getItem('@Auth')).email)
     {
        Toastify({
            text:"Can't Send files to the Same Person",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background:"#46c837" ,
              borderRadius:"40px"
            },
          }).showToast();
     }
    
else{
  const data={...JSON.parse(localStorage.getItem('@Auth')),file:JSON.parse(localStorage.getItem('file')).uuid}
  // console.log(data)
   const result =await fetch(`http://localhost:5000/sent_to/${receiver}`,{
    method: 'POST', // or 'PUT'
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    body:JSON.stringify(data)
  })
//   console.log(result)
  if(result.status){
    Toastify({
        text:result.statusText,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background:"#46c837" ,
          borderRadius:"40px"
        },
      }).showToast();
  }
}

})
// console.log(localStorage.getItem('@Auth'))
const wrapper = document.querySelector('.wrapper');
const para = document.querySelector('p')

wrapper.addEventListener('change', function(e) {
  if(e.target.checked) {
    para.classList.add('morning');
    para.textContent = 'Morning, Sunshine!';
  } else {
    para.classList.remove('morning');
    para.textContent = 'Good Night!';
  }
})