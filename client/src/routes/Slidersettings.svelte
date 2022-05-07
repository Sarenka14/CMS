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

    let fileinput;

    const onFileSelected = (e) => {
        let image = e.target.files[0];
        fileinput = image;
    };
    const setSettings = () => {
        const time = document.getElementById("time").value;
        const description = document.getElementById("description").value;
        const body2 = {
            themeId: $themeId,
            articleId: $articleId,
            article: $article,
            title: $title,
            category: $category,
            topMenu: $topMenu,
            topMenuOption: $topMenuOption,
            sliderTime: $sliderTime,
            sliderDescription: description,
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

        sliderImages.set([...$sliderImages, fileinput.name]);
        sliderTime.set(time * 1000);
        sliderDescription.set(description);
    };
</script>

<Navigation />
<main>
    <h1>Ustawienia slidera</h1>
    <div>
        Dodaj zdjęcie<input
            type="file"
            accept=".jpg, .jpeg, .png"
            on:change={(e) => onFileSelected(e)}
            bind:this={fileinput}
        />
    </div>
    <div>Ustaw opis<input type="text" id="description" /></div>
    <div>Ustaw czas przejścia<input type="number" id="time" /></div>
    <button on:click={() => setSettings()}>Ustaw</button>
</main>

<style>
    main {
        width: 30%;
        margin: 50px auto;
        text-align: center;
    }
    main div {
        display: flex;
        justify-content: space-between;
    }
</style>
