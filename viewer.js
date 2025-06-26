const container = document.getElementById("pdf-container");
const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = urlParams.get("file") || "my-book.pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
  const totalPages = pdf.numPages;
  let pageNum = 1;

  function renderPagePair() {
    const pages = [pageNum];
    if (pageNum > 1 && pageNum + 1 <= totalPages) {
      pages.push(pageNum + 1);
    }

    pages.forEach(n => {
      pdf.getPage(n).then(page => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        container.appendChild(canvas);

        page.render({ canvasContext: context, viewport });
      });
    });

    pageNum += 2;
    if (pageNum <= totalPages) {
      setTimeout(renderPagePair, 500); // Delay for visualization
    }
  }

  renderPagePair();
});
