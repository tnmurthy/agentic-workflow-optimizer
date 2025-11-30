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

            exportContainer.innerHTML = `
        <div style="font-family: Arial, sans-serif;">
          <h1 style="color: #6366f1; margin-bottom: 10px;">Agentic Workflow Analysis Report</h1>
          <p style="color: #666; margin-bottom: 30px;">Generated on ${new Date().toLocaleDateString()}</p>
          
          <h2 style="color: #333; margin-top: 30px; margin-bottom: 15px;">Executive Summary</h2>
          <p style="line-height: 1.6;">
            This report demonstrates the cost savings achieved through agentic workflow architecture
            compared to traditional monolithic prompt approaches. By breaking down complex tasks into
            specialized agents, we achieve significant token reduction and cost optimization.
          </p>
          
          <h2 style="color: #333; margin-top: 30px; margin-bottom: 15px;">Token Usage Comparison</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Approach</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Tokens</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Cost per Request</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">Monolithic Prompt</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${formatNumber(monolithicTokens)}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${formatCurrency(monolithicCost)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">Agentic Pipeline</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${formatNumber(agenticTotalTokens)}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${formatCurrency(agenticCost)}</td>
              </tr>
              <tr style="background: #10b98133; font-weight: bold;">
                <td style="padding: 12px; border: 1px solid #ddd;">Savings</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${formatNumber(monolithicTokens - agenticTotalTokens)}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${formatCurrency(savings.amount)} (${savings.percentage.toFixed(1)}%)</td>
              </tr>
            </tbody>
          </table>
          
          <h2 style="color: #333; margin-top: 30px; margin-bottom: 15px;">Cost Projections</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Scale</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Monolithic</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Agentic</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Monthly Savings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">1M tokens/month</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$${(monolithicCost * 1000000 / agenticTotalTokens).toFixed(2)}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$2.00</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #10b981;">$${((monolithicCost * 1000000 / agenticTotalTokens) - 2).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">10M tokens/month</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$${(monolithicCost * 10000000 / agenticTotalTokens).toFixed(2)}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$20.00</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #10b981;">$${((monolithicCost * 10000000 / agenticTotalTokens) - 20).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">100M tokens/month</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$${(monolithicCost * 100000000 / agenticTotalTokens).toFixed(2)}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$200.00</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #10b981;">$${((monolithicCost * 100000000 / agenticTotalTokens) - 200).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <h2 style="color: #333; margin-top: 30px; margin-bottom: 15px;">Recommendations</h2>
          <ul style="line-height: 1.8;">
            <li>Implement agentic architecture for complex, multi-step workflows</li>
            <li>Start with high-volume use cases to maximize ROI</li>
            <li>Monitor per-agent performance and optimize token allocation</li>
            <li>Consider different LLM providers based on specific agent requirements</li>
          </ul>
          
          <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-left: 4px solid #6366f1;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              Generated by Agentic Workflow Token Optimizer<br>
              For more information, visit the application dashboard
            </p>
          </div>
        </div>
      `;

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
