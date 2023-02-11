const home = document.getElementById("home")
const homeLink = document.querySelectorAll("li:not(#contactUsLink)")
const contact = document.getElementById("contact")
const contactLink = document.getElementById("contactUsLink")
const search = document.getElementById("search")
const scroller = document.getElementById("scroller")
const page = document.getElementById("page")
const next = document.getElementById("next")
const previous = document.getElementById("previous")
const display = document.getElementById("display")
const details = document.getElementById("displayDetails")
const searchDisplay = document.getElementById("searchDisplay")
const counterDisplay = document.getElementById("counterDisplay")

$(document).ready(_ => {
    closeNav()
    getMovies("trending/movie/day").then(_ => {
        $("#loading span").fadeOut(500,_ => {
            $("#loading").fadeOut(500,_ => {
                $("body").css("overflow","auto");
            });
        });
    })
});
function closeNav(){
    let boxWidth = $(".headerNav").outerWidth();
    $("header").animate({left: -boxWidth},500);
    $(".openBar").addClass("fa-align-justify");
    $(".openBar").removeClass("fa-xmark");
    for(let i=5;i>=0;i--){
        $(".headerNav li").eq(i).animate({top:"300px"},(i+6)*100);
    }
};
$(".openBar").click(_ => { 
    if($("header").css("left") === "0px"){
        closeNav()
    } else {
        $("header").animate({left: "0px"},500);
        $(".openBar").removeClass("fa-align-justify");
        $(".openBar").addClass("fa-xmark");
        for(let i=0;i<6;i++){
            $(".headerNav li").eq(i).animate({top:"0px"},(i+6)*100);
        }
    }
});
window.addEventListener("scroll", _ => {
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    let scrollHeight = document.documentElement.scrollTop
    scroller.style.width = `${(scrollHeight / height)* 100}%`
})

for(let i=0;i<homeLink.length;i++){
    homeLink[i].addEventListener("click",_ => {
        closeNav()
        home.classList.replace("d-none","d-block")
        contact.classList.replace("d-block","d-none")
    })
} 
contactLink.addEventListener("click", _ => {
    closeNav()
    home.classList.replace("d-block","d-none")
    contact.classList.replace("d-none","d-block")
})
search.addEventListener("keyup", _ => {
    search.value === "" || search.value === " " ?
    getMovies("trending/movie/day") :
    getMovies("search/movie",`query=${search.value}`);
})
search.addEventListener("focus",_ => {
    closeNav()
})

let currentPage = 1
let EndPoint = "trendingMovies";

$(".navLink").click(event => {
    let linkId = $(event.target).attr("id");
    replace()
    currentPage = 1
    page.innerHTML = currentPage
    if(linkId === "upcomingLink"){
        getMovies("movie/upcoming");
        EndPoint = "upcomingMovies";
    } else if (linkId === "nowPlayingLink"){
        getMovies("movie/now_playing");
        EndPoint = "nowPlayingMovies";
    } else if (linkId === "trendingLink"){
        getMovies("trending/movie/day");
        EndPoint = "trendingMovies";
    } else if (linkId === "popularLink"){
        getMovies("movie/popular");
        EndPoint = "popularMovies";
    } else if (linkId === "topRatedLink"){
        getMovies("movie/top_rated");
        EndPoint = "topRatedMovies";
    }
})
next.addEventListener("click", _ => {
    previous.classList.remove("disabled")
    page.innerHTML = currentPage + 1
    if(EndPoint === "upcomingMovies"){
        getMovies("movie/upcoming",`page=${++currentPage}`)
    } else if(EndPoint === "nowPlayingMovies"){
        getMovies("movie/now_playing",`page=${++currentPage}`)
    } else if(EndPoint === "trendingMovies"){
        getMovies("trending/movie/day",`page=${++currentPage}`)
    } else if(EndPoint === "popularMovies"){
        getMovies("movie/popular",`page=${++currentPage}`)
    } else if(EndPoint === "topRatedMovies"){
        getMovies("movie/top_rated",`page=${++currentPage}`)
    }
})
previous.addEventListener("click", _ => {
    if(currentPage <= 1){
        previous.classList.add("disabled")
    } else {
        previous.classList.remove("disabled")
        page.innerHTML = currentPage - 1
        if(EndPoint === "upcomingMovies"){
            getMovies("movie/upcoming",`page=${--currentPage}`)
        } else if(EndPoint === "nowPlayingMovies"){
            getMovies("movie/now_playing",`page=${--currentPage}`)
        } else if(EndPoint === "trendingMovies"){
            getMovies("trending/movie/day",`page=${--currentPage}`)
        } else if(EndPoint === "popularMovies"){
            getMovies("movie/popular",`page=${--currentPage}`)
        } else if(EndPoint === "topRatedMovies"){
            getMovies("movie/top_rated",`page=${--currentPage}`)
        }
    }
})

