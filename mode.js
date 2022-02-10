document.querySelector('.wrapper').addEventListener('change', function(e) {
  if(e.target.checked) {
    localStorage.setItem("mode",'bright')
    
    if(document.querySelector('main'))
    document.querySelector('main').style.backgroundColor="white"
    if(document.querySelector('.info h4'))
    document.querySelector('.info h4').classList.remove('text-gray-50')
    if(document.querySelector('.title'))
    document.querySelector('.title').classList.remove('text-gray-50')
    if(document.querySelector('.precValue'))
    document.querySelector('.precValue').classList.remove('text-gray-50')
  } else {
    localStorage.setItem("mode",'dark')

    if(document.querySelector('main'))
    document.querySelector('main').style.backgroundColor="rgb(9, 2, 27)"
    if(document.querySelector('.info h4'))
    document.querySelector('.info h4').classList.add('text-gray-50')
    if(document.querySelector('.title'))
    document.querySelector('.title').classList.add('text-gray-50')
    if(document.querySelector('.precValue'))
    document.querySelector('.precValue').classList.add('text-gray-50')
  }
})