<script>
    import { Link } from "svelte-navigator";
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
    let logo = "sentino.png";
    let login = "";
    let poziom = "";
    let password = "";

    const navigation = `navigation${$topMenu}`;
    const navigation2 = `navigation2${$topMenu}`;
    const fontSize = $topMenuSettings.fontSize;
    const fontFamily = $topMenuSettings.fontFamily;
    const fontColor = $topMenuSettings.fontColor;
    const mainColor = $topMenuSettings.mainColor;

    fetch("/all")
        .then((response) => response.json())
        .then((data) => {
            themeId.set(data.variables[0][0]);
            category.set(data.variables[0][4]);
            topMenu.set(data.variables[0][5]);
            if (data.variables[0][6] == 1) topMenuOption.set(true);
            else topMenuOption.set(false);
            sliderTime.set(data.variables[0][7]);
            sliderDescription.set(data.variables[0][8]);
            Footer.set(data.variables[0][9]);
            newTheme.set({
                block: data.newTheme[0][0],
                fontSize: data.newTheme[0][1],
                fontFamily: data.newTheme[0][2],
                fontColor: data.newTheme[0][3],
                mainColor: data.newTheme[0][4],
            });
            topMenuSettings.set({
                fontSize: data.topMenuSettings[0][0],
                fontFamily: data.topMenuSettings[0][1],
                fontColor: data.topMenuSettings[0][2],
                mainColor: data.topMenuSettings[0][3],
            });
            FooterSettings.set({
                fontSize: data.FooterSettings[0][0],
                fontFamily: data.FooterSettings[0][1],
                fontColor: data.FooterSettings[0][2],
                mainColor: data.FooterSettings[0][3],
            });

            $articles.articles.length = 0;
            data.articles.forEach((e) => {
                $articles.articles.push({
                    id: e[0],
                    category: e[1],
                    title: e[2],
                    text: e[3],
                    comments: [],
                });
            });

            $articles.articles.forEach((k) => {
                k.comments.length = 0;
                data.comments.forEach((e) => {
                    if (e[1] == k.id) {
                        k.comments.push(e[0]);
                    }
                });
            });
        });

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
    const changeMenu = () => {
        const nav = document.getElementById("navigation");
        if (nav.style.display == "none") nav.style.display = "flex";
        else nav.style.display = "none";
    };
</script>

