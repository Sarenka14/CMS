<script>
    import Comments from "./Comments.svelte";
    import { themeId, article, newTheme, title, category } from "../stores.js";
    const bigNews = `bigNews${$themeId}`;

    const fontSize = $newTheme.fontSize;
    const fontFamily = $newTheme.fontFamily;
    const fontColor = $newTheme.fontColor;
    const mainColor = $newTheme.mainColor;
</script>

<main
    class="main"
    style="--fontSize:{fontSize}px; --fontFamily:{fontFamily}; --bgColor:{mainColor}; --color:{fontColor};"
>
    <div class={bigNews}>
        <div>
            <h1>{$title}</h1>
            {$article}
        </div>
    </div>
    <Comments />
</main>

<style>
    .main {
        width: 70%;
        margin: 50px auto;
    }
    .news1,
    .bigNews1 {
        background-color: white;
        color: black;
        font-family: Arial;
        font-size: 20px;
    }
    .news2,
    .bigNews2 {
        background-color: green;
        color: red;
        font-family: Georgia;
        font-size: 20px;
    }
    .news3,
    .bigNews3 {
        background-color: lightblue;
        color: blue;
        font-family: "Times New Roman";
        font-size: 20px;
    }
    .news4,
    .bigNews4 {
        background-color: var(--bgColor);
        color: var(--color);
        font-family: var(--fontFamily);
        font-size: var(--fontSize);
    }
    .gallery {
        display: flex;
    }
    .photo {
        width: 30%;
        padding: 20px;
        border: 1px solid black;
        text-align: center;
        margin: 10px;
    }
    .bigNews1,
    .bigNews2,
    .bigNews3,
    .bigNews4 {
        padding: 20px;
        margin: 10px;
        border: 1px solid black;
        height: 500px;
        display: flex;
    }
    .logo {
        width: 1000px;
        height: 500px;
    }
    .logo2 {
        width: 100%;
        height: 300px;
    }
</style>
