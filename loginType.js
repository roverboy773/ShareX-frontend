const googleLogin=document.querySelector('.google')
const faceLogin=document.querySelector('.facebook')

googleLogin.addEventListener('click',(e)=>{
  window.location.href="http://share--x.herokuapp.com/public/google"
})
faceLogin.addEventListener('click',(e)=>{
  window.location.href="http://share--x.herokuapp.com/public/facebook"
})