async function getMovies(index1,index2 = 1){
    let response = await fetch(`https://api.themoviedb.org/3/${index1}?api_key=c2e271c14241b9ba82cbd5318d68db83&${index2}`);
    response = await response.json();
    displayMovies(response.results);
}
function displayMovies(local){
    temp = ``
    for(let i=0;i<local.length;i++){
        if(local[i].poster_path === null){continue}
        temp +=`
        <div class="col-lg-4 col-md-6">
            <div onclick="getDetails(${local[i].id})" class="parentLayer rounded-2 position-relative overflow-hidden">
                <img class="w-100" src="https://image.tmdb.org/t/p/w500${local[i].poster_path}">
                <div class="layer p-2 position-absolute text-center d-flex justify-content-center align-items-center">
                    <div>
                        <p class="fs-3 fw-bold">${local[i].original_title !== undefined ? local[i].original_title : local[i].original_name}</p>
                        <p class="mb-1">Rate: ${local[i].vote_average !== undefined ? Math.round(local[i].vote_average) : ""}</p>
                        <p>${local[i].release_date !== undefined ? local[i].release_date : local[i].first_air_date}</p>
                    </div>
                </div>
            </div>
        </div>`
    }
    display.innerHTML = temp
}
async function getMovie(index){
    closeNav()
    let response = await fetch(`https://api.themoviedb.org/3/movie/${index}?api_key=c2e271c14241b9ba82cbd5318d68db83`);
    response = await response.json();
    displayDetails(response)
}
function displayDetails(local){
    let productionCountries = ``
    let spokenLanguages = ``
    let genres = ``
    let productionCompanies = ``
    for(let i=0;i<local.production_countries.length;i++){
        if(local.production_countries[i].name === "United States of America"){
            local.production_countries[i].name = "US"
            productionCountries += `<li class="pe-3">${local.production_countries[i].name}</li>`
        } else if(local.production_countries[i].name === "United Kingdom"){
            local.production_countries[i].name = "UK"
            productionCountries += `<li class="pe-3">${local.production_countries[i].name}</li>`
        } else {
            productionCountries += `<li class="pe-3">${local.production_countries[i].name}</li>`
        }
    }
    for(let i=0;i<local.spoken_languages.length;i++){
        spokenLanguages += `<li class="pe-3">${local.spoken_languages[i].english_name}</li>`
    }
    for(let i=0;i<local.genres.length;i++){
        if(local.genres[i].name === "Action"){
            genres += `<li class="me-3 p-1 alert alert-info">${local.genres[i].name}</li>`
        } else if(local.genres[i].name === "Adventure"){
            genres += `<li class="me-3 p-1 alert alert-success">${local.genres[i].name}</li>`
        } else if(local.genres[i].name === "Comedy" || local.genres[i].name === "Historical" || local.genres[i].name === "Musicals"){
            genres += `<li class="me-3 p-1 alert alert-warning">${local.genres[i].name}</li>`
        } else if(local.genres[i].name === "Crime" || local.genres[i].name === "Gangster" || local.genres[i].name === "Drama" || local.genres[i].name === "Western" || local.genres[i].name === "Horror"){
            genres += `<li class="me-3 p-1 alert alert-danger">${local.genres[i].name}</li>`
        } else if(local.genres[i].name === "Sci-Fi" || local.genres[i].name === "War"){
            genres += `<li class="me-3 p-1 alert alert-secondary">${local.genres[i].name}</li>`
        }
    }
    for(let i=0;i<local.production_companies.length;i++){
        productionCompanies += `<li class="pe-3">${local.production_companies[i].name}</li>`
    }
    temp = `
    <div class="col-12 text-center">
        <h1 class="text-center fw-bolder">${local.original_title !== undefined ? local.original_title : local.original_name}</h1>
    </div>
    <div class="col-lg-4">
        <img class="w-100" src="https://image.tmdb.org/t/p/w500/${local.poster_path}" alt="">
    </div>
    <div class="col-lg-8">
        <div class="row m-0">
            <div class="col-md-3 p-0">
                <p class="fw-bolder fs-5">Story :</p>
            </div>
            <div class="col-md-9 pt-1 d-flex justify-content-center justify-content-lg-start">
                <p>${local.overview !== undefined ? local.overview : ""}</p>
            </div>
        </div>
        <div class="row m-0">
            <div class="col-md-3 p-0">
                <p class="fw-bolder fs-5">Release Date :</p>
            </div>
            <div class="col-md-9 pt-1 d-flex justify-content-center justify-content-lg-start">
                <p class="alert alert-primary p-1">${local.release_date !== undefined ? local.release_date : local.first_air_date}</p>
            </div>
        </div>
        <div class="row m-0">
            <div class="col-md-3 p-0">
                <p class="fw-bolder fs-5">Countries :</p>
            </div>
            <div class="col-md-9 pt-1">
                <ul class="list-unstyled d-flex flex-wrap justify-content-center justify-content-lg-start">
                    ${productionCountries}
                </ul>
            </div>
        </div>
        <div class="row m-0">
            <div class="col-md-3 p-0">
                <p class="fw-bolder fs-5">Language :</p>
            </div>
            <div class="col-md-9 pt-1">
                <ul class="list-unstyled d-flex flex-wrap justify-content-center justify-content-lg-start">
                    ${spokenLanguages}
                </ul>
            </div>
        </div>
        <div class="row m-0">
            <div class="col-md-3 p-0">
                <p class="fw-bolder fs-5">Genres :</p>
            </div>
            <div class="col-md-9 pt-1">
                <ul class="list-unstyled d-flex flex-wrap justify-content-center justify-content-lg-start">
                    ${genres}
                </ul>
            </div>
        </div>
        <div class="row m-0">
            <div class="col-md-3 p-0">
                <p class="fw-bolder fs-5">Rating :</p>
            </div>
            <div class="col-md-9 pt-1 d-flex justify-content-center justify-content-lg-start">
                <p>
                    <i class="fa-solid fa-star text-warning"></i>
                    <span class="fw-bolder ms-2">${Math.round(local.vote_average)}</span> / 
                    <span class="text-muted fw-bold me-4">10 . ${local.vote_count}K</span>
                </p>
            </div>
        </div>
        <div class="row m-0">
            <div class="col-md-3 p-0">
                <p class="fw-bolder fs-5">Companies :</p>
            </div>
            <div class="col-md-9 pt-1">
                <ul class="list-unstyled d-flex flex-wrap justify-content-center justify-content-lg-start">
                    ${productionCompanies}
                </ul>
            </div>
        </div>
    </div>`
    details.innerHTML = temp
}

