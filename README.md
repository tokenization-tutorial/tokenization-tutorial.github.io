# Tokenization in Large Language Models

The EMNLP tutorial website is published by GitHub Pages from `main`, using the
`docs/` folder.

- [Site homepage](https://tokenization-tutorial.github.io/)
- [Tutorial page](https://tokenization-tutorial.github.io/tutorial/)
- [Interactive playground](https://tokenization-tutorial.github.io/playground/)
- [Compare examples](https://tokenization-tutorial.github.io/playground/#compare)
- [BPE and Unigram notebook](https://tokenization-tutorial.github.io/bpe-unigram/)

## Editing the site

The site homepage is `docs/index.html`, the tutorial page is
`docs/tutorial/index.html`, and shared styles are in `docs/style.css`. The playground
is at
`docs/playground/index.html`, with its example data, scripts, and styles embedded.
The architecture view loads the original
[animation HTML](docs/playground/figures/hierarchical_model_clickthrough.html)
directly, preserving its diagram, timing, and controls. Both files work locally
and need no build step. Only adding a Hugging Face tokenizer requires a network
connection; user text stays in the browser. The embedded tokenizer runtime's license
is also included under `docs/playground/licenses/`.

The editable demo is maintained in the separate `tokenization-tutorial` checkout.
From that checkout, run:

```sh
python3 scripts/sync_website.py ../tokenization-tutorial.github.io
python3 scripts/sync_website.py ../tokenization-tutorial.github.io --check
```

Review the changes in this repository, commit the updated playground, animation,
and license, and push to `main`. GitHub Pages publishes the update automatically. To preview
the entire site locally, run `python3 -m http.server --directory docs` and open
`http://localhost:8000/tutorial/`.

## Tutorial slides

The slide viewer below the abstract reads `docs/tutorial/slides.pdf`. To update the
deck, replace that PDF and keep its filename. Previous/Next buttons and arrow keys
move through the slides, and “Open PDF in new tab” opens the current slide in the
browser's PDF viewer. The preview loads PDF.js from jsDelivr at a pinned version;
the PDF link also works if the preview is unavailable. Commit the PDF along with
the page and `docs/tutorial/slides.js` when publishing the viewer.

## BPE and Unigram notebook

`docs/bpe-unigram/bpe_unigram_tutorial.ipynb` implements BPE and Unigram training in plain
Python. The page `docs/bpe-unigram/index.html` reads this notebook when it loads and runs
its code in the visitor's browser with [Pyodide](https://pyodide.org), so there is no build
step: to change the content, edit the notebook (in Jupyter or Colab) and commit it. Outputs
saved in the notebook are shown on the page until a cell is run. The page needs an internet
connection for Pyodide and its other libraries, which are loaded from jsDelivr at pinned
versions. The same notebook opens in Colab from the link on the page.
