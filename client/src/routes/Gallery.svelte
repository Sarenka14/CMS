<script>
    import Navigation from "../components/Navigation.svelte";
    import { images } from "../stores.js";
    let width = 200;
    let height = 200;
    let flex = "flex";
    let flexWrap = "wrap";

    const change = () => {
        const blockValue = document.querySelector(
            'input[name="block"]:checked'
        ).value;
        if (blockValue == 1) {
            width = 200;
            height = 200;
            flex = "flex";
            flexWrap = "wrap";
        } else if (blockValue == 2) {
            flex = "flex";
            width = 450;
            height = 450;
            flexWrap = "wrap";
        } else if (blockValue == 3) {
            flex = "";
            width = 600;
            height = 600;
            flexWrap = "nowrap";
        }
    };
</script>

<Navigation />
<main>
    <h1>Galeria</h1>
    <div class="blocks">
        <div class="block">
            <div class="block1">
                <div class="block11" />
                <div class="block11" />
                <div class="block11" />
                <div class="block11" />
            </div>
            <input
                type="radio"
                name="block"
                value="1"
                on:change={() => change()}
                checked
            />
        </div>
        <div class="block">
            <div class="block2">
                <div class="block22" />
                <div class="block22" />
                <div class="block22" />
                <div class="block22" />
            </div>
            <input
                type="radio"
                name="block"
                value="2"
                on:change={() => change()}
            />
        </div>
        <div class="block">
            <div class="block3">
                <div class="block33" />
                <div class="block33" />
                <div class="block33" />
                <div class="block33" />
            </div>
            <input
                type="radio"
                name="block"
                value="3"
                on:change={() => change()}
            />
        </div>
    </div>
    <div class="gallery" style="--display:{flex}; --flexWrap:{flexWrap};">
        {#each $images as image}
            <div>
                <img
                    src={image}
                    alt="ok"
                    class="photo"
                    style="--width:{width}px; --height:{height}px"
                />
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        width: 70%;
        margin: 50px auto;
        text-align: center;
    }
    .gallery {
        display: var(--display);
        flex-wrap: var(--flexWrap);
        justify-content: space-between;
    }
    .blocks {
        display: flex;
        justify-content: space-between;
        margin: 70px;
        padding: 20px;
    }
    .block1 {
        width: 100px;
        height: 60px;
        display: flex;
        justify-content: center;
        border: 1px solid black;
        padding: 10px;
        align-items: center;
    }
    .block2 {
        width: 100px;
        height: 60px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        border: 1px solid black;
        padding: 10px;
        align-items: center;
    }
    .block3 {
        width: 100px;
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
    .photo {
        width: var(--width);
        height: var(--height);
        margin: 50px;
    }
</style>