function getDetails(id){
    getMovie(`${id}`)
    details.classList.replace("d-none","d-flex")
    display.classList.replace("d-flex","d-none")
    searchDisplay.classList.replace("d-block","d-none")
    counterDisplay.classList.replace("d-block","d-none")    
}
function replace(){
    details.classList.replace("d-flex","d-none")
    display.classList.replace("d-none","d-flex")
    searchDisplay.classList.replace("d-none","d-block")
    counterDisplay.classList.replace("d-none","d-block")
}

function validName(){
    return (/^[A-Za-z]{4,10}(\s?[A-Za-z]{4,10})?$/.test(document.getElementById("nameInput").value))
}
function validEmail(){
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}
function validPhone(){
    return (/^[0]{1}[1]{1}(5|0|2|1){1}[0-9]{8}$/.test(document.getElementById("phoneInput").value))
}
function validAge(){
    return (/^[1-9]{1}[0-9]{1}$/.test(document.getElementById("ageInput").value))
}
function validPassword(){
    return (/^.{5,15}$/.test(document.getElementById("passwordInput").value))
}
function validRePassword(){
    return (document.getElementById("passwordInput").value === document.getElementById("rePasswordInput").value)
}

let nameInputTouched = false
let emailInputTouched = false
let phoneInputTouched = false
let ageInputTouched = false
let passwordInputTouched = false
let rePasswordInputTouched = false

