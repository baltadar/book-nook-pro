import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function renderPdfPage(
  url: string,
  pageNum: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.5
): Promise<number> {
  const pdf = await pdfjsLib.getDocument(url).promise;
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport }).promise;

  return pdf.numPages;
}

export async function renderCoverThumbnail(
  url: string,
  canvas: HTMLCanvasElement,
  maxWidth: number = 300
): Promise<void> {
  const pdf = await pdfjsLib.getDocument(url).promise;
  const page = await pdf.getPage(1);
  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = maxWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport }).promise;
}

export async function getPdfPageCount(url: string): Promise<number> {
  const pdf = await pdfjsLib.getDocument(url).promise;
  return pdf.numPages;
}
