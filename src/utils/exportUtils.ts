import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { CalendarView } from '../types/calendar';

const EXPORT_SCALE = 3;

interface CaptureOptions {
  view: CalendarView;
  backgroundColor?: string;
}

function getExportWidth(view: CalendarView, orientation: 'portrait' | 'landscape'): number {
  if (view === 'yearly') {
    return orientation === 'landscape' ? 1123 : 794;
  }
  return orientation === 'landscape' ? 1123 : 794;
}

async function captureElement(element: HTMLElement, options: CaptureOptions): Promise<HTMLCanvasElement> {
  const parent = element.closest('.preview-scale-wrapper') as HTMLElement | null;
  const savedTransform = parent?.style.transform ?? '';
  const savedWidth = element.style.width;

  if (parent) parent.style.transform = 'none';

  const orientation = element.closest('[data-orientation]')?.getAttribute('data-orientation') as 'portrait' | 'landscape' | null;
  const exportWidth = getExportWidth(options.view, orientation ?? 'landscape');
  element.style.width = `${exportWidth}px`;

  element.classList.add('calendar-export-mode');

  try {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    return await html2canvas(element, {
      scale: EXPORT_SCALE,
      useCORS: true,
      backgroundColor: options.backgroundColor ?? '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (doc) => {
        const cloned = doc.getElementById('calendar-print-area');
        if (cloned) {
          cloned.classList.add('calendar-export-mode');
          (cloned as HTMLElement).style.transform = 'none';
          (cloned as HTMLElement).style.boxShadow = 'none';
        }
        const wrapper = doc.querySelector('.preview-scale-wrapper') as HTMLElement | null;
        if (wrapper) wrapper.style.transform = 'none';
      },
    });
  } finally {
    element.classList.remove('calendar-export-mode');
    element.style.width = savedWidth;
    if (parent) parent.style.transform = savedTransform;
  }
}

function addCanvasToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  margin = 6,
): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (imgHeight <= contentHeight) {
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, imgHeight);
    return;
  }

  const sliceHeightPx = (contentHeight / imgHeight) * canvas.height;
  let offsetY = 0;
  let page = 0;

  while (offsetY < canvas.height) {
    if (page > 0) pdf.addPage();

    const remaining = canvas.height - offsetY;
    const currentSlicePx = Math.min(sliceHeightPx, remaining);
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = currentSlicePx;

    const ctx = sliceCanvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    ctx.drawImage(canvas, 0, offsetY, canvas.width, currentSlicePx, 0, 0, canvas.width, currentSlicePx);

    const sliceMm = (currentSlicePx * imgWidth) / canvas.width;
    pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, sliceMm);

    offsetY += currentSlicePx;
    page++;
  }
}

export async function exportToPng(
  element: HTMLElement,
  filename: string,
  view: CalendarView = 'monthly',
): Promise<void> {
  const canvas = await captureElement(element, {
    view,
    backgroundColor: element.style.backgroundColor || '#ffffff',
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export async function exportToPdf(
  element: HTMLElement,
  filename: string,
  orientation: 'portrait' | 'landscape',
  view: CalendarView = 'monthly',
): Promise<void> {
  const pdfOrientation = view === 'yearly' ? 'landscape' : orientation;

  const canvas = await captureElement(element, {
    view,
    backgroundColor: '#ffffff',
  });

  const pdf = new jsPDF({
    orientation: pdfOrientation,
    unit: 'mm',
    format: 'a4',
  });

  addCanvasToPdf(pdf, canvas);
  pdf.save(filename);
}

export function printCalendar(
  view: CalendarView = 'monthly',
  orientation: 'portrait' | 'landscape' = 'landscape',
): void {
  document.documentElement.setAttribute('data-print-view', view);
  document.documentElement.setAttribute('data-print-orientation', orientation);
  window.print();
  window.addEventListener(
    'afterprint',
    () => {
      document.documentElement.removeAttribute('data-print-view');
      document.documentElement.removeAttribute('data-print-orientation');
    },
    { once: true },
  );
}

export async function copyDesignToClipboard(state: object): Promise<void> {
  await navigator.clipboard.writeText(JSON.stringify(state, null, 2));
}
