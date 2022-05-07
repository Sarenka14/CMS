<script>
    import { Router, Route, Link } from "svelte-navigator";
    let logo = "sentino.png";
    import {
        themeId,
        article,
        newTheme,
        articles,
        bigArticle,
        title,
        category,
        comments,
        articleId,
    } from "../stores.js";
    let smallNews = `smallNews${$themeId}`;
    let news = `news${$themeId}`;
    let bigNews = `bigNews${$themeId}`;
    let main = `main${$themeId}`;

    const block = $newTheme.block;
    const fontSize = $newTheme.fontSize;
    const fontFamily = $newTheme.fontFamily;
    const fontColor = $newTheme.fontColor;
    const mainColor = $newTheme.mainColor;

    if (main === "main4") {
        if (block == 1) {
            smallNews = "smallNews1";
            news = "news1";
            bigNews = "bigNews1";
        } else if (block == 2) {
            smallNews = "smallNews2";
            news = "news2";
            bigNews = "bigNews2";
        } else if (block == 3) {
            smallNews = "smallNews3";
            news = "news3";
            bigNews = "bigNews3";
        }
    }

    const setArticle = (x) => {
        articleId.set(x);
        article.set($articles.articles[x].text);
        title.set($articles.articles[x].title);
        category.set($articles.articles[x].category);
        comments.set($articles.articles[x].comments);
    };
</script>

<main
    class={main}
    style="--fontSize:{fontSize}px; --fontFamily:{fontFamily}; --bgColor:{mainColor}; --color:{fontColor};"
>
    <div class={smallNews}>
        {#each $articles.articles as art, i}
            <div class={news}>
                <h1>{art.title}</h1>
                <h3>{art.category}</h3>
                <div>
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
    <div class={bigNews}>
        <div>
            <h1>{$bigArticle.title}</h1>
            {$bigArticle.text}
        </div>
        <img src={logo} alt="ok" class="logo" />
    </div>
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
