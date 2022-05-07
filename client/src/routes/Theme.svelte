<script>
    import Navigation from "../components/Navigation.svelte";
    import {
        themeId,
        articleId,
        article,
        title,
        category,
        newTheme,
        topMenu,
        topMenuOption,
        sliderTime,
        sliderDescription,
        Footer,
    } from "../stores.js";
    let theme = `theme${$themeId}`;
    let main = `main${$themeId}`;
    const sendFetch = (id) => {
        themeId.set(id);
        const body = {
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
                theme = `theme${$themeId}`;
                main = `main${$themeId}`;
            });
    };

    const block = $newTheme.block;
    const fontSize = $newTheme.fontSize;
    const fontFamily = $newTheme.fontFamily;
    const fontColor = $newTheme.fontColor;
    const mainColor = $newTheme.mainColor;
    let width = 0;
    let flex = "";
    let wrap = "";

    if (block == 1) {
        width = 30;
    } else if (block == 2) {
        width = 40;
        flex = "space-beetwen";
        wrap = "wrap";
    } else {
        width = 100;
        flex = "center";
        wrap = "wrap";
    }
</script>

<Navigation />
<div
    class={main}
    style="--fontSize:{fontSize}px; --fontFamily:{fontFamily}; --color:{fontColor}; --flex:{flex}; --wrap:{wrap};"
>
    <div class={theme} style="--bgColor:{mainColor}; --width:{width}%;">
        <h1>Motyw 1</h1>
        <h2>Układ bloków:</h2>
        <div class="block1">
            <div class="block11" />
            <div class="block11" />
            <div class="block11" />
            <div class="block11" />
        </div>
        <h2>Czcionka:</h2>
        <h3>Arial 18px</h3>
        <h2>Kolory:</h2>
        <h3>Kolor tekstu: czarny</h3>
        <h3>Kolor głowny: biały</h3>
        <button on:click={() => sendFetch(1)}>Wybierz</button>
    </div>
    <div class={theme} style="--bgColor:{mainColor}; --width:{width}%;">
        <h1>Motyw 2</h1>
        <h2>Układ bloków:</h2>
        <div class="block2">
            <div class="block22" />
            <div class="block22" />
            <div class="block22" />
            <div class="block22" />
        </div>
        <h2>Czcionka:</h2>
        <h3>Georgia 18px</h3>
        <h2>Kolory:</h2>
        <h3>Kolor tekstu: czerwony</h3>
        <h3>Kolor głowny: zielony</h3>
        <button on:click={() => sendFetch(2)}>Wybierz</button>
    </div>
    <div class={theme} style="--bgColor:{mainColor}; --width:{width}%;">
        <h1>Motyw 3</h1>
        <h2>Układ bloków:</h2>
        <div class="block3">
            <div class="block33" />
            <div class="block33" />
            <div class="block33" />
            <div class="block33" />
        </div>
        <h2>Czcionka:</h2>
        <h3>Times New Roman 18px</h3>
        <h2>Kolory:</h2>
        <h3>Kolor tekstu: niebieski</h3>
        <h3>Kolor głowny: jasny niebieski</h3>
        <button on:click={() => sendFetch(3)}>Wybierz</button>
    </div>
</div>

<style>
    .main1 {
        width: 70%;
        margin: 50px auto;
        display: flex;
        font-family: Arial;
        font-size: 18;
    }
    .main2 {
        width: 70%;
        margin: 50px auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        font-family: Georgia;
        color: red;
        font-size: 18;
    }
    .main3 {
        width: 70%;
        margin: 50px auto;
        font-family: "Times New Roman";
        color: blue;
        font-size: 18;
    }
    .main4 {
        width: 70%;
        margin: 50px auto;
        display: flex;
        flex-wrap: var(--wrap);
        justify-content: var(--flex);
        font-size: var(--fontSize);
        font-family: var(--fontFamily);
        color: var(--color);
    }
    .theme1 {
        width: 30%;
        border: 1px solid black;
        margin: 30px;
        padding: 30px;
        text-align: center;
        background-color: white;
    }
    .theme2 {
        width: 40%;
        border: 1px solid black;
        margin: 30px;
        padding: 30px;
        text-align: center;
        background-color: green;
    }
    .theme3 {
        width: 100%;
        border: 1px solid black;
        margin: 30px;
        padding: 30px;
        text-align: center;
        background-color: lightblue;
    }
    .theme4 {
        border: 1px solid black;
        margin: 30px;
        padding: 30px;
        text-align: center;
        background-color: var(--bgColor);
        width: var(--width);
    }
    .block1 {
        height: 240px;
        display: flex;
        justify-content: center;
        border: 1px solid black;
        padding: 10px;
        align-items: center;
    }
    .block2 {
        height: 240px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        border: 1px solid black;
        padding: 10px;
        align-items: center;
    }
    .block3 {
        height: 240px;
        display: flex;
        align-items: center;
        flex-direction: column;
        border: 1px solid black;
        padding: 10px;
    }
    .block11 {
        width: 50px;
        height: 50px;
        border: 1px solid black;
        margin: 5px;
    }
    .block22 {
        width: 40%;
        height: 50px;
        border: 1px solid black;
        margin: 5px;
    }
    .block33 {
        width: 100%;
        height: 50px;
        border: 1px solid black;
        margin: 5px;
    }
</style>
