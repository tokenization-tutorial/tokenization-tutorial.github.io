# Tokenization in Large Language Models

The EMNLP tutorial website is published by GitHub Pages from `main`, using the
`docs/` folder.

- [Tutorial homepage](https://tokenization-tutorial.github.io/tutorial/)
- [Interactive playground](https://tokenization-tutorial.github.io/tutorial/playground/)
- [Compare examples](https://tokenization-tutorial.github.io/tutorial/playground/#compare)

## Editing the site

The tutorial homepage is `docs/tutorial/index.html`; shared styles are in
`docs/style.css`. The playground is a standalone HTML file at
`docs/tutorial/playground/index.html`. Its example data, scripts, styles, and
architecture animation are embedded, so it needs no build step. Only adding a
Hugging Face tokenizer requires a network connection; user text stays in the
browser. The embedded tokenizer runtime's license is also included under
`docs/tutorial/playground/licenses/`.

The editable demo is maintained in the separate `tokenization-tutorial` checkout.
From that checkout, run:

```sh
python3 scripts/sync_website.py ../tokenization-tutorial.github.io
python3 scripts/sync_website.py ../tokenization-tutorial.github.io --check
```

Review the changes in this repository, commit the updated playground and license,
and push to `main`. GitHub Pages publishes the update automatically. To preview
the entire site locally, run `python3 -m http.server --directory docs` and open
`http://localhost:8000/tutorial/`.
