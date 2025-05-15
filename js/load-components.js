export function loadComponents(){
    // Load Navbar
    fetch('/components/header.html')
    .then((res)=>{
        return res.text()
    })
    .then((data)=>{
        document.getElementById('header').innerHTML = data
    })

    // Load footer
    fetch('/components/footer.html')
    .then((res)=>{
        return res.text()
    }).then((data)=>{
        document.getElementById('footer').innerHTML = data
    })
}