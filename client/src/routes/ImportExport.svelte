<script>
    import Navigation from "../components/Navigation.svelte";
    import {
        themeId,
        newTheme,
        topMenu,
        topMenuSettings,
        topMenuOption,
        sliderTime,
        sliderDescription,
        Footer,
        FooterSettings,
    } from "../stores.js";

    let fileinput;
    const onFileSelected = (e) => {
        let file = e.target.files[0];
        fileinput = file;
    };
    const importFile = async () => {
        let response = await fetch(fileinput.name);
        let data = await response.json();
        const obj = JSON.parse(JSON.stringify(data));
        themeId.set(obj.themeId);
        newTheme.set({
            block: obj.newTheme.block,
            fontSize: obj.newTheme.fontSize,
            fontFamily: obj.newTheme.fontFamily,
            fontColor: obj.newTheme.fontColor,
            mainColor: obj.newTheme.mainColor,
        });
        topMenu.set(obj.topMenu);
        topMenuSettings.set({
            fontSize: obj.topMenuSettings.fontSize,
            fontFamily: obj.topMenuSettings.fontFamily,
            fontColor: obj.topMenuSettings.fontColor,
            mainColor: obj.topMenuSettings.mainColor,
        });
        topMenuOption.set(obj.topMenuOption);
        sliderTime.set(obj.sliderTime);
        sliderDescription.set(obj.sliderDescription);
        Footer.set(obj.Footer);
        FooterSettings.set({
            fontSize: obj.FooterSettings.fontSize,
            fontFamily: obj.FooterSettings.fontFamily,
            fontFamily: obj.FooterSettings.fontFamily,
            mainColor: obj.FooterSettings.mainColor,
        });
    };

    const exportFile = () => {
        const jsonData = {
            themeId: $themeId,
            newTheme: $newTheme,
            topMenu: $topMenu,
            topMenuSettings: $topMenuSettings,
            topMenuOption: $topMenuOption,
            sliderTime: $sliderTime,
            sliderDescription: $sliderDescription,
            Footer: $Footer,
            FooterSettings: $FooterSettings,
        };
        let dataStr = JSON.stringify(jsonData);
        let dataUri =
            "data:application/json;charset=utf-8," +
            encodeURIComponent(dataStr);

        let exportFileDefaultName = "data.json";
        let linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
    };
</script>

<Navigation />
<main>
    <h1>Import/Export ustawień</h1>
    <div>
        Dodaj zdjęcie<input
            type="file"
            accept=".json"
            on:change={(e) => onFileSelected(e)}
            bind:this={fileinput}
        />
    </div>
    <button on:click={() => importFile()}>Importuj</button>
    <button on:click={() => exportFile()}>Eksportuj</button>
</main>

<style>
    main {
        width: 30%;
        margin: 50px auto;
        text-align: center;
    }
</style>
