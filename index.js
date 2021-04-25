const dropZone=document.querySelector('.dropbox');
const fileOpener= document.querySelector('#fileopener');
const file_selector_btn=document.querySelector('.file_selector_btn');
const bgProgress=document.querySelector('.bg-progress');
const uploadedPercentage=document.querySelector('#value');
const progressBar=document.querySelector('.progress_bar')
const showURL=document.querySelector('#fileURL');
const sharingContainer=document.querySelector('.sharing_container');
const copyButton=document.querySelector('#copy');
const copyMessage=document.querySelector('.msg');

const host="https://share--x.herokuapp.com/";
const uploadURL=host+"api/file";

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
  fileOpener.click();
})

fileOpener.addEventListener("change",()=>{
    upload();
})

const upload=()=>{
    const file=fileOpener.files[0];
    const formData=new FormData();

     formData.append("myFile",file);
    
     const xhr=new XMLHttpRequest();
     xhr.onreadystatechange=()=>{
           if(xhr.readyState===XMLHttpRequest.DONE){
            console.log(xhr.response);  
            showLink(JSON.parse(xhr.response));
           }       
     }
     document.querySelector('.progress_container').style.display="block";
     xhr.upload.onprogress=progressReport;
     xhr.open('POST',uploadURL );
     xhr.send(formData);
};

const progressReport=(e)=>{
    const perc=parseInt((e.loaded/e.total)*100);
    console.log(perc);
    bgProgress.style.width=perc+'%';
    uploadedPercentage.innerText=perc;
    progressBar.style.transform=`scaleX(${perc/100})`;
}

const showLink=(link)=>{
    sharingContainer.style.display="block";
   console.log(link.file);
   document.querySelector('.progress_container').style.display="none";
    showURL.value=link.file;
}

copyButton.addEventListener('click',()=>{
    showURL.select();
    document.execCommand('copy');
    copyMessage.style.bottom='40px';
    let copyMsg;
    clearTimeout(copyMsg);
    copyMsg=setTimeout(()=>{
        copyMessage.style.bottom='-40px';
    },3000);
})