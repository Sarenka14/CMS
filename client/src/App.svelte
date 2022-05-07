<script>
  import { Router, Route, Link } from "svelte-navigator";
  import Home from "./routes/Home.svelte";
  import Theme from "./routes/Theme.svelte";
  import Newtheme from "./routes/Newtheme.svelte";
  import Menusettings from "./routes/Menusettings.svelte";
  import Second from "./routes/Second.svelte";
  import Articles from "./routes/Articles.svelte";
  import Slidersettings from "./routes/Slidersettings.svelte";
  import Gallery from "./routes/Gallery.svelte";
  import Footersettings from "./routes/Footersettins.svelte";
  import EditArticles from "./routes/EditArticles.svelte";
  import AddArticles from "./routes/AddArticles.svelte";
  import ImportExport from "./routes/ImportExport.svelte";
</script>

<div>
  <Router>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/second">
      <Second />
    </Route>
    <Route path="/articles">
      <Articles />
    </Route>
    <Route path="/newTheme">
      <Newtheme />
    </Route>
    <Route path="/theme">
      <Theme />
    </Route>
    <Route path="/menuSettings">
      <Menusettings />
    </Route>
    <Route path="/sliderSettings">
      <Slidersettings />
    </Route>
    <Route path="/gallery">
      <Gallery />
    </Route>
    <Route path="/footerSettings">
      <Footersettings />
    </Route>
    <Route path="/editArticles/:id">
      <EditArticles />
    </Route>
    <Route path="/addArticles">
      <AddArticles />
    </Route>
    <Route path="/importExport">
      <ImportExport />
    </Route>
  </Router>
</div>
