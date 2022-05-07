<script>
    import { Link } from "svelte-navigator";
    import { Footer, FooterSettings } from "../stores.js";
    let logo = "sentino.png";
    const footerClass = `footer${$Footer}`;
    const fontSize = $FooterSettings.fontSize;
    const fontFamily = $FooterSettings.fontFamily;
    const fontColor = $FooterSettings.fontColor;
    const mainColor = $FooterSettings.mainColor;
</script>

<footer
    class={footerClass}
    style="--bgColor:{mainColor}; --color:{fontColor}; --fontFamily:{fontFamily}; --fontSize:{fontSize}px;"
>
    <img src={logo} alt="logo" class="img" />
    <div class="links">
        <Link to="/">Home</Link>
    </div>
    <div class="links">
        <Link to="/second">Artykuły</Link>
    </div>
    <div class="links">
        <Link to="/gallery">Galeria</Link>
    </div>
    <div>Autorzy: Maciej Dzierwa, Piotr Sarna</div>
</footer>

<style>
    .img {
        width: 50px;
        height: 50px;
    }
    .footer1 {
        width: 70%;
        margin: 0 auto;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        background-color: white;
        color: black;
        font-family: Arial;
        font-size: 16px;
        border-top: 1px solid black;
    }
    .footer4 {
        width: 70%;
        margin: 0 auto;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        background-color: var(--bgColor);
        color: var(--color);
        font-family: var(--fontFamily);
        font-size: var(--fontSize);
        border-top: 1px solid black;
    }
</style>
