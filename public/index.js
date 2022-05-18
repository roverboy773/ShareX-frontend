const dropZone = document.querySelector(".dropbox");
const fileOpener = document.querySelector("#fileopener");
const merge_file_opener = document.querySelector("#merge_file_opener");
const split_file_opener = document.querySelector("#split_file_opener");
const finalMerge = document.querySelector(".final_merge");
const finalSplit= document.querySelector(".final_split");
const file_selector_btn = document.querySelector(".file_selector_btn");
const add_more_file_to_merge_btn = document.querySelector(
  ".add_more_file_to_merge"
);
const split_file_selector_btn = document.querySelector(
  ".split_file_selector_btn"
);
const add_file_to_be_merged_wrapper = document.querySelector(
  ".add_file_to_be_merged_wrapper"
);
let total_merge_file_in_storage = 0;
const progessContainer = document.querySelector(".progress_container");

const uploadedPercentage = document.querySelector("#value");
const progressBar = document.querySelector(".progress_bar");
const showURL = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing_container");
const copyButton = document.querySelector("#copy");
const copyMessage = document.querySelector(".msg");

// const host="https://share--x.herokuapp.com/";
const host = "http://localhost:5000/";
const uploadURL = host + "api/file";

if (localStorage.getItem("mode") === "bright") {
  document.querySelector("main").style.backgroundColor = "white";
  document.querySelector(".info h4").classList.remove("text-gray-50");
  document.querySelector(".title").classList.remove("text-gray-50");
  if (document.querySelector(".precValue"))
    document.querySelector(".precValue").classList.remove("text-gray-50");
} else {
  document.querySelector("main").style.backgroundColor = "rgb(9, 2, 27)";
  document.querySelector(".info h4").classList.add("text-gray-50");
  document.querySelector(".title").classList.add("text-gray-50");
  if (document.querySelector(".precValue"))
    document.querySelector(".precValue").classList.remove("text-gray-50");
}

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();

  if (!dropZone.classList.contains("dragged"))
    dropZone.classList.add("dragged");
});

dropZone.addEventListener("dragleave", (e) => {
  if (dropZone.classList.contains("dragged"))
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();

  if (dropZone.classList.contains("dragged"))
    dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  if (files.length) {
    fileOpener.files = files;
    upload();
  }
});

file_selector_btn.addEventListener("click", (e) => {
  if (!localStorage.getItem("@Auth"))
    window.location.href = "/public/loginType.html";
  else fileOpener.click();
});

fileOpener.addEventListener("change", () => {
  upload();
});

add_file_to_be_merged_wrapper.addEventListener("click", (e) => {
  // console.log(e);
  if (e.target.localName === "button")
    helper_merge_file_select(e.target.innerText.split(" ")[2] - 1);
  else if (e.target.localName === "span") {
    // console.log(e.target.classList)
    // console.log(e.target.classList[0])
    // console.log(e.target.classList[0].split('-'))
    // console.log(e.target.classList[0].split('-')[1])

    let temp = JSON.parse(localStorage.getItem("merge_pdf"));
    temp[e.target.classList[0].split("-")[1] - 1] = null;
    localStorage.setItem("merge_pdf", JSON.stringify(temp));
    document.querySelector(
      `.file-${e.target.classList[0].split("-")[1]} a`
    ).innerText = "";
    e.target.innerText = "";
    total_merge_file_in_storage--;
  }
});



function helper_merge_file_select(i) {
  merge_file_opener.click();
  let temp = undefined;
  merge_file_opener.addEventListener("change",(e) => {
    // console.log(e)
    if(temp==undefined){
      if (e.target.files[0].type === "application/pdf") {
        let temp2=undefined
        if (temp2 === undefined) {
          if (!localStorage.getItem("@Auth"))
            window.location.href = "/public/loginType.html";
          else merge_file_opener.click();
          upload('merge', i);
        }
        temp2 = 1;
      }else{
          Toastify({
          text: "Kindly Select a PDF File",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "#db142b",
            borderRadius: "40px"
          },
        }).showToast();
      }
    }temp=1;
    }, false);
}

document.querySelector(".logout").addEventListener("click", (e) => {
  localStorage.removeItem("@Auth");
  document.querySelector(".login").style.display = "flex";
  document.querySelector(".logout").style.display = "none";
});

