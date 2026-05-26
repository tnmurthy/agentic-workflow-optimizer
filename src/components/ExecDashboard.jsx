import React from 'react';
import styled from 'styled-components';
import {
    TrendingDown, DollarSign, Clock, Target, ShieldCheck,
    BarChart2, ArrowRight, CheckCircle, AlertCircle, Lightbulb, Presentation, Percent
} from 'lucide-react';
import { monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { calculateLaborSavings, calculateNPV, calculatePaybackPeriod, calculateCostWithEngine, calculateOpEx, formatCurrency, formatNumber } from '../utils/calculations';

/* ── Styled Components ─────────────────────────────────── */

const DashboardCard = styled.div`
    margin-top: var(--spacing-xl);
    border: 2px solid rgba(2, 132, 199, 0.2);
`;

const SectionLabel = styled.p`
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent-primary);
    margin-bottom: var(--spacing-xs);
`;

const KpiGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
`;

const KpiCard = styled.div`
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    border-left: 4px solid ${({ $accentColor }) => $accentColor || 'var(--accent-primary)'};
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const KpiValue = styled.div`
    font-size: 2rem;
    font-weight: 800;
    color: ${({ $accentColor }) => $accentColor || 'var(--text-primary)'};
    line-height: 1;
`;

const KpiLabel = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
`;

const KpiSub = styled.div`
    font-size: 0.78rem;
    color: var(--text-secondary);
    margin-top: 0.15rem;
`;

const TwoColumn = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
`;

const HighlightBox = styled.div`
    background: ${({ $variant }) =>
        $variant === 'success'
            ? 'rgba(16, 185, 129, 0.08)'
            : $variant === 'warning'
            ? 'rgba(245, 158, 11, 0.08)'
            : 'rgba(2, 132, 199, 0.08)'};
    border: 1px solid ${({ $variant }) =>
        $variant === 'success'
            ? 'rgba(16, 185, 129, 0.25)'
            : $variant === 'warning'
            ? 'rgba(245, 158, 11, 0.25)'
            : 'rgba(2, 132, 199, 0.25)'};
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
`;

const HighlightHeading = styled.h4`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: var(--spacing-sm);
    color: ${({ $variant }) =>
        $variant === 'success'
            ? 'var(--accent-success)'
            : $variant === 'warning'
            ? 'var(--accent-warning)'
            : 'var(--accent-primary)'};
`;

const BulletList = styled.ul`
    padding-left: 1.25rem;
    color: var(--text-secondary);
    line-height: 1.9;
    margin: 0;
    font-size: 0.92rem;
`;

const PhaseBadge = styled.span`
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.15rem 0.6rem;
    border-radius: var(--radius-full);
    background: ${({ color }) => color || 'var(--accent-primary)'};
    color: white;
    margin-right: 0.5rem;
`;

const PhaseRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--glass-border);
    font-size: 0.9rem;
    color: var(--text-secondary);

    &:last-child {
        border-bottom: none;
    }
`;

const PhaseText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.15rem;

    strong {
        color: var(--text-primary);
    }
`;

const PitchBanner = styled.div`
    background: var(--gradient-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    box-shadow: var(--shadow-md);

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        align-items: stretch;
    }
`;

const PitchBannerText = styled.div`
    flex: 1;
    h3 {
        color: white;
        margin-bottom: 0.25rem;
        font-size: 1.25rem;
    }
    p {
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.9rem;
        margin-bottom: 0;
    }
`;

const PitchBtn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    color: #4338CA;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-weight: 700;
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    white-space: nowrap;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 14px rgba(0,0,0,0.15);
        background: #f8fafc;
    }
