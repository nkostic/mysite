<svelte:head>
  <title>A new chapter at Questrade | Nenad Kostic</title>
  <meta
    name="description"
    content="Nenad Kostic joins Questrade as a Principal Engineer."
  />
</svelte:head>

<header class="site-header">
  <a class="mark" href="/" aria-label="NK, Nenad Kostic home">NK</a>
  <p>Principal engineer · Calgary</p>
  <a class="back-link" href="/#journal"><span aria-hidden="true">←</span> Journal</a>
</header>

<main id="main-content" tabindex="-1">
  <article>
    <header class="article-header">
      <p class="eyebrow">Career / Field note</p>
      <h1>A new chapter<br />at Questrade</h1>
      <div class="article-meta">
        <time datetime="2026-07-08">July 8, 2026</time>
        <span>3 min read</span>
      </div>
    </header>

    <div class="article-body">
      <p class="lead">I've joined Questrade as a Principal Engineer.</p>

      <p>The role brings together the parts of engineering I care about most. I get to solve hard technical problems and help a strong team ship reliable software.</p>

      <p>I'm joining a group of engineers with plenty to teach me. I will bring my own experience, ask a lot of questions, and help turn complicated ideas into software that works for Questrade's customers.</p>

      <p>A new role always comes with gaps in my knowledge. That is part of the appeal. I'm ready to learn the systems, understand the business, and get to work.</p>

      <footer class="article-footer">
        <p>Nenad</p>
        <a href="/#journal">Return to the journal <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  </article>
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(html) { background: #f5f4ef; }
  :global(body) {
    margin: 0;
    background: #f5f4ef;
    color: #0b0b0b;
    font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  :global(a) { color: inherit; }
  :global(::selection) { background: #0b0b0b; color: #fff; }

  .site-header {
    min-height: 84px;
    padding: 0 48px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    border-bottom: 2px solid #0b0b0b;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .12em;
  }
  .site-header p { margin: 0; }
  .mark {
    width: 42px;
    height: 42px;
    border: 2px solid;
    border-radius: 50%;
    display: grid;
    place-items: center;
    text-decoration: none;
    letter-spacing: -.05em;
  }
  .back-link { justify-self: end; text-decoration: none; }
  .back-link span { margin-right: 8px; }

  main { padding: 16px 48px 48px; }
  article { display: grid; grid-template-columns: 1.18fr .82fr; gap: 16px; min-height: calc(100vh - 148px); }
  .article-header { padding: 42px 28px 38px 0; display: flex; flex-direction: column; }
  .eyebrow { margin: 0; text-transform: uppercase; font-size: 11px; line-height: 1.2; font-weight: 750; letter-spacing: .16em; }
  h1 { margin: auto 0; font-size: clamp(62px, 8vw, 132px); line-height: .82; letter-spacing: -.08em; text-transform: uppercase; }
  .article-meta { display: flex; gap: 24px; text-transform: uppercase; font-size: 10px; font-weight: 700; letter-spacing: .12em; }

  .article-body { background: #0b0b0b; color: #fff; padding: clamp(36px, 5vw, 76px); display: flex; flex-direction: column; justify-content: center; }
  .article-body p { max-width: 620px; margin: 0 0 1.5em; color: #c6c6c1; font-size: clamp(16px, 1.3vw, 20px); line-height: 1.6; letter-spacing: -.015em; }
  .article-body .lead { color: #fff; font-size: clamp(28px, 2.8vw, 46px); line-height: 1.08; letter-spacing: -.045em; }
  .article-footer { margin-top: 36px; padding-top: 24px; border-top: 1px solid #3b3b39; display: flex; justify-content: space-between; align-items: center; gap: 24px; }
  .article-footer p, .article-footer a { margin: 0; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
  .article-footer a { text-decoration: none; }

  @media (max-width: 900px) {
    .site-header { padding: 0 22px; grid-template-columns: auto 1fr; }
    .site-header p { display: none; }
    main { padding: 12px 22px 30px; }
    article { grid-template-columns: 1fr; }
    .article-header { min-height: 460px; }
    .article-body { padding: 36px 26px; }
  }
</style>