if (localStorage.getItem("@Auth")) {
  document.querySelector(".login").style.display = "none";
  document.querySelector(".logout").style.display = "block";
  document.querySelector(".user").innerText = JSON.parse(
    localStorage.getItem("@Auth")
  ).name;
  document.querySelector(".more_info").style.display = "block";
} else {
  document.querySelector(".login").style.display = "flex";
  document.querySelector(".logout").style.display = "none";
  document.querySelector(".user").innerText = "";
  document.querySelector(".more_info").style.display = "none";
}

let converterDecider;

function upload(...args) {
  const file = fileOpener.files[0];
  const merge_file = merge_file_opener.files[0];
  const split_file = split_file_opener.files[0];
  const formData = new FormData();

  //file convert options
  // console.log(merge_file)
  if(file){
  const lastidx=file.name.lastIndexOf('.')
  let fileConvertTypeOptions=[];
  const selectedFileType=file.name.substring(lastidx+1,file.name.length)
  // console.log(selectedFileType)
  if(selectedFileType==='pdf'){
  fileConvertTypeOptions=[...fileConvertTypeOptions,'docx','pptx']
  }else if(selectedFileType==='docx' ||selectedFileType==='doc' || selectedFileType==='pptx' || selectedFileType==='ppt'|| selectedFileType==='xlsx' || selectedFileType==='xls' ){
    fileConvertTypeOptions=[...fileConvertTypeOptions,'jpg','pdf','png']
  }
  // console.log(fileConvertTypeOptions)
  const convertTypeBtnWrapper=document.querySelector('.convert-options')
  fileConvertTypeOptions.forEach((ele)=>{
    const converTypeBtn=document.createElement('button')
    converTypeBtn.classList.add('convert-btn','bg-red-600','text-white','px-4','py-1','rounded-lg','border-2','transition','duration-300','ease-out','mt-1','mx-1')
    converTypeBtn.innerText=ele
    convertTypeBtnWrapper.appendChild(converTypeBtn)
  })
}
   
  //designing formdata acc to merge or normal request
  if (args[0]==='merge') {
    formData.append("merge_file", true);
    formData.append("myFile", merge_file);
  } else if(args[0]==='split'){
    formData.append("split_file", true);
    formData.append("myFile", split_file);
  }else {
    formData.append("myFile", file);
  }
  let user=JSON.parse(localStorage.getItem("@Auth")).user
  if(user===undefined)
  user=JSON.parse(localStorage.getItem("@Auth"))._id
  formData.append("file_owner", user);

  // console.log(formData)
  //sending request to server
  const xhr = new XMLHttpRequest();
  let uploadedFilename;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // console.log(xhr.response);
      localStorage.setItem(
        "file",
        JSON.stringify({ uuid: JSON.parse(xhr.response).file.split("/")[4] })
      );
      const result = JSON.parse(xhr.response);
      uploadedFilename = result.resp.fileName;
      // console.log(result);
      converterDecider = result;
      
      //if normal upload request showlink
      if (!args[0]==='merge' && !args[0]==='split') showLink(result);
      // console.log(result)
      if (result.file) {
        Toastify({
          text: "File Uploaded Successfully",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "#46c837",
            borderRadius: "40px",
          },
        }).showToast();
      }
      //if merge request then strore selected file name in localstorage to send file names to server to merge them at server
      if (args[0]==='merge') {
        if (localStorage.getItem("merge_pdf")) {
          let temp = JSON.parse(localStorage.getItem("merge_pdf"));
          temp[args[1]] = `${uploadedFilename}`;
          localStorage.setItem("merge_pdf", JSON.stringify(temp));
        } else {
          const newArray = new Array(5);
          newArray[args[1]] = `${uploadedFilename}`;
          localStorage.setItem("merge_pdf", JSON.stringify(newArray));
        }
        total_merge_file_in_storage++;
        // console.log(total_merge_file_in_storage)
        //merge file name
        document.querySelector(`.file-${args[1] + 1} a`).innerText =uploadedFilename;
        //added link to merged filename
        document.querySelector(`.file-${args[1] + 1} a`).setAttribute("href", result.file);
        //styling
        document.querySelector(`.file-${args[1] + 1} a`).classList.add(
            "text-xs",
            "block",
            "w-auto",
            "text-center",
            "text-red-600",
            "truncate",
            "w-2/3"
          );
        //remove individual merged file
        document.querySelector(`.remove-${args[1] + 1}`).innerText = "X";
      }else if(args[0]==='split'){
        localStorage.setItem("split_pdf", JSON.stringify(result.resp.fileName));
      }
    }
  };

  //if merge file size less than 100 mbs
  if (args[0]==='merge' && merge_file.size < 1000000 * 100) {
    document.querySelector(".progress_container").style.display = "block";
    xhr.upload.onprogress = progressReport;
    xhr.open("POST", uploadURL);
    xhr.send(formData);
  }
  else if (args[0]==='split' && split_file.size < 1000000 * 100) {
    document.querySelector(".progress_container").style.display = "block";
    xhr.upload.onprogress = progressReport;
    xhr.open("POST", uploadURL);
    xhr.send(formData);
  }
  else if (file.size < 1000000 * 100) {
    document.querySelector(".progress_container").style.display = "block";
    xhr.upload.onprogress = progressReport;
    xhr.open("POST", uploadURL);
    xhr.send(formData);
  } else {
    Toastify({
      text: "File  Size Must be Less Than 100MBs",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#db142b",
        borderRadius: "40px",
      },
    }).showToast();
  }
}

