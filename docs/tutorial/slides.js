(async () => {
  const stage = document.getElementById('slide-stage');
  const canvas = document.getElementById('slide-canvas');
  const status = document.getElementById('slide-status');
  const counter = document.getElementById('slide-counter');
  const previous = document.getElementById('slide-previous');
  const next = document.getElementById('slide-next');
  const openPDF = document.getElementById('slides-open');
  let pdf;
  let pageNumber = 1;
  let rendering = false;
  let renderPending = false;
  let failed = false;

  function showError(error) {
    failed = true;
    canvas.hidden = true;
    status.hidden = false;
    status.textContent = 'The preview could not load. Use “Open PDF in new tab” to view the slides.';
    stage.setAttribute('aria-busy', 'false');
    previous.disabled = true;
    next.disabled = true;
    console.error('Slide preview:', error);
  }

  async function renderSlide() {
    if (!pdf || failed) return;
    // Serialize canvas renders and keep the latest page requested by rapid clicks.
    if (rendering) {
      renderPending = true;
      return;
    }
    rendering = true;
    stage.setAttribute('aria-busy', 'true');
    const requestedPage = pageNumber;
    try {
      const page = await pdf.getPage(requestedPage);
      const original = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: stage.clientWidth / original.width });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      // Render offscreen so the last slide stays visible until the next is ready.
      const buffer = document.createElement('canvas');
      buffer.width = Math.ceil(viewport.width * pixelRatio);
      buffer.height = Math.ceil(viewport.height * pixelRatio);
      await page.render({
        canvasContext: buffer.getContext('2d'),
        viewport,
        transform: [pixelRatio, 0, 0, pixelRatio, 0, 0],
      }).promise;
      if (requestedPage === pageNumber) {
        canvas.width = buffer.width;
        canvas.height = buffer.height;
        canvas.getContext('2d').drawImage(buffer, 0, 0);
        stage.style.aspectRatio = `${original.width} / ${original.height}`;
        canvas.hidden = false;
        canvas.setAttribute('aria-label', `Tutorial slide ${requestedPage} of ${pdf.numPages}`);
        status.hidden = true;
        counter.textContent = `Slide ${requestedPage} of ${pdf.numPages}`;
        openPDF.href = `slides.pdf#page=${requestedPage}`;
      }
    } catch (error) {
      showError(error);
    } finally {
      rendering = false;
      if (renderPending && !failed) {
        renderPending = false;
        renderSlide();
      } else {
        stage.setAttribute('aria-busy', 'false');
      }
    }
  }

  function goToSlide(number) {
    if (!pdf || failed) return;
    const clamped = Math.max(1, Math.min(number, pdf.numPages));
    if (clamped === pageNumber) return;
    pageNumber = clamped;
    previous.disabled = pageNumber === 1;
    next.disabled = pageNumber === pdf.numPages;
    renderSlide();
  }

  previous.addEventListener('click', () => goToSlide(pageNumber - 1));
  next.addEventListener('click', () => goToSlide(pageNumber + 1));
  // Keep shortcuts within the viewer so arrow keys still scroll the rest of the page.
  stage.parentElement.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      goToSlide(pageNumber + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  try {
    // Pin the library and its worker to the same release.
    const pdfjsBase = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/';
    const pdfjs = await import(`${pdfjsBase}build/pdf.mjs`);
    pdfjs.GlobalWorkerOptions.workerSrc = `${pdfjsBase}build/pdf.worker.mjs`;
    pdf = await pdfjs.getDocument({
      url: openPDF.href,
      cMapUrl: `${pdfjsBase}cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `${pdfjsBase}standard_fonts/`,
      wasmUrl: `${pdfjsBase}wasm/`,
    }).promise;
    await renderSlide();
    previous.disabled = failed || pageNumber === 1;
    next.disabled = failed || pageNumber === pdf.numPages;

    let previousWidth = stage.clientWidth;
    let resizeTimer;
    new ResizeObserver(() => {
      if (stage.clientWidth === previousWidth) return;
      previousWidth = stage.clientWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderSlide, 150);
    }).observe(stage);
  } catch (error) {
    showError(error);
  }
})();
