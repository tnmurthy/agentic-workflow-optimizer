import React from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { calculateLaborSavings, calculateNPV, calculatePaybackPeriod, calculateCostWithEngine, calculateOpEx, formatCurrency, formatNumber } from '../utils/calculations';

const ExportTools = ({
    pricePerThousand,
    monthlyRequests,
    monthlyTokens,
    laborRate,
    auditTime,
    monoError,
    agenticError,
    implCost,
    cacheHitRate = 30,
    frontierMix = 40,
    contractDiscount = 15,
    maintenancePercent = 15,
    compact = false
}) => {
    const [isExporting, setIsExporting] = React.useState(false);

    // 1. Core Calculations
    const monolithicTokenCost = calculateCostWithEngine(monolithicTokens, pricePerThousand, 0, contractDiscount);
    const monolithicLaborCost = (monoError / 100) * (auditTime / 60) * laborRate;
    const monolithicCostPerRequest = monolithicTokenCost + monolithicLaborCost;

    const utilityPricePerThousand = pricePerThousand / 8;
    const blendedPricePerThousand = (frontierMix / 100) * pricePerThousand + (1 - frontierMix / 100) * utilityPricePerThousand;
    const agenticTokenCost = calculateCostWithEngine(agenticTotalTokens, blendedPricePerThousand, cacheHitRate, contractDiscount);
    const agenticLaborCost = (agenticError / 100) * (auditTime / 60) * laborRate;
    const agenticCostPerRequest = agenticTokenCost + agenticLaborCost;

    const monthlyTokenSavings = (monolithicTokenCost - agenticTokenCost) * monthlyRequests;

    const laborSavingsObj = calculateLaborSavings(
        monthlyRequests,
        monoError,
        agenticError,
        auditTime,
        laborRate
    );

    const monthlyMaintenanceOpEx = calculateOpEx(implCost, maintenancePercent);

    const totalMonthlyGrossSavings = monthlyTokenSavings + laborSavingsObj.monthlySavings;
    const totalMonthlyNetSavings = totalMonthlyGrossSavings - monthlyMaintenanceOpEx;
    const totalAnnualNetSavings = totalMonthlyNetSavings * 12;

    const npv = calculateNPV(implCost, totalMonthlyGrossSavings, monthlyMaintenanceOpEx);
    const paybackPeriod = calculatePaybackPeriod(implCost, totalMonthlyGrossSavings, monthlyMaintenanceOpEx);

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

            exportContainer.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #1e293b; padding: 20px;">
          <div style="border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 30px;">
            <h1 style="color: #0369a1; margin: 0; font-size: 26px;">Agentic AI Business Case Report</h1>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Operational Leverage & Financial ROI Analysis &bull; Prepared on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <h2 style="color: #0f172a; margin-top: 30px; margin-bottom: 12px; font-size: 18px;">Executive Summary</h2>
          <p style="line-height: 1.6; font-size: 14px; margin-bottom: 25px;">
            This assessment evaluates the economic feasibility of migrating from monolithic single-prompt workflows to an
            orchestrated agentic pipeline. The analysis models both <strong>direct token cost reductions</strong> and
            <strong>indirect labor capacity reclaimed</strong> due to self-healing validation guards, offset by implementation setup and ongoing system maintenance.
          </p>

          <h2 style="color: #0f172a; margin-top: 25px; margin-bottom: 12px; font-size: 18px;">Strategic ROI Scorecard</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 600;">Financial Indicator</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; font-weight: 600;">Value</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 600;">Strategic Context</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Annualized Net Savings</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;">${formatCurrency(totalAnnualNetSavings)}</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #64748b;">Direct LLM Savings + Indirect labor reduction (Net of OpEx)</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">5-Year Net Present Value (NPV)</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold; color: #0284c7;">${formatCurrency(npv)}</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #64748b;">Discounted at 10% annual rate (with CapEx & OpEx)</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Payback Period (Months)</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold;">${paybackPeriod === 999 ? 'N/A' : paybackPeriod + ' Months'}</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #64748b;">Amortization of ${formatCurrency(implCost)} setup cost (CapEx)</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Annual Auditor Hours Saved</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold;">${formatNumber(Math.round(laborSavingsObj.hoursSaved * 12))} Hrs</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #64748b;">Auditing capacity redirected to core operations</td>
              </tr>
            </tbody>
          </table>
          
          <h2 style="color: #0f172a; margin-top: 30px; margin-bottom: 12px; font-size: 18px;">Monthly Cost Breakdown</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 600;">Cost Element (Monthly)</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; font-weight: 600;">Monolithic Prompt</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; font-weight: 600;">Agentic Workflow</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; font-weight: 600;">Monthly Variance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">LLM Token Costs</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">${formatCurrency(monolithicTokenCost * monthlyRequests)}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">${formatCurrency(agenticTokenCost * monthlyRequests)}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; color: #16a34a;">${formatCurrency(monthlyTokenSavings)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">Manual Auditor Labor Costs</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">${formatCurrency(monolithicLaborCost * monthlyRequests)}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">${formatCurrency(agenticLaborCost * monthlyRequests)}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; color: #16a34a;">${formatCurrency(laborSavingsObj.monthlySavings)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">System Maintenance (OpEx)</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">$0.00</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">${formatCurrency(monthlyMaintenanceOpEx)}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; color: #dc2626;">-${formatCurrency(monthlyMaintenanceOpEx)}</td>
              </tr>
              <tr style="background: #f0fdf4; font-weight: bold; font-size: 15px;">
                <td style="padding: 12px; border: 1px solid #cbd5e1; color: #1e293b;">Total Net Operating TCO</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #cbd5e1; color: #1e293b;">${formatCurrency(monolithicCostPerRequest * monthlyRequests)}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #cbd5e1; color: #1e293b;">${formatCurrency(agenticCostPerRequest * monthlyRequests + monthlyMaintenanceOpEx)}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #cbd5e1; color: #16a34a;">${formatCurrency(totalMonthlyNetSavings)}</td>
              </tr>
            </tbody>
          </table>

          <h2 style="color: #0f172a; margin-top: 30px; margin-bottom: 12px; font-size: 18px;">Key Assumptions</h2>
          <ul style="line-height: 1.8; font-size: 14px; padding-left: 20px; color: #475569;">
            <li>Monthly Transaction Volume: <strong>${formatNumber(monthlyRequests)} requests</strong></li>
            <li>Auditor Labor Hourly Rate: <strong>$${laborRate}/hour</strong></li>
            <li>Review Time spent per error: <strong>${auditTime} minutes</strong></li>
            <li>Monolithic failure rate: <strong>${monoError}%</strong> vs. Agentic failure rate: <strong>${agenticError}%</strong></li>
            <li>Blended Token Pricing: <strong>$${pricePerThousand} per 1,000 tokens</strong></li>
            <li>Negotiated Contract Discount: <strong>${contractDiscount}%</strong></li>
            <li>Cache Hit Rate (Agentic Caching): <strong>${cacheHitRate}%</strong></li>
            <li>Frontier / Utility Model Mix: <strong>${frontierMix}% / ${100 - frontierMix}%</strong></li>
            <li>One-off setup and migration cost (CapEx): <strong>${formatCurrency(implCost)}</strong></li>
            <li>Annual maintenance fee (OpEx): <strong>${maintenancePercent}% of CapEx</strong> (${formatCurrency(monthlyMaintenanceOpEx)}/month)</li>
          </ul>

          <h2 style="color: #0f172a; margin-top: 30px; margin-bottom: 12px; font-size: 18px;">Strategic Advisory Recommendations</h2>
          <ol style="line-height: 1.8; font-size: 14px; padding-left: 20px; color: #475569;">
            <li><strong>Initiate Pilot Triage</strong>: Select high-volume workflows like support routing to prove model savings before full compliance rollout.</li>
            <li><strong>Enforce Schema Guards</strong>: Embed real-time validator layers to drive down error correction loops, maximizing labor savings.</li>
            <li><strong>Consolidate APIs</strong>: Route low-complexity agent steps to cost-effective models (e.g. Gemini Flash/GPT-4o mini) dynamically.</li>
          </ol>
          
          <div style="margin-top: 40px; padding: 15px; background: #f8fafc; border-left: 4px solid #0284c7; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">
              Generated by Agentic Workflow ROI Calculator &bull; Confidential Consulting Asset
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
            pdf.save('agentic-ai-business-case.pdf');

        } catch (error) {
            console.error('PDF export error:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const exportToCSV = () => {
        // Build CSV content with advanced financial parameters
        const csvContent = [
            ['Agentic AI Business Case Analysis Report'],
            [`Generated: ${new Date().toLocaleString()}`],
            [],
            ['Core Modeling Parameters & Assumptions'],
            ['Parameter', 'Value', 'Unit'],
            ['Monthly Requests', monthlyRequests, 'requests/month'],
            ['Token Price per 1,000 Tokens (Base)', pricePerThousand, 'USD'],
            ['Cache Hit Rate', cacheHitRate, 'Percentage'],
            ['Frontier Model Mix Ratio', frontierMix, 'Percentage'],
            ['Negotiated Contract Discount', contractDiscount, 'Percentage'],
            ['Auditor Hourly Labor Rate', laborRate, 'USD/Hour'],
            ['Time Spent per Error', auditTime, 'Minutes'],
            ['Monolithic Error Rate', monoError, 'Percentage'],
            ['Agentic Error Rate', agenticError, 'Percentage'],
            ['One-off Setup CapEx Cost', implCost, 'USD'],
            ['Annual Maintenance OpEx Rate', maintenancePercent, 'Percentage'],
            ['Monthly Maintenance OpEx Cost', monthlyMaintenanceOpEx, 'USD'],
            [],
            ['Cost Breakdown per Single Request'],
            ['Approach', 'Token Cost', 'Labor Audit Cost', 'Maintenance Cost', 'Total Cost per Request'],
            ['Monolithic Prompt', monolithicTokenCost.toFixed(6), monolithicLaborCost.toFixed(6), '0.000000', monolithicCostPerRequest.toFixed(6)],
            ['Agentic Workflow', agenticTokenCost.toFixed(6), agenticLaborCost.toFixed(6), (monthlyMaintenanceOpEx / monthlyRequests).toFixed(6), (agenticCostPerRequest + monthlyMaintenanceOpEx / monthlyRequests).toFixed(6)],
            [],
            ['Financial ROI Metrics (Monthly / Annualized)'],
            ['Metric', 'Monthly', 'Annualized'],
            ['Direct Token Savings', monthlyTokenSavings.toFixed(2), (monthlyTokenSavings * 12).toFixed(2)],
            ['Indirect Labor Savings', laborSavingsObj.monthlySavings.toFixed(2), (laborSavingsObj.monthlySavings * 12).toFixed(2)],
            ['Ongoing Maintenance OpEx', (-monthlyMaintenanceOpEx).toFixed(2), (-monthlyMaintenanceOpEx * 12).toFixed(2)],
            ['Total Net Savings', totalMonthlyNetSavings.toFixed(2), totalAnnualNetSavings.toFixed(2)],
            [],
            ['Strategic Executive Metrics'],
            ['Metric', 'Value'],
            ['5-Year Net Present Value (NPV)', npv.toFixed(2)],
            ['Payback Period (Months)', paybackPeriod === 999 ? 'N/A' : paybackPeriod],
            ['Monthly Labor Hours Reclaimed', laborSavingsObj.hoursSaved.toFixed(1)],
            ['Annual Labor Hours Reclaimed', (laborSavingsObj.hoursSaved * 12).toFixed(1)],
            ['Errors Avoided per Month', laborSavingsObj.errorsAvoided]
        ].map(row => row.map(cell => {
            // Escape cells containing commas
            const cellStr = String(cell);
            if (cellStr.includes(',')) {
                return `"${cellStr}"`;
            }
            return cellStr;
        }).join(',')).join('\n');

        // Create and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'agentic-ai-business-case.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (compact) {
        return (
            <div className="flex gap-sm justify-center items-center" style={{ flexWrap: 'wrap', margin: 0 }}>
                <button
                    className="btn btn-primary"
                    onClick={exportToPDF}
                    disabled={isExporting}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', gap: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                >
                    <FileText size={14} />
                    {isExporting ? 'Generating PDF...' : 'Download PDF Memo'}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={exportToCSV}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', gap: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)' }}
                >
                    <Table size={14} style={{ color: 'var(--accent-success)' }} />
                    Download CSV Model
                </button>
            </div>
        );
    }

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center gap-sm">
                    <Download size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h2>Export & Share</h2>
                        <p>Download reports for stakeholders, sponsors, and steering committees</p>
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
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 0 }}>PDF Executive Memo</h3>
                        </div>
                        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                            Generate a formal business case PDF detailing the direct LLM token savings, auditor labor hours reclaimed, NPV, and payback period.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={exportToPDF}
                            disabled={isExporting}
                            style={{ width: '100%' }}
                        >
                            <FileText size={18} />
                            {isExporting ? 'Generating Memo...' : 'Export to PDF'}
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
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 0 }}>CSV Financial Model</h3>
                        </div>
                        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                            Export raw variables and savings projections in CSV format to be reviewed in Microsoft Excel or imported into standard consulting models.
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
                        📊 What is included in the Consulting Exports:
                    </p>
                    <ul style={{ fontSize: '0.875rem', marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li>Key strategic assumptions: Transaction volumes, model pricing, labor rates</li>
                        <li>Direct token cost compression metrics</li>
                        <li>Indirect human review time capacity savings calculations</li>
                        <li>Discounted 5-Year NPV and Setup Cost payback period projections</li>
                        <li>High-level partner implementation guidelines</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ExportTools;
