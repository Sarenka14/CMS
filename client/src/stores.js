import { writable } from 'svelte/store';

export const themeId = writable(1);
export const articleId = writable(0);
export const article = writable("");
export const title = writable("");
export const comments = writable([]);
export const category = writable("");
export const newTheme = writable({
    block: 0,
    fontSize: 0,
    fontFamily: "",
    fontColor: "",
    mainColor: ""
})

export const id = writable("1");

export let addId = writable("5");

export const articles = writable({
    articles: [
        {
            id: "1",
            category: "kategoria3",
            title: "News 1",
            text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit et, commodi tempore similique accusamus, eius doloribus voluptates ex consectetur vel distinctio rem cum id suscipit quae illum atque molestias in?",
            comments: []
        },
        {
            id: "2",
            category: "kategoria4",
            title: "News 2",
            text: "No jest wszystko w porządku, jest dobrze, dobrze robią, dobrze wszystko jest w porządku. Jest git, pozdrawiam całą Legnicę, dobrych chłopaków i niech się to trzyma. Dobry przekaz leci.",
            comments: []
        },
        {
            id: "3",
            category: "kategoria1",
            title: "News 3",
            text: "No jest wszystko w porządku, jest dobrze, dobrze robią, dobrze wszystko jest w porządku. Jest git, pozdrawiam całą Legnicę, dobrych chłopaków i niech się to trzyma. Dobry przekaz leci.",
            comments: []
        },
        {
            id: "4",
            category: "kategoria2",
            title: "News 4",
            text: "No jest wszystko w porządku, jest dobrze, dobrze robią, dobrze wszystko jest w porządku. Jest git, pozdrawiam całą Legnicę, dobrych chłopaków i niech się to trzyma. Dobry przekaz leci.",
            comments: []
        }
    ]
})

export const bigArticle = writable({
    title: "Big News",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit et, commodi tempore similique accusamus, eius doloribus voluptates ex consectetur vel distinctio rem cum id suscipit quae illum atque molestias in?"
})

export const topMenu = writable(1)
export const topMenuSettings = writable({
    fontSize: 0,
    fontFamily: "",
    fontColor: "",
    mainColor: ""
})
export const topMenuOption = writable(true)

export const sliderImages = writable(["sentino.png", "sentino2.jpg", "sentino3.jpg"])
export const sliderTime = writable(2000)
export const sliderDescription = writable("")

export const images = writable(["sentino.png", "sentino2.jpg", "sentino3.jpg", "malik.jpg"])

export const Footer = writable(1)
export const FooterSettings = writable({
    fontSize: 0,
    fontFamily: "",
    fontColor: "",
    mainColor: ""
})
