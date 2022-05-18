const googleLogin=document.querySelector('.google')
const faceLogin=document.querySelector('.facebook')
// const host=`${host}";
const host = "http://localhost:5000/";
googleLogin.addEventListener('click',(e)=>{
  window.location.href=`${host}public/google`
})
faceLogin.addEventListener('click',(e)=>{
  window.location.href=`${host}public/facebook`
})
