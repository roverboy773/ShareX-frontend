const otp=document.querySelector('#otp')
const otpWrapper=document.querySelector('.otp_wrapper')
let optGenerated
// const host="https://share--x.herokuapp.com/";
const host = "http://localhost:5000/";

document.getElementById("submit").addEventListener('click',async(e)=>{
    e.preventDefault()

    let email=document.getElementById("email").value
    let password=document.getElementById("password").value
    
    let data={email:email,password:password}
    
    
    fetch(`${host}login`,{
        method: 'POST', // or 'PUT'
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body:JSON.stringify(data),
      }).then(data=>data.json())
      .then(async(data)=>{
        if(data.user_id!==undefined){
          localStorage.setItem('@Auth',JSON.stringify({user:data.user_id,name:data.name}))
             console.log('i')
          const data1={emailID:email,mode:'Login Auth'}
          const result =await fetch(`${host}sendOTP`,{
            method: 'POST', // or 'PUT'
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body:JSON.stringify(data1),
          })
          const res=await result.json();
          optGenerated=res.OTP
          otpWrapper.classList.remove('hidden')
          document.getElementById("submit").classList.add('hidden')
          document.getElementById("verify").classList.remove('hidden')
    
          Toastify({
            text: "OTP Sent",
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
          
        } else{
          Toastify({
            text: 'wrong credentials',
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
  })

document.getElementById("verify").addEventListener('click',(e)=>{
e.preventDefault();

if(otp.value===optGenerated)
      window.location.href="http://127.0.0.1:5500/public/index.html"
      else{
        Toastify({
          text: "Invalid OTP",
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
