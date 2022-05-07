<script>
    import { Link, navigate } from "svelte-navigator";
    import {
        id,
        themeId,
        article,
        newTheme,
        articles,
        category,
        title,
        articleId,
        comments,
    } from "../stores.js";
    import Navigation from "../components/Navigation.svelte";
    let smallNews = `smallNews${$themeId}`;
    let news = `news${$themeId}`;
    let main = `main${$themeId}`;

    const block = $newTheme.block;
    const fontSize = $newTheme.fontSize;
    const fontFamily = $newTheme.fontFamily;
    const fontColor = $newTheme.fontColor;
    const mainColor = $newTheme.mainColor;
    let articlesTable = [...$articles.articles];

    if (main === "main4") {
        if (block == 1) {
            smallNews = "smallNews1";
            news = "news1";
        } else if (block == 2) {
            smallNews = "smallNews2";
            news = "news2";
        } else if (block == 3) {
            smallNews = "smallNews3";
            news = "news3";
        }
    }

    const setArticle = (x) => {
        articleId.set(x);
        comments.set(articlesTable[x].comments);
        article.set(articlesTable[x].text);
        title.set(articlesTable[x].title);
        category.set(articlesTable[x].category);
    };

    const deleteArticle = (e) => {
        let id = e.target.value;
        let obj = {
            id: id,
        };
        fetch("http://127.0.0.1:5000/deleteArticles", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(obj),
            headers: new Headers({ "content-type": "application/json" }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
        articles.update((x) => {
            let obj = x;
            obj.articles = x.articles.filter((l) => {
                return l.id != id;
            });
            return obj;
        });
        articlesTable = [...$articles.articles];
        console.log($articles);
    };

    const editArticle = (e) => {
        let idd = e.target.value;
        id.set(idd);
        navigate("/editArticles/" + idd);
    };

    const addArticles = (e) => {
        navigate("/addArticles/");
    };

    let filtrTitle = "";
    let filtrCategory = "";
    const filtrTitleFunction = () => {
        articlesTable.length = 0;
        if (filtrTitle.value != "") {
            $articles.articles.forEach((e) => {
                if (e.title.toLowerCase() == filtrTitle.value.toLowerCase()) {
                    articlesTable.push(e);
                }
            });
        }
    };
    const allTitle = () => {
        articlesTable = [...$articles.articles];
    };
    const filtrCategoryFunction = () => {
        articlesTable.length = 0;
        if (filtrCategory.value != "") {
            $articles.articles.forEach((e) => {
                if (
                    e.category.toLowerCase() ==
                    filtrCategory.value.toLowerCase()
                ) {
                    articlesTable.push(e);
                }
            });
        }
    };

    const sortStr = (a, b) => {
        const tmpA = a.category.toLowerCase();
        const tmpB = b.category.toLowerCase();
        if (tmpA > tmpB) {
            return 1;
        } else if (tmpA < tmpB) {
            return -1;
        } else {
            return 0;
        }
    };

    const sortStr2 = (a, b) => {
        const tmpA = a.title.toLowerCase();
        const tmpB = b.title.toLowerCase();
        if (tmpA > tmpB) {
            return 1;
        } else if (tmpA < tmpB) {
            return -1;
        } else {
            return 0;
        }
    };

    let login = "";
    let password = "";
    let poziom = "";
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
                password = data.password;
                poziom = data.poziom;
            } else {
                login = "admin";
                password = "admin";
                poziom = "admin";
            }
        });
</script>

<Navigation />
<main
    class={main}
    style="--fontSize:{fontSize}px; --fontFamily:{fontFamily}; --bgColor:{mainColor}; --color:{fontColor};"
>
    <div>
        Wyszukaj tytuł <input type="text" bind:this={filtrTitle} /><button
            on:click={() => filtrTitleFunction()}>Filtruj</button
        >
        <button on:click={() => allTitle()}>Pokaż wszystkie</button>
    </div>
    <div>
        Wyszukaj kategorie <input
            type="text"
            bind:this={filtrCategory}
        /><button on:click={() => filtrCategoryFunction()}>Filtruj</button>
    </div>
    <div>
        <button
            on:click={() => {
                articlesTable = articlesTable.sort(sortStr);
            }}>Sortuj po kategoriach</button
        >
        <button
            on:click={() => {
                articlesTable = articlesTable.sort(sortStr2);
            }}>Sortuj po tytułach</button
        >
    </div>
    <div class={smallNews}>
        {#each articlesTable as art, i}
            <div class={news}>
                {#if login != ""}
                    <button value={art.id} on:click={editArticle}>Edytuj</button
                    >
                    <button value={art.id} on:click={deleteArticle}>Usuń</button
                    >
                {/if}
                <h1>{art.title}</h1>
                <h3>{art.category}</h3>
                <div id="text1">
                    {art.text}
                </div>
                <div class="bt">
                    <Link to="/second" on:click={() => setArticle(i)}
                        >Read more</Link
                    >
                </div>
            </div>
        {/each}
    </div>
    {#if login != ""}
        <button on:click={addArticles}>Dodaj</button>
    {/if}
</main>

<style>
    .main1 {
        width: 70%;
        margin: 50px auto;
        font-size: 18px;
        font-family: Arial;
    }
    .main2 {
        width: 70%;
        margin: 50px auto;
        font-size: 18px;
        font-family: Georgia;
    }
    .main3 {
        width: 70%;
        margin: 50px auto;
        font-size: 18px;
        font-family: "Times New Roman";
    }
    .main4 {
        width: 70%;
        margin: 50px auto;
        font-size: var(--fontSize);
        font-family: var(--fontFamily);
    }
    .main2 .news2,
    .main2 .bigNews2 {
        background-color: green;
        color: red;
    }
    .main3 .news3,
    .main3 .bigNews3 {
        background-color: lightblue;
        color: blue;
    }
    .main4 .news4,
    .main4 .bigNews4,
    .main4 .news3,
    .main4 .bigNews3,
    .main4 .news2,
    .main4 .bigNews2 {
        background-color: var(--bgColor);
        color: var(--color);
    }
    .logo {
        width: 1000px;
        height: 500px;
    }
    .bt {
        border: 1px solid black;
        width: 100px;
    }
    .smallNews1 {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .smallNews2 {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .smallNews3 {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .news1 {
        width: 20%;
        padding: 20px;
        border: 1px solid black;
        text-align: center;
        margin: 10px;
    }
    .news2 {
        width: 45%;
        padding: 20px;
        border: 1px solid black;
        text-align: center;
        margin-top: 20px;
    }
    .news3 {
        padding: 20px;
        border: 1px solid black;
        text-align: center;
        margin-top: 20px;
    }
    .bigNews1 {
        padding: 20px;
        margin: 10px;
        border: 1px solid black;
        height: 500px;
        display: flex;
        font-size: 20px;
    }
    .bigNews2 {
        padding: 20px;
        margin-top: 20px;
        border: 1px solid black;
        height: 500px;
        display: flex;
        font-size: 20px;
    }
    .bigNews3 {
        padding: 20px;
        margin-top: 20px;
        border: 1px solid black;
        height: 500px;
        display: flex;
        font-size: 20px;
    }
</style>
