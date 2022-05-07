<script>
    import { sliderImages, sliderTime, sliderDescription } from "../stores.js";

    let imgs = $sliderImages;
    let time = $sliderTime;
    let slideIndex = 0;

    showSlides();

    function showSlides() {
        let slides = document.getElementsByClassName("mySlides");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        setTimeout(() => {
            slides[slideIndex - 1].style.display = "block";
            setTimeout(showSlides, time);
        }, 0);
    }
</script>

<div class="slideshow-container">
    {#each imgs as img, i}
        <div class="mySlides fade">
            <div class="numbertext">{i + 1}</div>
            <img src={img} style="width:1200px; height: 500px;" alt="img" />
            <div class="text">{$sliderDescription}</div>
        </div>
    {/each}
</div>

<style>
    * {
        box-sizing: border-box;
    }
    .slideshow-container {
        width: 1200px;
        height: 500px;
        position: relative;
        margin: auto;
        margin-top: 50px;
    }

    .mySlides {
        display: none;
    }

    .text {
        color: #f2f2f2;
        font-size: 15px;
        padding: 8px 12px;
        position: absolute;
        bottom: 8px;
        width: 100%;
        text-align: center;
    }

    .numbertext {
        color: #f2f2f2;
        font-size: 12px;
        padding: 8px 12px;
        position: absolute;
        top: 0;
    }

    .fade {
        animation-name: fade;
        animation-duration: 1.5s;
    }
</style>
