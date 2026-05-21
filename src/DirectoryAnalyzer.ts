import * as fs from 'fs';
import * as path from 'path';
import { DirectoryReport } from './DirectoryReport';

export class DirectoryAnalyzer {
    analyze(dirPath: string): DirectoryReport {
        const report: DirectoryReport = {
            files: 0,
            directories: 0,
            totalSize: 0,
            extensions: {}
        };

        const scan = (currentPath: string) => {
            try {
                const entries = fs.readdirSync(currentPath, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(currentPath, entry.name);
                    try {
                        if (entry.isDirectory()) {
                            report.directories++;
                            scan(fullPath);
                        } else if (entry.isFile()) {
                            const stats = fs.statSync(fullPath);
                            report.files++;
                            report.totalSize += stats.size;
                            const ext = path.extname(entry.name);
                            report.extensions[ext] = (report.extensions[ext] || 0) + 1;
                        }
                    } catch (err) {
                        // Ignore individual entry errors
                    }
                }
            } catch (err) {
                // Ignore directory read errors
            }
        };

        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            scan(dirPath);
        } else {
            throw new Error(`Path "${dirPath}" does not exist or is not a directory.`);
        }

        return report;
    }
}
