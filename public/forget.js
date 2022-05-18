const email=document.querySelector('#email')
const sendOTPBtn=document.querySelector('.send_otp_btn')
const mainBody=document.querySelector('.main_body')
const OTP=document.querySelector('#otp')
const password=document.querySelector('#password')
const confirmPassword=document.querySelector('#confirm_password')
const changePasswordBtn=document.querySelector('#change_password')

// const host="https://share--x.herokuapp.com/";
const host = "http://localhost:5000/";

let generatedOTP
sendOTPBtn.addEventListener('click',(e)=>{
    
    e.preventDefault()
    
    document.querySelector('.loader-container').style.display='block'

    const data={emailID:email.value,mode:'Password Change'}
    
    if(email.value.indexOf('@')!=-1 && (email.value.length-email.value.indexOf('@'))>=6 && email.value.indexOf('@')>=2){
    fetch(`${host}/sendOTP`,{
        method: "POST",
        cors:'no-cors',
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(data)
    }).then((data)=>{
        return data.json()
    }).then((data)=>{
      console.log(data)
       document.querySelector('.loader-container').style.display='none'
       if(data.OTP){
       generatedOTP=data.OTP
       Toastify({
        text: `${data.msg}`,
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
         mainBody.classList.remove('hidden')
       }
    }).catch((err)=>{
        console.log(err)
    })
 }else{
    Toastify({
        text: "Something Wrong with Email ID",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "red",
          borderRadius: "40px",
        },
      }).showToast();
      document.querySelector('.loader-container').style.display='none'

 }
})


changePasswordBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    if(OTP.value===generatedOTP  && password.value===confirmPassword.value){
        console.log('called')
        const data={
            email:email.value,
            password:password.value
        }
        fetch(`${host}/updateUser`,{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }).then(data=>data.json())
        .then((data)=>{
            Toastify({
              text: `${data.msg}`,
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

            window.location.href="http://127.0.0.1:5500/public/loginEmail.html"

        }).catch(err=>console.log(err))
    }else{
        let error
        if(OTP.value!==generatedOTP)
             error="OTP typed didn't matched the sent OTP"
        
        else if(password.value!==confirmPassword.value)
             error='Passwords mismatches'
        Toastify({
            text: `${error}`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "red",
              borderRadius: "40px",
            },
          }).showToast();
    }
    
})

