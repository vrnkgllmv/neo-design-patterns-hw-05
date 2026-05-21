import { ReportAdapter } from './ReportAdapter';
import { JsonReportAdapter } from './JsonReportAdapter';
import { CsvReportAdapter } from './CsvReportAdapter';
import { XmlReportAdapter } from './XmlReportAdapter';
import { AnalyzerFacade } from './AnalyzerFacade';
import * as fs from 'fs';
import * as path from 'path';

export class ReportManager {
    private format: string;

    constructor(format: string) {
        this.format = format.toLowerCase();
    }

    generateReport(targetPath: string): void {
        try {
            let adapter: ReportAdapter;
            switch (this.format) {
                case 'json':
                    adapter = new JsonReportAdapter();
                    break;
                case 'csv':
                    adapter = new CsvReportAdapter();
                    break;
                case 'xml':
                    adapter = new XmlReportAdapter();
                    break;
                default:
                    throw new Error(`Unsupported format: ${this.format}`);
            }

            const facade = new AnalyzerFacade(adapter);
            const reportContent = facade.generateReport(targetPath);

            const reportsDir = path.join(process.cwd(), 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const timestamp = new Date().toISOString()
                .replace(/:/g, '-')
                .replace(/\./g, '-');
            const fileName = `report-${timestamp}.${this.format}`;
            const filePath = path.join(reportsDir, fileName);

            fs.writeFileSync(filePath, reportContent, 'utf8');

            const displayPath = path.join('reports', fileName);
            console.log(`Report generated successfully: ${displayPath}`);
        } catch (error: any) {
            console.error(`Error generating report: ${error.message}`);
        }
    }
}
