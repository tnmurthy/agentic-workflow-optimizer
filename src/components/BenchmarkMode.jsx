import React, { useState } from 'react';
import { BarChart2, Check, ArrowRight, Zap, FileText, MessageSquare, Database, Sparkles } from 'lucide-react';
import { formatNumber, formatCurrency, calculateLaborSavings, calculateCost, calculateSavings } from '../utils/calculations';
import { monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { toast } from 'react-hot-toast';

const caseStudies = [
    {
        id: 'credit_underwriting',
        name: 'Fortune 500 Credit Underwriting (RAG)',
        icon: <Database size={20} />,
        description: 'Automating high-precision bank credit risk analysis across thousands of annual reports.',
        monolithic: {
            tokens: 15000,
            cost: 0.03,
            time: '18s',
            errorRate: 14,
            quality: 'Legacy: Generic summarization, high risk of credit metric fabrication.'
        },
        agentic: {
            tokens: 4500,
            cost: 0.009,
            time: '4.5s (parallel)',
            errorRate: 1.5,
            quality: 'Next-Gen: Specialized extraction with dual schema validation & zero hallucinations.'
        },
        financials: {
            volume: 150000, // requests/month
            tokens: 150000000, // tokens/month
            laborRate: 55, // $/hr for underwriting analyst
            auditTime: 12, // minutes to verify/correct an error
            implCost: 60000 // $60K implementation cost
        },
        strategicTakeaway: 'By employing Retriever and Validator agents, the bank decreased its credit underwriting audit overhead by 89%, saving substantial analyst time while ensuring zero schema compliance failures.'
    },
    {
        id: 'telco_routing',
        name: 'Telco Support Ticket Router (Classification)',
        icon: <MessageSquare size={20} />,
        description: 'Intelligent triage and routing of customer support emails and live chat tickets.',
        monolithic: {
            tokens: 5000,
            cost: 0.01,
            time: '6s',
            errorRate: 20,
            quality: 'Legacy: 80% routing accuracy, struggles with sentiment nuance.'
        },
        agentic: {
            tokens: 1800,
            cost: 0.0036,
            time: '1.2s',
            errorRate: 3.0,
            quality: 'Next-Gen: 97% routing accuracy, sentiment extraction, and automatic triage.'
        },
        financials: {
            volume: 800000, // requests/month
            tokens: 80000000, // tokens/month
            laborRate: 32, // $/hr for customer operations agent
            auditTime: 8, // minutes to re-route and patch a ticket
            implCost: 45000 // $45K implementation cost
        },
        strategicTakeaway: 'Deploying a classifier agent coupled with self-healing guards reduced manual routing re-work. The client reclaimed hundreds of operator hours, resulting in massive operational leverage.'
    },
    {
        id: 'healthcare_claims',
        name: 'Healthcare Compliance (Summarization)',
        icon: <FileText size={20} />,
        description: 'Analyzing and summarising patient clinical documents for medical claims approvals.',
        monolithic: {
            tokens: 40000,
            cost: 0.08,
            time: '55s',
            errorRate: 16,
            quality: 'Legacy: Broad clinical summarizations, misses key diagnostic codes.'
        },
        agentic: {
            tokens: 12000,
            cost: 0.024,
            time: '14s (parallel)',
            errorRate: 1.0,
            quality: 'Next-Gen: Structured diagnostic code extraction with schema checks.'
        },
        financials: {
            volume: 250000, // requests/month
            tokens: 300000000, // tokens/month
            laborRate: 65, // $/hr for clinical coding auditor
            auditTime: 20, // minutes to re-audit a clinical document
            implCost: 80000 // $80K implementation cost
        },
        strategicTakeaway: 'Integrating diagnostic summaries with verification filters allowed the healthcare insurer to automate coding validation, preventing claims processing bottlenecks.'
    }
];

const BenchmarkMode = ({
    setMonthlyRequests,
    setMonthlyTokens,
    setLaborRate,
    setAuditTime,
    setMonoError,
    setAgenticError
}) => {
    const [selected, setSelected] = useState(caseStudies[0]);

    // Hardcoded model price reference of $0.002 per 1,000 tokens for case study previews
    const pricePerThousand = 0.002;

    const monolithicCost = calculateCost(selected.monolithic.tokens, pricePerThousand);
    const agenticCost = calculateCost(selected.agentic.tokens, pricePerThousand);
    const directSavingsPerReq = monolithicCost - agenticCost;

    const monthlyDirectSavings = directSavingsPerReq * selected.financials.volume;
    
    const laborSavingsObj = calculateLaborSavings(
        selected.financials.volume,
        selected.monolithic.errorRate,
        selected.agentic.errorRate,
        selected.financials.auditTime,
        selected.financials.laborRate
    );

    const totalMonthlyBenefit = monthlyDirectSavings + laborSavingsObj.monthlySavings;

    const applyCaseStudy = () => {
        setMonthlyRequests(selected.financials.volume);
        setMonthlyTokens(selected.financials.tokens);
        setLaborRate(selected.financials.laborRate);
        setAuditTime(selected.financials.auditTime);
        setMonoError(selected.monolithic.errorRate);
        setAgenticError(selected.agentic.errorRate);
        
        toast.success(`Applied ${selected.name} configuration globally! Check Overview & Economics tabs.`, {
            style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)'
            }
        });
    };

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="flex items-center gap-sm">
                        <BarChart2 size={24} style={{ color: 'var(--accent-primary)' }} />
                        <div>
                            <h2>Enterprise Case Studies</h2>
                            <p>Real-world client outcomes modeled by strategic consultants</p>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={applyCaseStudy} style={{ gap: '0.4rem' }}>
                        <Sparkles size={16} />
                        Apply Case Study Parameters
                    </button>
                </div>
            </div>

            <div className="card-body">
                {/* Case Study Selector */}
                <div className="flex gap-sm mb-lg" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {caseStudies.map(cs => (
                        <button
                            key={cs.id}
                            className={`btn ${selected.id === cs.id ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setSelected(cs)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            <span style={{ marginRight: '0.5rem' }}>{cs.icon}</span>
                            {cs.name}
                        </button>
                    ))}
                </div>

                {/* Selected Case Study Details */}
                <div className="grid grid-2 gap-lg">
                    {/* Case Description & Details */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{selected.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            {selected.description}
                        </p>

                        <div className="grid gap-md">
                            {/* Monolithic Card */}
                            <div style={{
                                padding: '1rem',
                                border: '1px solid var(--accent-danger)',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(239, 68, 68, 0.03)'
                            }}>
                                <div className="flex justify-between items-center mb-sm">
                                    <span style={{ fontWeight: 'bold', color: 'var(--accent-danger)' }}>Monolithic Approach (Legacy)</span>
                                </div>
                                <div className="grid grid-3 gap-sm" style={{ fontSize: '0.9rem' }}>
                                    <div>Tokens/Req: <strong>{formatNumber(selected.monolithic.tokens)}</strong></div>
                                    <div>Latency: <strong>{selected.monolithic.time}</strong></div>
                                    <div>Error Rate: <strong style={{ color: 'var(--accent-danger)' }}>{selected.monolithic.errorRate}%</strong></div>
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {selected.monolithic.quality}
                                </div>
                            </div>

                            {/* Agentic Card */}
                            <div style={{
                                padding: '1rem',
                                border: '1px solid var(--accent-success)',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(16, 185, 129, 0.03)'
                            }}>
                                <div className="flex justify-between items-center mb-sm">
                                    <span style={{ fontWeight: 'bold', color: 'var(--accent-success)' }}>Agentic Workflow (Target)</span>
                                    <Check size={16} style={{ color: 'var(--accent-success)' }} />
                                </div>
                                <div className="grid grid-3 gap-sm" style={{ fontSize: '0.9rem' }}>
                                    <div>Tokens/Req: <strong>{formatNumber(selected.agentic.tokens)}</strong></div>
                                    <div>Latency: <strong>{selected.agentic.time}</strong></div>
                                    <div>Error Rate: <strong style={{ color: 'var(--accent-success)' }}>{selected.agentic.errorRate}%</strong></div>
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {selected.agentic.quality}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial ROI Dashboard for Case Study */}
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                                Strategic Financial Metrics
                            </h4>

                            <div className="grid grid-2 gap-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly Volume</span>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 0, color: 'var(--text-primary)' }}>
                                        {formatNumber(selected.financials.volume)} requests
                                    </p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Auditor Labor Rate</span>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 0, color: 'var(--text-primary)' }}>
                                        ${selected.financials.laborRate}/hr
                                    </p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Audit Time/Error</span>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 0, color: 'var(--text-primary)' }}>
                                        {selected.financials.auditTime} minutes
                                    </p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Implementation Fee</span>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 0, color: 'var(--text-primary)' }}>
                                        {formatCurrency(selected.financials.implCost)}
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                padding: '0.75rem',
                                background: 'rgba(2, 132, 199, 0.08)',
                                border: '1px dashed var(--accent-primary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                <strong>Strategic takeaway:</strong> {selected.strategicTakeaway}
                            </div>
                        </div>

                        {/* Totals */}
                        <div style={{
                            padding: '1rem',
                            background: 'var(--gradient-accent)',
                            borderRadius: 'var(--radius-md)',
                            color: 'white'
                        }}>
                            <div className="flex justify-between items-center" style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                <span>Total Monthly Savings:</span>
                                <span>Direct + Labor</span>
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{formatCurrency(totalMonthlyBenefit)}</span>
                                <span style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.2)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                                    +{((selected.monolithic.errorRate - selected.agentic.errorRate) / selected.monolithic.errorRate * 100).toFixed(0)}% accuracy gain
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkMode;
