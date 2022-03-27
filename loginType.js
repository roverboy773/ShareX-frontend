const googleLogin=document.querySelector('.google')
const faceLogin=document.querySelector('.facebook')

googleLogin.addEventListener('click',(e)=>{
  window.location.href="http://localhost:5000/public/google"
})
faceLogin.addEventListener('click',(e)=>{
  window.location.href="http://localhost:5000/public/facebook"
})