const progressReport = (e) => {
  progressBar.style.transform = `scaleX(0)`;
  progessContainer.style.display = "block";
  const perc = parseInt((e.loaded / e.total) * 100);
  //  console.log(perc);

  uploadedPercentage.innerText = perc;
  progressBar.style.transform = `scaleX(${perc / 100})`;
};

const showLink = (link) => {
  document.querySelector(".progress_container").style.display = "none";
  sharingContainer.style.display = "block";
  //  console.log(link);
  document.querySelector(".progress_container").style.display = "none";
  showURL.value = link.file;

  if (document.querySelector("#qrcode").hasChildNodes()) {
    document.querySelector("#qrcode").innerHTML = "";
  }

  var QR_CODE = new QRCode("qrcode", {
    width: 220,
    height: 220,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  QR_CODE.makeCode(link.file);
};

copyButton.addEventListener("click", () => {
  showURL.select();
  document.execCommand("copy");
  copyMessage.style.display = "block";
  // window.scrollBy(0,200)
  let copyMsg;
  clearTimeout(copyMsg);
  copyMsg = setTimeout(() => {
    copyMessage.style.display = "none";
  }, 3000);
});

if (window.location.href.includes("_id", 0)) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  // console.log(params);
  localStorage.setItem("@Auth", JSON.stringify(params));

  window.location.href = "/public/index.html";
}

// console.log(typeof localStorage.getItem('@Auth'))

document.querySelector(".sent_to_btn").addEventListener("click", async (e) => {
  const receiver = document.querySelector(".send_to").value;
  if (receiver === JSON.parse(localStorage.getItem("@Auth")).email) {
    Toastify({
      text: "Can't Send files to the Same Person",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#46c837",
        borderRadius: "40px",
      },
    }).showToast();
  } else {
    const data = {
      ...JSON.parse(localStorage.getItem("@Auth")),
      file: JSON.parse(localStorage.getItem("file")).uuid,
    };
    // console.log(data)
    const result = await fetch(`https://share--x.herokuapp.com/sent_to/${receiver}`, {
      method: "POST", // or 'PUT'
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //   console.log(result)
    if (result.status) {
      Toastify({
        text: result.statusText,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#46c837",
          borderRadius: "40px",
        },
      }).showToast();
    }
  }
});
// console.log(localStorage.getItem('@Auth'))
const wrapper = document.querySelector(".wrapper");
const para = document.querySelector("p");

wrapper.addEventListener("change", function (e) {
  if (e.target.checked) {
    para.classList.add("morning");
    para.textContent = "Morning, Sunshine!";
  } else {
    para.classList.remove("morning");
    para.textContent = "Good Night!";
  }
});

finalMerge.addEventListener("click", async () => {
  if (localStorage.getItem("merge_pdf") && total_merge_file_in_storage >= 2) {
    fetch(uploadURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: JSON.parse(localStorage.getItem("merge_pdf")),
        toBeMerge: true,
      }),
    })
      .then((data) => {
        if (data.status === 200) {
          Toastify({
            text: "File Merged Successfully",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#46c837",
              borderRadius: "40px",
            },
          }).showToast();
        }
        localStorage.removeItem("merge_pdf");
        finalMerge.style.cursor = "no-drop";
        finalMerge.style.opacity = ".8";
        return data.json();
      })
      .then((data) => {
        let target = document.querySelector(".download_merged_file");
        target.classList.remove("hidden");
        target.classList.add("block");
        target.href = `${data.file}`;
        target.setAttribute("target", "_blank");
      });
  } else {
    Toastify({
      text: "2 Files atleast needed",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#db142b",
        borderRadius: "40px",
      },
    }).showToast();
  }
});

