<script>
    let login = "";
    import {
        themeId,
        articleId,
        article,
        title,
        comments,
        category,
        newTheme,
        articles,
        bigArticle,
        topMenu,
        topMenuSettings,
        topMenuOption,
        sliderImages,
        sliderTime,
        sliderDescription,
        images,
        Footer,
        FooterSettings,
    } from "../stores.js";

    fetch("/login")
        .then((response) => response.json())
        .then((data) => {
            if (
                !(
                    data.poziom == "admin" &&
                    data.login != "admin" &&
                    data.password != "admin"
                )
            ) {
                login = data.login;
            } else {
                login = "admin";
            }
        });

    let addedComments = [...$comments];
    const addComment = () => {
        const newComment = document.getElementById("comment").value;
        addedComments = [...addedComments, newComment];
        $articles.articles[$articleId].comments = addedComments;
        const body = {
            comment: newComment,
            articleId: $articles.articles[$articleId].id,
        };
        console.log(body);
        fetch("http://127.0.0.1:5000/addComments", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(body),
            headers: new Headers({ "content-type": "application/json" }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
    };
</script>

<h1>Komentarze</h1>
<div class="comments">
    <input type="text" id="comment" />
    <button on:click={addComment}>Dodaj komentarz</button>
    <div id="added comments">
        {#each addedComments as comment, i}
            <div class="comment">
                {i + 1}. {comment}
            </div>
        {/each}
    </div>
</div>

<style>
    .comment {
        width: 300px;
        border: 1px solid black;
        padding: 10px;
        margin: 20px;
    }
</style>
