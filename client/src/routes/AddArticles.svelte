<script>
    import { Link, navigate } from "svelte-navigator";
    import { article, articles, id, addId } from "../stores.js";

    const addArticle = (e) => {
        const id = $articles.articles.length;
        let obj = {
            id: id + 1,
            category: document.getElementById("category").value,
            title: document.getElementById("title").value,
            text: document.getElementById("tekst").value,
            comments: [],
        };
        $articles.articles.push(obj);
        fetch("http://127.0.0.1:5000/addArticles", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(obj),
            headers: new Headers({ "content-type": "application/json" }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
        navigate("/articles");
        $addId++;
    };
</script>

<main>
    <div class="edit">
        Podaj kategorię<input type="text" id="category" /><br />
        Podaj tytuł<input type="text" id="title" /><br />
        Podaj tekst<input type="text" id="tekst" /><br />
        <button on:click={addArticle}>Zapisz</button>
    </div>
</main>

<style>
    .edit {
        text-align: center;
    }

    input {
        margin-left: 20px;
    }
</style>
