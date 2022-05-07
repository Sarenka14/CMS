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

    const sendFetch = (id) => {
        topMenu.set(id);
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

        const fontSize = document.getElementById("fontSize").value;
        const fontFamily = document.getElementById("fontFamily").value;
        const fontColor = document.getElementById("fontColor").value;
        const mainColor = document.getElementById("mainColor").value;
        const body = {
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontColor: fontColor,
            mainColor: mainColor,
        };

        fetch("http://127.0.0.1:5000/topMenuSettings", {
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
                topMenu.set(data.id);
                topMenuSettings.set({
                    fontSize: fontSize,
                    fontFamily: fontFamily,
                    fontColor: fontColor,
                    mainColor: mainColor,
                });
            });
    };

    const setTopMenuOption = () => {
        if ($topMenuOption) {
            topMenuOption.set(false);
        } else {
            topMenuOption.set(true);
        }
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
        console.log($topMenuOption);

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
    };
</script>

<Navigation />
<div class="main">
    <h1>Ustawienia menu górnego</h1>
    <div class="inputs">
        <p>Wielkość czcionki<input type="number" id="fontSize" /></p>
        <p>Rodzaj czcionki<input type="text" id="fontFamily" /></p>
        <p>Kolor tekstu<input type="color" id="fontColor" /></p>
        <p>Kolor główny<input type="color" id="mainColor" /></p>
        <button on:click={() => sendFetch(4)}>Ustaw</button>
    </div>
    <div>
        <h2>
            Zmień opcje wyświetlanie menu <button
                on:click={() => setTopMenuOption()}>Zmień</button
            >
        </h2>
    </div>
</div>

<style>
    .main {
        width: 50%;
        margin: 50px auto;
        text-align: center;
    }
    .inputs p {
        display: flex;
        justify-content: space-between;
    }
</style>