let initial_file_number_to_be_merged = 2;

add_more_file_to_merge_btn.addEventListener("click", () => {
  if (initial_file_number_to_be_merged === 5) {
    Toastify({
      text: "Maximum 5 Files can be Merged,as per Server Performance",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#db142b",
        borderRadius: "40px",
      },
    }).showToast();
    return;
  }

  initial_file_number_to_be_merged++;
  const div = document.createElement("div");
  const btn = document.createElement("button");
  const a = document.createElement("a");
  const span = document.createElement("span");

  div.classList.add(`file-${initial_file_number_to_be_merged}`);
  btn.classList.add(
    "merge_file_selector_btn",
    "bg-blue-600",
    "text-white",
    "px-4",
    "py-1",
    "rounded-lg",
    "border-2",
    "transition",
    "duration-300",
    "ease-out",
    "mx-1"
  );
  btn.innerHTML = "Add File " + initial_file_number_to_be_merged;

  span.classList.add(
    `remove-${initial_file_number_to_be_merged}`,
    "text-red-600"
  );
  div.appendChild(btn);
  div.appendChild(a);
  div.appendChild(span);

  add_file_to_be_merged_wrapper.appendChild(div);
});

document.querySelector(".convert-options").addEventListener("click", (e) => {
  if (e.target.localName === "button") {
    const body = {
      data: converterDecider,
      convertTo: e.target.innerText,
      convert: true,
    };
  
    document.querySelector('.loader-container').style.display='block'

    fetch(uploadURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((data)=>{
      return data.json()
    }).then((data)=>{
    document.querySelector('.loader-container').style.display='none'
        // console.log(data)
      Toastify({
        text: data.msg,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#46c837",
          borderRadius: "40px",
        },
      }).showToast();

      localStorage.setItem('file',JSON.stringify({uuid:data.resp.uuid}))

    }).catch((err)=>{
    document.querySelector('.loader-container').style.display='none'

      Toastify({
        text: 'Something went wrong while converting the file',
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#db142b",
          borderRadius: "40px",
        },
      }).showToast();
    })
  }
});


split_file_selector_btn.addEventListener('click',(e)=>{
  e.preventDefault();
  split_file_opener.click();
})

split_file_opener.addEventListener('change',(e)=>{
  upload('split',true)
})

finalSplit.addEventListener('click',(e)=>{
  e.preventDefault();
  if (localStorage.getItem("split_pdf")) {
    fetch(uploadURL, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType:'arraybuffer',
      body: JSON.stringify({
        data: JSON.parse(localStorage.getItem("split_pdf")),
        toBeSplit: true,
      }),
    })
      .then(async(response) => {
        console.log("got al files in api ");
        let blob = await new Blob([response.data], { type: 'application/zip' }) //It is optional
        
        download(response.data,"attachement.zip","application/zip") //this is third party it will prompt download window in browser.
        return response.data;
      })
      
      // fetch('https://api.pdf.co/v1/pdf/split', {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       'x-api-key': "roverboy773@gmail.com_fbeccaca8c85d60ec1671024299767df5896e8184d1b87801e01a201410e760f11927d16"
      //     },
      //     body: JSON.stringify({
      //       url: `https://share--x.herokuapp.com/uploads/${JSON.parse(localStorage.getItem('split_pdf'))}`,
      //       pages: "1-2,3-",
      //       name: "result.pdf",
      //       // data: JSON.parse(localStorage.getItem("split_pdf")),
      //       // toBeSplit: true,
      //     }),
      //   })
      //     .then((data) => {
      //       console.log(data)
      //       if (data.status === 200) {
      //         Toastify({
      //           text: "File Successfully Splitted",
      //           duration: 3000,
      //           newWindow: true,
      //           close: true,
      //           gravity: "top", // `top` or `bottom`
      //           position: "right", // `left`, `center` or `right`
      //           stopOnFocus: true, // Prevents dismissing of toast on hover
      //           style: {
      //             background: "#46c837",
      //             borderRadius: "40px",
      //           },
      //         }).showToast();
      //       }
            
      //       return data.json();
      //     }).then((data)=>{
      //          console.log(data)
      //     })



  } else {
    Toastify({
      text: "1 Files atleast needed",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#db142b",
        borderRadius: "40px",
      },
    }).showToast();
  }

})