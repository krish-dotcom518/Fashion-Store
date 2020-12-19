const navbar = document.getElementById('navbar');
let scrolled = false;

window.onscroll = function () {
    if (window.pageYOffset > 40) {
        navbar.classList.remove('top');
        if (!scrolled) {
            navbar.style.transform = 'translateY(-270px)';
        }
        setTimeout(function () {
            navbar.style.transform = 'translateY(0)';
            scrolled = true;
        }, 200);
    } else {
        navbar.classList.add('top');
        scrolled = false;
    }
};


// Smooth Scrolling
$('#navbar a, .btn').on('click', function (e) {
    if (this.hash !== '') {
        e.preventDefault();

        const hash = this.hash;

        $('html, body').animate({
                scrollTop: $(hash).offset().top - 100,
            },
            800
        );
    }
});

//MenuToggle

const hamburger = document.getElementById('hamburger')
const navUl = document.getElementById('nav-ul')

hamburger.addEventListener('click', () => {
    navUl.classList.toggle('show');
});


//form toggle

const loginFrm = document.getElementById("loginFrm");
const regFrm = document.getElementById("regFrm");
const active = document.getElementById("active");

function reg() {
    regFrm.style.transform = "translateX(0px)";
    loginFrm.style.transform = "translateX(0px)";
    active.style.transform = "translateX(100px)";
}

function login() {
    regFrm.style.transform = "translateX(300px)";
    loginFrm.style.transform = "translateX(300px)";
    active.style.transform = "translateX(0px)";
}