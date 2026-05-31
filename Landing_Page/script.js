/* LOGIN */

function goLogin(){
    window.location.href = "login.html";
}

function showHome(){
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* SHOP */

function goShop(element) {
    const featuredSection = document.getElementById("featuredSection");
    const promoSection = document.getElementById("promoSection");

    if (!featuredSection || !promoSection) {
        window.location.href = "shoputensils.html";
        return;
    }

    const isFeatured = element && element.closest("#featuredSection, .featured-products");
    const isPromo = element && element.closest("#promoSection, .promo");

    if (isFeatured) {
        promoSection.scrollIntoView({ behavior: "smooth" });
    } else if (isPromo) {
        featuredSection.scrollIntoView({ behavior: "smooth" });
    } else {
        featuredSection.scrollIntoView({ behavior: "smooth" });
    }
}

/* CHECK LOGIN */

function checkLogin(){

    let isLoggedIn =
    localStorage.getItem("isLoggedIn");

    if(isLoggedIn === "true"){

        const shippingBtn =
        document.getElementById("shippingBtn");

        const topBar =
        document.getElementById("topBar");

        if(shippingBtn){
            shippingBtn.remove();
        }

        if(topBar){
            topBar.style.justifyContent =
            "flex-start";
        }
    }
}

function handleLogin(event){
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if(!email || !password){
        alert("Please enter both email and password.");
        return;
    }

    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "index.html";
}

/* CONTACT FORM */

const contactForm =
document.querySelector(".contact-form");

if(contactForm){

    contactForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            alert(
                "Thank you for contacting CHEFFY!"
            );

            contactForm.reset();
        }
    );
}

window.onload = checkLogin;