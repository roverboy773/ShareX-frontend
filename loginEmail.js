document.getElementById("submit").addEventListener('click',async(e)=>{
    e.preventDefault()

    let email=document.getElementById("email").value
    let password=document.getElementById("password").value
    
    let data={email,password}
    
    
    const result =await fetch('https://share--x.herokuapp.com/login',{
        method: 'POST', // or 'PUT'
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body:JSON.stringify(data),
      })
      const res=await result.json();
      console.log(res)
    if(res.user_id!==undefined){
      localStorage.setItem('@Auth',JSON.stringify({user:res.user_id,name:res.name}))
      window.location.href="/public/index.html"
    }
})
