<script>
    import Navigation from "../components/Navigation.svelte";
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

    const sendFetch = async (id) => {
        themeId.set(id);
        const body2 = {
            themeId: $themeId,
            articleId: $articleId,
            article: $article,
            title: $title,
            category: $category,
            topMenu: $topMenu,
            topMenuOption: $topMenuOption,
            sliderTime: $sliderTime,
            sliderDescription: $sliderDescription,
            Footer: $Footer,
        };

        fetch("http://127.0.0.1:5000/variables", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(body2),
            headers: new Headers({ "content-type": "application/json" }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
        const block = document.querySelector(
            'input[name="block"]:checked'
        ).value;
        const fontSize = document.getElementById("fontSize").value;
        const fontFamily = document.getElementById("fontFamily").value;
        const fontColor = document.getElementById("fontColor").value;
        const mainColor = document.getElementById("mainColor").value;
        const body = {
            block: block,
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontColor: fontColor,
            mainColor: mainColor,
        };

        fetch("http://127.0.0.1:5000/newTheme", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(body),
            headers: new Headers({ "content-type": "application/json" }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
        fetch(`/motyw?id=${id}`, { method: "post" })
            .then((response) => response.json())
            .then((data) => {
                themeId.set(data.id);
                newTheme.set({
                    block: block,
                    fontSize: fontSize,
                    fontFamily: fontFamily,
                    fontColor: fontColor,
                    mainColor: mainColor,
                });
            });
    };
</script>

<Navigation />

<div class="main">
    <h1>Nowy motyw</h1>
    <div class="inputs">
        <div>
            Układ bloków
            <input type="radio" name="block" value="1" />
            <div class="block1">
                <div class="block11" />
                <div class="block11" />
                <div class="block11" />
                <div class="block11" />
            </div>
            <input type="radio" name="block" value="2" />
            <div class="block2">
                <div class="block22" />
                <div class="block22" />
                <div class="block22" />
                <div class="block22" />
            </div>
            <input type="radio" name="block" value="3" />
            <div class="block3">
                <div class="block33" />
                <div class="block33" />
                <div class="block33" />
                <div class="block33" />
            </div>
        </div>
        <p>Wielkość czcionki<input type="number" id="fontSize" /></p>
        <p>Rodzaj czcionki<input type="text" id="fontFamily" /></p>
        <p>Kolor tekstu<input type="color" id="fontColor" /></p>
        <p>Kolor główny<input type="color" id="mainColor" /></p>
        <button on:click={() => sendFetch(4)}>Ustaw</button>
    </div>
</div>

<style>
    .main {
        width: 50%;
        margin: 50px auto;
        text-align: center;
    }
    .inputs p,
    .inputs div {
        display: flex;
        justify-content: space-between;
    }
    .block1 {
        width: 10%;
        height: 60px;
        display: flex;
        justify-content: center;
        border: 1px solid black;
        padding: 10px;
        align-items: center;
    }
    .block2 {
        width: 10%;
        height: 60px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        border: 1px solid black;
        padding: 10px;
        align-items: center;
    }
    .block3 {
        width: 10%;
        height: 60px;
        display: flex;
        align-items: center;
        flex-direction: column;
        border: 1px solid black;
        padding: 10px;
    }
    .block11 {
        width: 20px;
        height: 20px;
        border: 1px solid black;
        margin: 5px;
    }
    .block22 {
        width: 30%;
        height: 20px;
        border: 1px solid black;
        margin: 5px;
    }
    .block33 {
        width: 100%;
        height: 20px;
        border: 1px solid black;
        margin: 5px;
    }
</style>
