// Export utilities — CSV and PDF generation for analytics

import { addExportHistoryEntry } from './analyticsApi';

/* ------------------------------------------------------------------ */
/*  CSV Export                                                         */
/* ------------------------------------------------------------------ */

export function exportToCsv(
  data: Record<string, unknown>[],
  filename: string,
  section: string
) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h];
        const str = val === null || val === undefined ? '' : String(val);
        // Escape commas and quotes
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);

  addExportHistoryEntry({ type: 'csv', section, recordCount: data.length });
}

/* ------------------------------------------------------------------ */
/*  PDF Export                                                         */
/* ------------------------------------------------------------------ */

export async function exportToPdf(
  elementId: string,
  filename: string,
  section: string
) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export:', elementId);
    return;
  }

  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add header
    pdf.setFontSize(18);
    pdf.setTextColor(37, 99, 235); // brand blue
    pdf.text('Boltcall Analytics Report', 14, 20);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 28);
    pdf.text(`Section: ${section}`, 14, 34);

    // Add line separator
    pdf.setDrawColor(229, 231, 235);
    pdf.line(14, 38, 196, 38);

    // Add chart image
    let yOffset = 42;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
    heightLeft -= (pageHeight - yOffset);

    // Handle multi-page
    while (heightLeft > 0) {
      pdf.addPage();
      yOffset = -(pageHeight - yOffset) + yOffset;
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);

    addExportHistoryEntry({ type: 'pdf', section, recordCount: 1 });
  } catch (err) {
    console.error('PDF export failed:', err);
  }
}

/* ------------------------------------------------------------------ */
/*  Download helper                                                    */
/* ------------------------------------------------------------------ */

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
