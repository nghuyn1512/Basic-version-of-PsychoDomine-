const postcontainer= document.querySelector('.post-container');
const featuredcontainer =document.querySelector('.featured');
async function loadpost(){
    try{
        const reponse = await fetch('http://127.0.0.1:5000/get_posts?page=1&limit=50');
        const posts = await reponse.json();
        const shufflepost = shuffle(posts);

        postcontainer.innerHTML ='';
        shufflepost.forEach((posts,index) =>{
            const post = document.createElement('div');
            post.classList.add('post-box');
            if (posts.categories && posts.categories.length > 0) {
                posts.categories.forEach(category => {
                    post.classList.add(category.slug);
            });
            }
            post.innerHTML =
            `
            <img class = "post-image" src="${posts.photoPost.url}" alt="${posts.title}">
            <h2 class="category">
            ${posts.categories && posts.categories.length > 0 ? posts.categories[0].name : 'No Category'}
            </h2>
            <a href="post-page.html?id=${posts.slug}" class="post-title">${posts.title}</a>
            <span class="date">${posts.datePost}</span>
            <div class="post-description">
            <p>${posts.content.html}</p> 
            </div>
            <div class="author">
                <img src="${posts.authors.image.url}" alt="${posts.name}" class="author-img">
                <span class="description">${posts.authors.name}</span>
            </div>
            `;
            postcontainer.appendChild(post);
        });
    
    } catch(error){
        console.error("Failed to load posts:",error);
        postcontainer.innerHTML = '<p>Error loading post</p>';
    }
}
document.addEventListener("DOMContentLoaded",loadpost);

//featuredPost
async function featured(){
    try{
        const fpost = document.createElement('div');
        fpost.classList.add('about');
        const res = await fetch("http://127.0.0.1:5000/featured_post");
        const featured = await res.json();
        fpost.innerHTML=`
        <div class="featured-info">
            <img class="featured-image" src="${featured.photoPost.url}" alt="${featured.title}">
            <div class="info">
                <h2 class="post-category">${featured.categories[0].name}</h2>
                <a href="post-page.html?id=${featured.slug}" class="featured-title">${featured.title}</a>
                <div class="post-description">
                <p>${featured.content.html}</p> 
                </div>
              <div class="featured-author">
            <img src="${featured.authors.image.url}" class="authors-img" alt="${featured.authors[0]?.name}>
            <span class="author-name">${featured.authors.name}</span>
        </div>   
        </div> 
        </div>      `;
        featuredcontainer.appendChild(fpost);
    } catch(error){
        console.error("Failed to load posts:",error);
        postcontainer.innerHTML = '<p>Error loading post</p>';
    }    
}
document.addEventListener("DOMContentLoaded",featured);

// tự động sort bài viết khi reload
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]; 
    }
    console.log(a);
    return a;
}

//Filter
$(document).ready(function () {
    $(".filter-item").click(function () {
        const value = $(this).attr("data-filter");
        console.log("Filter clicked:", value);
        if (value === "all") {
            $(".post-box").show("1000");
        } else {
            $(".post-box")
                .not("." + value) 
                .hide(1000);
            $(".post-box")
                .filter("." + value)
                .show("1000");
        }

        $(this).addClass("active-filter").siblings().removeClass("active-filter");
    });
});

// giới hạn bài viết hiển thị 
const seemore= document.getElementById('seemore');
let a = []; 
let posts = 10;

async function loadPost() {
    try {
        const reponse = await fetch('http://127.0.0.1:5000/get_posts?page=1&limit=50');
        a = await reponse.json();

        display(posts);
        if (a.length > posts) {
            seemore.classList.remove('hidden');
        }

    } catch (error) {
        console.eerror("Failed to load posts:", error);
        postcontainer.innerHTML = '<p>Error loading posts</p>';
    }
}


function display(num) {
    postcontainer.innerHTML = ''; 
    const postdisplay = a.slice(0, num); 
    const shufflepost = shuffle(postdisplay);

    shufflepost.forEach(post => {
        const box= document.createElement('div');
        box.classList.add('post-box');
        if (post.categories && post.categories.length > 0) {
            post.categories.forEach(category => {
                box.classList.add(category.slug);
            });
        }
        box.innerHTML = `
            <img class="post-image" src="${post.photoPost.url}" alt="${post.title}">
            <h2 class="category">
            ${post.categories && post.categories.length > 0 ? post.categories[0].name : 'No Category'}
            </h2>
            <a href="post-page.html?id=${post.slug}" class="post-title">${post.title}</a>
            <span class="date">${post.datePost}</span>
            <div class="post-description">
                <p>${post.content.html}</p> 
            </div>
            <div class="author">
                <img src="${post.authors.image.url}" alt="${post.authors.name}" class="author-img">
                <span class="description">${post.authors.name}</span>
            </div>
        `;
        postcontainer.appendChild(box);
    });
    check();

}
function check() {
    const height = document.documentElement.scrollHeight;
    const pos = window.innerHeight + window.scrollY;

    if (pos >= height - 10) {
        seemore.classList.add('show');
    }
}

window.addEventListener('scroll', check);
seemore.addEventListener('click', () => {
    posts= a.length;
    display(posts); 
    seemore.classList.add('hidden');
});

document.addEventListener("DOMContentLoaded", loadPost);

// search 
document.getElementById("search-input").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const posts = document.querySelectorAll(".post-box");

    posts.forEach((post) => {
        const title = post.querySelector(".post-title").textContent.toLowerCase();
        const content = post.querySelector(".post-description p").textContent.toLowerCase();
        const category = post.querySelector(".category").textContent.toLowerCase();

        if (title.includes(query) || content.includes(query) || category.includes(query)) {
            post.style.display = "block";
        } else {
            post.style.display = "none";
        }
    });
});
