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
/*  Full Report PDF Export                                             */
/* ------------------------------------------------------------------ */

export async function exportFullReportPdf(
  sectionIds: string[],
  filename: string
) {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;

    // Add cover page
    pdf.setFontSize(28);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Boltcall', 14, 40);
    pdf.setFontSize(22);
    pdf.setTextColor(30, 30, 30);
    pdf.text('Analytics Report', 14, 55);
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 14, 70);
    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(1);
    pdf.line(14, 75, 80, 75);

    let isFirstSection = true;

    for (const sectionId of sectionIds) {
      const element = document.getElementById(sectionId);
      if (!element) continue;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (!isFirstSection || true) {
        pdf.addPage();
      }
      isFirstSection = false;

      let yOffset = 10;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
      heightLeft -= (pageHeight - yOffset);

      while (heightLeft > 0) {
        pdf.addPage();
        yOffset = 10;
        pdf.addImage(imgData, 'PNG', 0, -(imgHeight - heightLeft - yOffset), imgWidth, imgHeight);
        heightLeft -= (pageHeight - yOffset);
      }
    }

    pdf.save(`${filename}.pdf`);

    addExportHistoryEntry({
      type: 'pdf',
      section: 'Full Report',
      recordCount: sectionIds.length,
    });
  } catch (err) {
    console.error('Full report PDF export failed:', err);
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
