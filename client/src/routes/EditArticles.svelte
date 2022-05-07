<script>
    import { Link, navigate } from "svelte-navigator";
    import { article, articles, id } from "../stores.js";

    const editArticle = (e) => {
        let szukaneId = 0;
        for (let i = 0; i < $articles.articles.length; i++) {
            if ($articles.articles.id == $id) {
                break;
            } else {
                szukaneId++;
            }
        }
        console.log($articles.articles);
        $articles.articles[szukaneId - 1].category =
            document.getElementById("category").value;
        $articles.articles[szukaneId - 1].title =
            document.getElementById("title").value;
        $articles.articles[szukaneId - 1].text =
            document.getElementById("tekst").value;
        let obj = {
            id: $id,
            category: document.getElementById("category").value,
            title: document.getElementById("title").value,
            text: document.getElementById("tekst").value,
            comments: [],
        };
        fetch("http://127.0.0.1:5000/editArticles", {
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
    };
</script>

<main>
    <div class="edit">
        Edytuj kategorię<input type="text" id="category" /><br />
        Edytuj tytuł<input type="text" id="title" /><br />
        Edytuj tekst<input type="text" id="tekst" /><br />
        <button on:click={editArticle}>Zapisz</button>
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