document.getElementById("nameInput").addEventListener("focus",_ =>{
    nameInputTouched = true
    closeNav()
})
document.getElementById("emailInput").addEventListener("focus",_ =>{
    emailInputTouched = true
    closeNav()
})
document.getElementById("phoneInput").addEventListener("focus",_ =>{
    phoneInputTouched = true
    closeNav()
})
document.getElementById("ageInput").addEventListener("focus",_ =>{
    ageInputTouched = true
    closeNav()
})
document.getElementById("passwordInput").addEventListener("focus",_ =>{
    passwordInputTouched = true
    closeNav()
})
document.getElementById("rePasswordInput").addEventListener("focus",_ =>{
    rePasswordInputTouched = true
    closeNav()
})

function valid(){
    if(nameInputTouched){
        if(validName()){
            document.getElementById("nameAlert").classList.replace("d-block","d-none")
            document.getElementById("nameInput").classList.add("is-valid")
            document.getElementById("nameInput").classList.remove("is-invalid")
        } else {
            document.getElementById("nameAlert").classList.replace("d-none","d-block")
            document.getElementById("nameInput").classList.add("is-invalid")
            document.getElementById("nameInput").classList.remove("is-valid")
        }
    }
    if(emailInputTouched){
        if(validEmail()){
            document.getElementById("emailAlert").classList.replace("d-block","d-none")
            document.getElementById("emailInput").classList.add("is-valid")
            document.getElementById("emailInput").classList.remove("is-invalid")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none","d-block")
            document.getElementById("emailInput").classList.add("is-invalid")
            document.getElementById("emailInput").classList.remove("is-valid")
        }
    }
    if(phoneInputTouched){
        if(validPhone()){
            document.getElementById("phoneAlert").classList.replace("d-block","d-none")
            document.getElementById("phoneInput").classList.add("is-valid")
            document.getElementById("phoneInput").classList.remove("is-invalid")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none","d-block")
            document.getElementById("phoneInput").classList.add("is-invalid")
            document.getElementById("phoneInput").classList.remove("is-valid")
        }
    }
    if(ageInputTouched){
        if(validAge()){
            document.getElementById("ageAlert").classList.replace("d-block","d-none")
            document.getElementById("ageInput").classList.add("is-valid")
            document.getElementById("ageInput").classList.remove("is-invalid")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none","d-block")
            document.getElementById("ageInput").classList.add("is-invalid")
            document.getElementById("ageInput").classList.remove("is-valid")
        }
    }
    if(passwordInputTouched){
        if(validPassword()){
            document.getElementById("passwordAlert").classList.replace("d-block","d-none")
            document.getElementById("passwordInput").classList.add("is-valid")
            document.getElementById("passwordInput").classList.remove("is-invalid")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none","d-block")
            document.getElementById("passwordInput").classList.add("is-invalid")
            document.getElementById("passwordInput").classList.remove("is-valid")
        }
    }
    if(rePasswordInputTouched){
        if(validRePassword()){
            document.getElementById("rePasswordAlert").classList.replace("d-block","d-none")
            document.getElementById("rePasswordInput").classList.add("is-valid")
            document.getElementById("rePasswordInput").classList.remove("is-invalid")
        } else {
            document.getElementById("rePasswordAlert").classList.replace("d-none","d-block")
            document.getElementById("rePasswordInput").classList.add("is-invalid")
            document.getElementById("rePasswordInput").classList.remove("is-valid")
        }
    }
    validName() && validEmail() && validPhone() && validAge() && validPassword() && validRePassword() ?
    document.getElementById("submitInput").removeAttribute("disabled") :
    document.getElementById("submitInput").setAttribute("disabled",true);
}
