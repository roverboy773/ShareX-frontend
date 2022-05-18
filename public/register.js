let otpVal

// const host="https://share--x.herokuapp.com/";
const host = "http://localhost:5000/";

document.getElementById("continue").addEventListener('click', async (e) => {

  e.preventDefault()
  // let flag = true

  const fname = document.querySelector('.fname')
  // const emailv = document.querySelector('.email')

  let name = document.getElementById("username").value
  let email = document.getElementById("email").value
  let password = document.getElementById("password").value
  const alert = document.querySelector('.alert')

  const arr = [fname]
  const alert_arr = ['fname_alert']
  const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

  let k = 0;
  arr.forEach((ele) => {
    if (special.test(ele.value)) {
      alert.innerHTML = "* Fields can't contain special characters or numbers"
      ele.style.borderColor = "red"
      k++
      // console.log(k)
    }
  })
  arr.forEach((ele, i) => {

    function func() {
      if (ele.value)
        ele.value = ele.value.trim()

      if (i === 0) {
        if (special.test(arr[i].value) || /\d/.test(arr[i].value)) {
          document.getElementById(`${alert_arr[i]}`).innerHTML = "* Only alphabets"
          document.getElementById(`${alert_arr[i]}`).style.color = "red"
          document.getElementById(`${alert_arr[i]}`).style.margin = "0.5rem 0 0rem 0"
          k++
        } else if (arr[i].value.length <= 5 || arr[i].value.length >= 20) {
          document.getElementById(`${alert_arr[i]}`).innerHTML = "* Length range 5 to 20"
          document.getElementById(`${alert_arr[i]}`).style.color = "red"
          document.getElementById(`${alert_arr[i]}`).style.margin = "0.5rem 0 0rem 0"
          k++
        }
        else {
          document.getElementById(`${alert_arr[i]}`).innerHTML = ""
          document.getElementById(`${alert_arr[i]}`).style.color = "rgba(52, 211, 153,1)"
          document.getElementById(`${alert_arr[i]}`).style.margin = "1rem 0 1rem 0"
        }
      }
    }
    func()
  })
  if (k === 0) {
    let data = { name, email, password }


    const result = await fetch(`${host}register`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    // console.log(result)
    let toastColor, flag = false;
    if (result.status > 203) {
      toastColor = "#e62019"
      Toastify({
        text: result.statusText,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: toastColor,
          borderRadius: "40px"
        },
      }).showToast();
    }
    else {
      const data={emailID:email,mode:'registration'}
      const result = await fetch(`${host}sendOTP`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })
      const resultAwait=await result.json()
      toastColor = "#46c837"
      otpVal=resultAwait.OTP
      Toastify({
        text:'OTP sent Successfully',
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: toastColor,
          borderRadius: "40px"
        },
      }).showToast();
      flag = true;
    }
    
    if (flag) {
      document.querySelector('.otp_wrapper').classList.remove('hidden')
      document.getElementById("continue").classList.add('hidden')
      document.getElementById("submit").classList.remove('hidden')

    }
  }
})

document.getElementById("submit").addEventListener('click',(e)=>{
  console.log(otpVal)
  e.preventDefault()

  const otp=document.querySelector('#otp').value
  if(otp===otpVal)
    {
      Toastify({
        text:"user Added Successfully",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: 'green',
          borderRadius: "40px"
        },
      }).showToast();
      window.location.href="http://127.0.0.1:5500/public/loginEmail.html"
    }else{
      Toastify({
        text:"Wrong OTP Entered",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: 'red',
          borderRadius: "40px"
        },
      }).showToast();
    }
})


