import { ReportAdapter } from './ReportAdapter';
import { DirectoryReport } from './DirectoryReport';

export class XmlReportAdapter implements ReportAdapter {
    export(report: DirectoryReport): string {
        const lines: string[] = [];
        lines.push('<?xml version="1.0" encoding="UTF-8"?>');
        lines.push('<report>');
        lines.push(`  <files>${report.files}</files>`);
        lines.push(`  <directories>${report.directories}</directories>`);
        lines.push(`  <totalSize>${report.totalSize}</totalSize>`);
        lines.push('  <extensions>');
        for (const [ext, count] of Object.entries(report.extensions)) {
            lines.push(`    <extension name="${ext}" count="${count}"/>`);
        }
        lines.push('  </extensions>');
        lines.push('</report>');
        return lines.join('\n');
    }
}