`;

const ExecDashboard = ({
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
    compact = false,
    onEnterPresentation
}) => {
    // 1. Calculations factoring in Solutions Architect states
    const monolithicTokenCost = calculateCostWithEngine(monolithicTokens, pricePerThousand, 0, contractDiscount);
    const monolithicLaborCost = (monoError / 100) * (auditTime / 60) * laborRate;
    const monolithicCostPerRequest = monolithicTokenCost + monolithicLaborCost;

    const utilityPricePerThousand = pricePerThousand / 8;
    const blendedPricePerThousand = (frontierMix / 100) * pricePerThousand + (1 - frontierMix / 100) * utilityPricePerThousand;
    const agenticTokenCost = calculateCostWithEngine(agenticTotalTokens, blendedPricePerThousand, cacheHitRate, contractDiscount);
    const agenticLaborCost = (agenticError / 100) * (auditTime / 60) * laborRate;
    const agenticCostPerRequest = agenticTokenCost + agenticLaborCost;

    const monthlyTokenSavings = (monolithicTokenCost - agenticTokenCost) * monthlyRequests;

    // 2. Indirect Labor calculations
    const laborSavingsObj = calculateLaborSavings(
        monthlyRequests,
        monoError,
        agenticError,
        auditTime,
        laborRate
    );

    const monthlyMaintenanceOpEx = calculateOpEx(implCost, maintenancePercent);

    // 3. Combined ROI Metrics
    const totalMonthlyGrossSavings = monthlyTokenSavings + laborSavingsObj.monthlySavings;
    const totalMonthlyNetSavings = totalMonthlyGrossSavings - monthlyMaintenanceOpEx;
    const totalAnnualNetSavings = totalMonthlyNetSavings * 12;

    const npv = calculateNPV(implCost, totalMonthlyGrossSavings, monthlyMaintenanceOpEx);
    const paybackPeriod = calculatePaybackPeriod(implCost, totalMonthlyGrossSavings, monthlyMaintenanceOpEx);
    const hoursSavedAnnually = laborSavingsObj.hoursSaved * 12;

    const kpis = [
        {
            icon: <DollarSign size={20} />,
            value: formatCurrency(totalAnnualNetSavings),
            label: 'Total Annualized Net Savings',
            sub: `Direct Token Cost: ${formatCurrency(monthlyTokenSavings * 12)} | Labor Reclamation: ${formatCurrency(laborSavingsObj.monthlySavings * 12)} (Net of OpEx: -${formatCurrency(monthlyMaintenanceOpEx * 12)}/yr)`,
            color: 'var(--accent-success)',
            tooltip: 'Calculated as (Monolithic TCO - Agentic TCO) * 12 months, accounting for both token spend and human labor.'
        },
        {
            icon: <TrendingDown size={20} />,
            value: formatCurrency(npv),
            label: '5-Year Net Present Value (NPV)',
            sub: 'Cumulative economic value generated, discounted at a standard 10% cost of capital (CapEx & OpEx included).',
            color: 'var(--accent-primary)',
            tooltip: 'Present value of cumulative net benefits over 5 years, discounted at a standard 10% rate of capital.'
        },
        {
            icon: <Clock size={20} />,
            value: paybackPeriod === 999 ? 'N/A' : `${paybackPeriod} Mo`,
            label: 'Payback Period',
            sub: `Capital recovery timeframe for the initial ${formatCurrency(implCost)} setup investment (CapEx).`,
            color: 'var(--accent-secondary)',
            tooltip: 'Time required to recover the initial developer setup CapEx through monthly operational net savings.'
        },
        {
            icon: <Percent size={20} />,
            value: `${((monolithicTokens - agenticTotalTokens) / monolithicTokens * 100).toFixed(0)}%`,
            label: 'Token Payload Compression',
            sub: `Slashes transaction payload from ${formatNumber(monolithicTokens)} to ${formatNumber(agenticTotalTokens)} tokens, optimizing context limits.`,
            color: 'var(--accent-warning)',
            tooltip: 'Percent reduction in average prompt payload tokens due to workflow chunking & dynamic routing.'
        },
        {
            icon: <ShieldCheck size={20} />,
            value: `${(monoError - agenticError).toFixed(0)}%`,
            label: 'System Accuracy Gain',
            sub: `Lowers failure rates from ${monoError}% to ${agenticError}% via automated compliance and schema validation loops.`,
            color: '#7C3AED',
            tooltip: 'Absolute decrease in output error rates by replacing monolithic prompts with self-correcting agent validation.'
        },
        {
            icon: <Target size={20} />,
            value: `${formatNumber(Math.round(hoursSavedAnnually))} Hrs`,
            label: 'Operational Capacity Reclaimed',
            sub: 'Burdened auditor hours redirected from manual review to core operations annually.',
            color: 'var(--accent-danger)',
            tooltip: 'Auditor inspection hours saved annually from automated JSON/schema validations repairing output faults.'
        },
    ];

    if (compact) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                {/* Presentation Pitch Banner */}
                <PitchBanner style={{ padding: '0.4rem 0.75rem', marginBottom: 0, borderRadius: 'var(--radius-md)', gap: '1rem' }}>
                    <PitchBannerText>
                        <h3 style={{ fontSize: '0.88rem', marginBottom: '0.1rem', color: 'white' }}>Steering Committee Slideshow</h3>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>Open board-ready advisory briefing detailing the economic return of agentic orchestration.</p>
                    </PitchBannerText>
                    <PitchBtn onClick={onEnterPresentation} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.3rem', borderRadius: 'var(--radius-sm)' }}>
                        <Presentation size={13} />
                        Launch Slide Briefing
                    </PitchBtn>
                </PitchBanner>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.4rem' }}>
                    {kpis.map((kpi, i) => (
                        <div key={i} data-tooltip={kpi.tooltip} style={{
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.4rem 0.6rem',
                            borderLeft: `3px solid ${kpi.color}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.1rem'
                        }}>
                            <div style={{ color: kpi.color, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}>
                                {kpi.icon && React.cloneElement(kpi.icon, { size: 12 })}
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{kpi.label}</span>
                            </div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: kpi.color, lineHeight: 1 }}>
                                {kpi.value}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.2 }}>
                                {kpi.sub}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compact Executive Advisory Commentary Block */}
                <div style={{
                    background: 'rgba(129, 140, 248, 0.04)',
                    border: '1px solid rgba(129, 140, 248, 0.15)',
                    borderLeft: '3px solid var(--accent-primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem 0.6rem',
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.35',
                    marginTop: '0.1rem'
                }}>
                    <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Executive Advisory Takeaway
                    </strong>
                    Decoupling transaction volume from raw API cost through caching and local routing models drives significant savings. However, the primary financial engine is reclaiming auditor manual review hours from system exception handling, representing up to 90% of total economic benefit.
                </div>
            </div>
        );
    }

    const adoptionPhases = [
        {
            badge: 'Phase 1',
            color: 'var(--accent-primary)',
            title: 'Proof of Value & Baseline Validation (Weeks 1–4)',
            detail: 'Deploy a targeted, multi-agent pipeline on a high-frequency pilot workflow. Run parallel operations to validate the economic model and direct token savings.',
        },
        {
            badge: 'Phase 2',
            color: 'var(--accent-secondary)',
            title: 'Scale & Operational Optimization (Months 2–3)',
            detail: 'Expand agentic architecture to the top 5 high-impact workflows. Integrate self-healing validators to reduce downstream manual inspection rates.',
        },
        {
            badge: 'Phase 3',
            color: 'var(--accent-success)',
            title: 'Enterprise Standardization & Leverage (Months 4+)',
            detail: 'Institutionalize self-healing agent design patterns across business units. Leverage aggregate volume efficiencies to renegotiate enterprise LLM licensing agreements.',
        },
    ];

    return (
        <DashboardCard className="card">
            {/* Presentation Pitch Banner */}
            <PitchBanner>
                <PitchBannerText>
                    <h3>Board-Ready Presentation Assets</h3>
                    <p>Access steering committee slides and senior leadership briefing material detailing the strategic business case, economic models, and architectural ROI of agentic migration.</p>
                </PitchBannerText>
                <PitchBtn onClick={onEnterPresentation}>
                    <Presentation size={18} />
                    Open Senior Leadership Briefing
                </PitchBtn>
            </PitchBanner>

            {/* Header */}
            <div className="card-header">
                <SectionLabel>Executive Intelligence</SectionLabel>
                <h2 className="flex items-center gap-sm" style={{ marginBottom: '0.25rem' }}>
                    <BarChart2 size={26} style={{ color: 'var(--accent-primary)' }} />
                    Economic & Operational Impact Summary
                </h2>
                <p style={{ marginBottom: 0 }}>
                    High-level KPIs outlining the direct (API transaction volume) and indirect (operational labor reclamation) financial return on investment.
                </p>
            </div>

            <div className="card-body">
                {/* KPI Row */}
                <SectionLabel>Key Performance Indicators</SectionLabel>
                <KpiGrid>
                    {kpis.map((kpi, i) => (
                        <KpiCard key={i} $accentColor={kpi.color} data-tooltip={kpi.tooltip}>
                            <div style={{ color: kpi.color, marginBottom: '0.25rem' }}>{kpi.icon}</div>
                            <KpiValue $accentColor={kpi.color}>{kpi.value}</KpiValue>
                            <KpiLabel>{kpi.label}</KpiLabel>
                            <KpiSub>{kpi.sub}</KpiSub>
                        </KpiCard>
                    ))}
                </KpiGrid>

                {/* Two-column insights */}
                <TwoColumn>
                    {/* What the problem is */}
                    <HighlightBox $variant="warning">
                        <HighlightHeading $variant="warning">
                            <AlertCircle size={18} /> The Legacy Cost Bottleneck
                        </HighlightHeading>
                        <BulletList>
                            <li><strong>Uncompressed Context Overheads</strong>: Monolithic prompts process entire documents repeatedly, leading to exponential API cost scaling.</li>
                            <li><strong>Schema Alignment Failures</strong>: Unstructured outputs result in high downstream failure rates (e.g., <strong>{monoError}%</strong> error rate), forcing expensive manual review.</li>
                            <li><strong>Linear Labor Escalation</strong>: Under the legacy model, expanding transaction volume requires a linear, unsustainable increase in validation personnel.</li>
                            <li><strong>API Congestion Risks</strong>: Bulky request sizes exhaust provider rate limits, introducing process latency and SLA compliance bottlenecks.</li>
                        </BulletList>
                    </HighlightBox>

                    {/* What the solution delivers */}
                    <HighlightBox $variant="success">
                        <HighlightHeading $variant="success">
                            <CheckCircle size={18} /> The Agentic Value Proposition
                        </HighlightHeading>
                        <BulletList>
                            <li><strong>Architectural Efficiency</strong>: Specialized agents process isolated context steps, driving a **{((monolithicTokens - agenticTotalTokens)/monolithicTokens * 100).toFixed(0)}%** direct token volume reduction.</li>
                            <li><strong>Automated Exception Handling</strong>: Self-healing JSON validators identify and repair schema format issues on-the-fly, reducing errors to **{agenticError}%**.</li>
                            <li><strong>Headcount Decoupling</strong>: Reclaims **{formatNumber(laborSavingsObj.hoursSaved)} operational hours** monthly, redirecting staff to high-value tasks.</li>
                            <li><strong>Operational Scalability</strong>: Accelerates transaction throughput with sub-linear operational costs, enabling high-margin business growth.</li>
                        </BulletList>
                    </HighlightBox>
                </TwoColumn>

                {/* Analogy / non-tech explanation */}
                <HighlightBox $variant="primary" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <HighlightHeading $variant="primary">
                        <Lightbulb size={18} /> Strategic Metaphor: Single Generalist vs. Specialized Assembly Line
                    </HighlightHeading>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                        A monolithic prompt is the equivalent of hiring one generalist consultant to digest a 1,000-page prospectus, build the financial model, draft the advisory report, and translate the deliverables in a single pass. It is slow, highly vulnerable to quality drift, and expensive.
                        Conversely, an agentic workflow establishes an **automated, specialized assembly line**. Specialized agents extract data, summarize components, validate formatting, and review compliance in sequence. When a specific step fails, the system self-heals instantly at the micro-level, bypassing the need for manual, human-in-the-loop corrections.
                    </p>
                </HighlightBox>

                {/* Adoption roadmap */}
                <SectionLabel>Implementation Roadmap</SectionLabel>
                <div className="card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', background: 'var(--bg-tertiary)' }}>
                    {adoptionPhases.map((phase, i) => (
                        <PhaseRow key={i}>
                            <div style={{ paddingTop: '0.1rem' }}>
                                <PhaseBadge color={phase.color}>{phase.badge}</PhaseBadge>
                            </div>
                            <PhaseText>
                                <strong>{phase.title}</strong>
                                {phase.detail}
                            </PhaseText>
                        </PhaseRow>
                    ))}
                </div>

                {/* Decision-maker checklist */}
                <TwoColumn>
                    <HighlightBox $variant="primary">
                        <HighlightHeading $variant="primary">
                            <CheckCircle size={18} /> Senior Advisory Diagnostic Questions
                        </HighlightHeading>
                        <BulletList>
                            <li>What proportion of our enterprise GenAI budget is currently consumed by redundant context tokens?</li>
                            <li>What is the fully burdened cost of manual review personnel (FTEs) dedicated to correcting LLM output errors?</li>
                            <li>Which operational pipelines are currently constrained by high latency SLAs or schema formatting failures?</li>
                            <li>How are we mitigating LLM vendor lock-in and ensuring downstream routing flexibility?</li>
                        </BulletList>
                    </HighlightBox>

                    <HighlightBox $variant="success">
                        <HighlightHeading $variant="success">
                            <ArrowRight size={18} /> Strategic Delivery Priorities
                        </HighlightHeading>
                        <BulletList>
                            <li><strong>Defensible ROI Business Case</strong>: Deliver a fully quantified financial model combining API cost avoidance and labor reclamation to secure executive sign-off.</li>
                            <li><strong>Rigorous Quality SLAs</strong>: Elevate output accuracy to institutional standards through automated, multi-pass validation loops.</li>
                            <li><strong>Operational Elasticity</strong>: Scale transaction volume exponentially while maintaining a flat operational cost curve.</li>
                            <li><strong>Multi-Model Arbitration</strong>: Route granular agent sub-steps dynamically to optimal price-performance models (e.g., Nano/Flash vs. Frontier models).</li>
                        </BulletList>
                    </HighlightBox>
                </TwoColumn>
            </div>
        </DashboardCard>
    );
};

export default ExecDashboard;
