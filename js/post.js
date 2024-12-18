function loadpost(){
    const url = new URLSearchParams(window.location.search);
    const slug = url.get('id');
    if(slug){
        fetch(`https://psychodomie.onrender.com/post?slug=${slug}`)
        .then(response => response.json())
        .then(post =>{
            if(post &&post.title){
                document.title = post.title;
                document.getElementsByClassName('title')[0].innerText=post.title;
                document.getElementsByClassName('post-categories')[0].innerText=post.categories[0].name;
                document.getElementsByClassName('name')[0].innerText=post.authors.name;
                document.getElementsByClassName('authors-img')[0].src=post.authors.image.url;
                document.getElementsByClassName('post-date')[0].innerText=post.datePost;
                document.getElementsByClassName('post-content')[0].innerHTML=post.content.html;
                document.getElementsByClassName('header-img')[0].src=post.photoPost.url;
            } else{
                document.getElementsByClassName('post-title')[0].innerText ="not found";
            }
        })
        .catch(error =>console.error('error:',error));
    }
    else{
        document.getElementsByClassName('title').innerText="slug not found";
    }
}

if(document.getElementsByClassName('post-title')){
    loadpost();
}
