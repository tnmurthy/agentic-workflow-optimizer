import React from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { calculateCost, calculateSavings, formatCurrency, formatNumber } from '../utils/calculations';

const ExportTools = ({ pricePerThousand }) => {
    const [isExporting, setIsExporting] = React.useState(false);

    const exportToPDF = async () => {
        setIsExporting(true);
        try {
            // Create a temporary container with all the content
            const exportContainer = document.createElement('div');
            exportContainer.style.width = '800px';
            exportContainer.style.padding = '40px';
            exportContainer.style.background = '#ffffff';
            exportContainer.style.color = '#000000';
            exportContainer.style.position = 'absolute';
            exportContainer.style.left = '-9999px';
            document.body.appendChild(exportContainer);

            // Build the content
            const monolithicCost = calculateCost(monolithicTokens, pricePerThousand);
            const agenticCost = calculateCost(agenticTotalTokens, pricePerThousand);
            const savings = calculateSavings(monolithicCost, agenticCost);

            // Build the report content using DOM methods to avoid innerHTML injection
            const wrapper = document.createElement('div');
            wrapper.style.fontFamily = 'Arial, sans-serif';

            const addEl = (tag, styles, text, parent) => {
                const el = document.createElement(tag);
                Object.assign(el.style, styles);
                if (text !== undefined) el.textContent = text;
                parent.appendChild(el);
                return el;
            };

            addEl('h1', { color: '#6366f1', marginBottom: '10px' }, 'Agentic Workflow Analysis Report', wrapper);
            addEl('p', { color: '#666', marginBottom: '30px' }, `Generated on ${new Date().toLocaleDateString()}`, wrapper);

            addEl('h2', { color: '#333', marginTop: '30px', marginBottom: '15px' }, 'Executive Summary', wrapper);
            addEl('p', { lineHeight: '1.6' }, 'This report demonstrates the cost savings achieved through agentic workflow architecture compared to traditional monolithic prompt approaches. By breaking down complex tasks into specialized agents, we achieve significant token reduction and cost optimization.', wrapper);

            const buildTable = (headers, rows, parent) => {
                const table = document.createElement('table');
                Object.assign(table.style, { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' });

                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                headerRow.style.background = '#f3f4f6';
                headers.forEach(({ label, align }) => {
                    const th = document.createElement('th');
                    Object.assign(th.style, { padding: '12px', textAlign: align || 'left', border: '1px solid #ddd' });
                    th.textContent = label;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                rows.forEach(({ cells, rowStyle }) => {
                    const tr = document.createElement('tr');
                    if (rowStyle) Object.assign(tr.style, rowStyle);
                    cells.forEach(({ text, align, cellStyle }) => {
                        const td = document.createElement('td');
                        Object.assign(td.style, { padding: '12px', textAlign: align || 'left', border: '1px solid #ddd', ...cellStyle });
                        td.textContent = text;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);
                parent.appendChild(table);
            };

            addEl('h2', { color: '#333', marginTop: '30px', marginBottom: '15px' }, 'Token Usage Comparison', wrapper);
            buildTable(
                [{ label: 'Approach' }, { label: 'Tokens', align: 'right' }, { label: 'Cost per Request', align: 'right' }],
                [
                    { cells: [{ text: 'Monolithic Prompt' }, { text: formatNumber(monolithicTokens), align: 'right' }, { text: formatCurrency(monolithicCost), align: 'right' }] },
                    { cells: [{ text: 'Agentic Pipeline' }, { text: formatNumber(agenticTotalTokens), align: 'right' }, { text: formatCurrency(agenticCost), align: 'right' }] },
                    { rowStyle: { background: '#10b98133', fontWeight: 'bold' }, cells: [{ text: 'Savings' }, { text: formatNumber(monolithicTokens - agenticTotalTokens), align: 'right' }, { text: `${formatCurrency(savings.amount)} (${savings.percentage.toFixed(1)}%)`, align: 'right' }] },
                ],
                wrapper
            );

            addEl('h2', { color: '#333', marginTop: '30px', marginBottom: '15px' }, 'Cost Projections', wrapper);
            buildTable(
                [{ label: 'Scale' }, { label: 'Monolithic', align: 'right' }, { label: 'Agentic', align: 'right' }, { label: 'Monthly Savings', align: 'right' }],
                [
                    { cells: [{ text: '1M tokens/month' }, { text: `$${(monolithicCost * 1000000 / agenticTotalTokens).toFixed(2)}`, align: 'right' }, { text: '$2.00', align: 'right' }, { text: `$${((monolithicCost * 1000000 / agenticTotalTokens) - 2).toFixed(2)}`, align: 'right', cellStyle: { color: '#10b981' } }] },
                    { cells: [{ text: '10M tokens/month' }, { text: `$${(monolithicCost * 10000000 / agenticTotalTokens).toFixed(2)}`, align: 'right' }, { text: '$20.00', align: 'right' }, { text: `$${((monolithicCost * 10000000 / agenticTotalTokens) - 20).toFixed(2)}`, align: 'right', cellStyle: { color: '#10b981' } }] },
                    { cells: [{ text: '100M tokens/month' }, { text: `$${(monolithicCost * 100000000 / agenticTotalTokens).toFixed(2)}`, align: 'right' }, { text: '$200.00', align: 'right' }, { text: `$${((monolithicCost * 100000000 / agenticTotalTokens) - 200).toFixed(2)}`, align: 'right', cellStyle: { color: '#10b981' } }] },
                ],
                wrapper
            );

            addEl('h2', { color: '#333', marginTop: '30px', marginBottom: '15px' }, 'Recommendations', wrapper);
            const ul = document.createElement('ul');
            ul.style.lineHeight = '1.8';
            [
                'Implement agentic architecture for complex, multi-step workflows',
                'Start with high-volume use cases to maximize ROI',
                'Monitor per-agent performance and optimize token allocation',
                'Consider different LLM providers based on specific agent requirements',
            ].forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                ul.appendChild(li);
            });
            wrapper.appendChild(ul);

            const footer = document.createElement('div');
            Object.assign(footer.style, { marginTop: '40px', padding: '20px', background: '#f9fafb', borderLeft: '4px solid #6366f1' });
            const footerP = document.createElement('p');
            Object.assign(footerP.style, { margin: '0', fontSize: '14px', color: '#666' });
            footerP.textContent = 'Generated by Agentic Workflow Token Optimizer. For more information, visit the application dashboard.';
            footer.appendChild(footerP);
            wrapper.appendChild(footer);

            exportContainer.appendChild(wrapper);

            // Convert to canvas
            const canvas = await html2canvas(exportContainer, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            // Remove temp container
            document.body.removeChild(exportContainer);

            // Create PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('agentic-workflow-analysis.pdf');

        } catch (error) {
            console.error('PDF export error:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const exportToCSV = () => {
        const monolithicCost = calculateCost(monolithicTokens, pricePerThousand);
        const agenticCost = calculateCost(agenticTotalTokens, pricePerThousand);
        const savings = calculateSavings(monolithicCost, agenticCost);

        // Build CSV content
        const csvContent = [
            ['Agentic Workflow Analysis Report'],
            [`Generated: ${new Date().toLocaleString()}`],
            [],
            ['Metric', 'Monolithic', 'Agentic', 'Savings'],
            ['Tokens per Request', monolithicTokens, agenticTotalTokens, monolithicTokens - agenticTotalTokens],
            ['Cost per Request', monolithicCost.toFixed(4), agenticCost.toFixed(4), savings.amount.toFixed(4)],
            ['Reduction %', '', '', savings.percentage.toFixed(1) + '%'],
            [],
            ['Monthly Projections (Price per 1K tokens: $' + pricePerThousand + ')'],
            ['Tokens/Month', 'Monolithic Cost', 'Agentic Cost', 'Monthly Savings'],
            ['1,000,000', (monolithicCost * 1000000 / agenticTotalTokens).toFixed(2), '2.00', ((monolithicCost * 1000000 / agenticTotalTokens) - 2).toFixed(2)],
            ['10,000,000', (monolithicCost * 10000000 / agenticTotalTokens).toFixed(2), '20.00', ((monolithicCost * 10000000 / agenticTotalTokens) - 20).toFixed(2)],
            ['100,000,000', (monolithicCost * 100000000 / agenticTotalTokens).toFixed(2), '200.00', ((monolithicCost * 100000000 / agenticTotalTokens) - 200).toFixed(2)],
        ].map(row => row.join(',')).join('\n');

        // Create and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'agentic-workflow-analysis.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center gap-sm">
                    <Download size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h2>Export & Share</h2>
                        <p>Download reports for presentations and stakeholders</p>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="grid grid-2 gap-md">
                    {/* PDF Export */}
                    <div style={{
                        padding: 'var(--spacing-lg)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid rgba(99, 102, 241, 0.3)'
                    }}>
                        <div className="flex items-center gap-sm mb-sm">
                            <FileText size={32} style={{ color: 'var(--accent-primary)' }} />
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 0 }}>PDF Report</h3>
                        </div>
                        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                            Generate a comprehensive PDF report with token analysis, cost comparisons, and projections.
                            Perfect for stakeholder presentations.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={exportToPDF}
                            disabled={isExporting}
                            style={{ width: '100%' }}
                        >
                            <FileText size={18} />
                            {isExporting ? 'Generating PDF...' : 'Export to PDF'}
                        </button>
                    </div>

                    {/* CSV Export */}
                    <div style={{
                        padding: 'var(--spacing-lg)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid rgba(16, 185, 129, 0.3)'
                    }}>
                        <div className="flex items-center gap-sm mb-sm">
                            <Table size={32} style={{ color: 'var(--accent-success)' }} />
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 0 }}>CSV Data</h3>
                        </div>
                        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                            Export raw data in CSV format for further analysis in Excel, Google Sheets, or other tools.
                            Includes all metrics and projections.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={exportToCSV}
                            style={{ width: '100%', background: 'var(--gradient-success)' }}
                        >
                            <Table size={18} />
                            Export to CSV
                        </button>
                    </div>
                </div>

                {/* Info Box */}
                <div style={{
                    marginTop: 'var(--spacing-lg)',
                    padding: 'var(--spacing-md)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid var(--accent-primary)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        📊 What's Included in Exports
                    </p>
                    <ul style={{ fontSize: '0.875rem', marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li>Executive summary of token optimization</li>
                        <li>Detailed token usage comparison</li>
                        <li>Cost analysis with current pricing (${pricePerThousand}/1K tokens)</li>
                        <li>Monthly projections at multiple scales</li>
                        <li>Recommendations for implementation</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ExportTools;