{#if $topMenuOption}
    <nav
        class={navigation}
        style="--bgColor:{mainColor}; --fontFamily:{fontFamily}; --color:{fontColor}; --fontSize:{fontSize}px;"
    >
        <div class="navigation_left">
            <img src={logo} alt="logo" class="img" />
            <div>
                <div class="top">
                    <div class="links">
                        <Link to="/">Home</Link>
                    </div>
                    <div class="links">
                        <Link to="/articles">Artykuły</Link>
                    </div>
                    <div class="links">
                        <Link to="/gallery">Galeria</Link>
                    </div>

                    {#if login != ""}
                        {#if login == "admin"}
                            <div class="links">
                                <a href="/userssettings"
                                    >Zarządzanie użytkownikami</a
                                >
                            </div>
                        {:else}
                            <div class="links">
                                <a
                                    href="/user?login={login}&password={password}"
                                    >Ustawienia użytkownika</a
                                >
                            </div>
                        {/if}
                    {/if}
                </div>
                <div class="bottom">
                    {#if login != ""}
                        <div class="links">
                            <Link to="/theme">Wybierz gotowy motyw</Link>
                        </div>
                        <div class="links">
                            <Link to="/newTheme">Stwórz nowy motyw</Link>
                        </div>
                        <div class="links">
                            <Link to="/menuSettings"
                                >Zarządzanie menu górnym</Link
                            >
                        </div>
                        <div class="links">
                            <Link to="/sliderSettings"
                                >Zarządzanie sliderem</Link
                            >
                        </div>
                        <div class="links">
                            <Link to="/footerSettings">Zarządzanie stopką</Link>
                        </div>
                        <div class="links">
                            <Link to="/importExport"
                                >import/export ustawień</Link
                            >
                        </div>
                    {/if}
                </div>
            </div>
        </div>
        <div>
            {#if login != ""}
                Konto: {login}
                Poziom: {poziom}
                <button
                    class="blue"
                    on:click={() => {
                        login = "";
                        poziom = "";
                    }}>Wyloguj</button
                >
            {:else}
                <button class="green">
                    <a href="/logowanie">Logowanie</a>
                </button>
                <button class="blue">
                    <a href="/register">Rejestracja</a>
                </button>
            {/if}
        </div>
    </nav>
{:else}
    <div>
        <div class="hamburger" on:click={() => changeMenu()}>
            <div class="h" />
            <div class="h" />
            <div class="h" />
        </div>
        <nav
            id="navigation"
            class={navigation2}
            style="--bgColor:{mainColor}; --fontFamily:{fontFamily}; --color:{fontColor}; --fontSize:{fontSize}px; display: none;"
        >
            <div class="navigation_left">
                <img src={logo} alt="logo" class="img" />
                <div>
                    <div class="top">
                        <div class="links">
                            <Link to="/">Home</Link>
                        </div>
                        <div class="links">
                            <Link to="/articles">Artykuły</Link>
                        </div>
                        <div class="links">
                            <Link to="/gallery">Galeria</Link>
                        </div>
                        {#if login != ""}
                            {#if login == "admin"}
                                <div class="links">
                                    <a href="/userssettings"
                                        >Zarządzanie użytkownikami</a
                                    >
                                </div>
                            {:else}
                                <div class="links">
                                    <a
                                        href="/user?login={login}&password={password}"
                                        >Ustawienia użytkownika</a
                                    >
                                </div>
                            {/if}
                        {/if}
                    </div>
                    <div class="bottom">
                        {#if login != ""}
                            <div class="links">
                                <Link to="/theme">Wybierz gotowy motyw</Link>
                            </div>
                            <div class="links">
                                <Link to="/newTheme">Stwórz nowy motyw</Link>
                            </div>
                            <div class="links">
                                <Link to="/menuSettings"
                                    >Zarządzanie menu górnym</Link
                                >
                            </div>
                            <div class="links">
                                <Link to="/sliderSettings"
                                    >Zarządzanie sliderem</Link
                                >
                            </div>
                            <div class="links">
                                <Link to="/footerSettings"
                                    >Zarządzanie stopką</Link
                                >
                            </div>
                            <div class="links">
                                <Link to="/importExport"
                                    >import/export ustawień</Link
                                >
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
            <div>
                {#if login != ""}
                    Konto: {login}
                    Poziom: {poziom}
                    <button
                        class="blue"
                        on:click={() => {
                            login = "";
                            poziom = "";
                        }}>Wyloguj</button
                    >
                {:else}
                    <button class="green">
                        <a href="/logowanie">Logowanie</a>
                    </button>
                    <button class="blue">
                        <a href="/register">Rejestracja</a>
                    </button>
                {/if}
            </div>
        </nav>
    </div>
{/if}

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
    .top,
    .bottom {
        display: flex;
    }
    .navigation21 {
        width: 70%;
        margin: 0 auto;
        padding: 10px 20px;
        justify-content: space-between;
        background-color: white;
        color: black;
        font-family: Arial;
        font-size: 25px;
        position: relative;
    }
    .hamburger {
        position: absolute;
        left: 200px;
        top: 10px;
    }
    .h {
        width: 50px;
        height: 10px;
        background-color: black;
        border-radius: 7px;
        margin-bottom: 6px;
    }
    .navigation24 {
        width: 70%;
        margin: 0 auto;
        padding: 10px 20px;
        justify-content: space-between;
        background-color: var(--bgColor);
        color: var(--color);
        font-family: var(--fontFamily);
        font-size: var(--fontSize);
    }
    .navigation1 {
        width: 70%;
        margin: 0 auto;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        background-color: white;
        color: black;
        font-family: Arial;
        font-size: 16px;
    }
    .navigation4 {
        width: 70%;
        margin: 0 auto;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        background-color: var(--bgColor);
        color: var(--color);
        font-family: var(--fontFamily);
        font-size: var(--fontSize);
    }

    .navigation_left {
        display: flex;
    }
    .img {
        width: 80px;
        height: 80px;
    }
    .links {
        font-size: 16px;
        margin: 10px;
    }
    .green {
        color: green;
        border: 1px solid green;
        border-radius: 5px;
    }
    .blue {
        color: blue;
        border: 1px solid blue;
        border-radius: 5px;
    }
</style>
