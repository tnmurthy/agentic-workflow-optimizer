import React from 'react';
import styled from 'styled-components';
import {
    TrendingDown, DollarSign, Zap, Clock, Target, ShieldCheck,
    BarChart2, ArrowRight, CheckCircle, AlertCircle, Lightbulb
} from 'lucide-react';

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
    background: ${({ variant }) =>
        variant === 'success'
            ? 'rgba(16, 185, 129, 0.08)'
            : variant === 'warning'
            ? 'rgba(245, 158, 11, 0.08)'
            : 'rgba(2, 132, 199, 0.08)'};
    border: 1px solid ${({ variant }) =>
        variant === 'success'
            ? 'rgba(16, 185, 129, 0.25)'
            : variant === 'warning'
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
    color: ${({ variant }) =>
        variant === 'success'
            ? 'var(--accent-success)'
            : variant === 'warning'
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

const CalloutBanner = styled.div`
    background: var(--gradient-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    text-align: center;
    color: white;
    margin-top: var(--spacing-lg);
`;

/* ── Component ─────────────────────────────────────────── */

const kpis = [
    {
        icon: <TrendingDown size={20} />,
        value: '60%+',
        label: 'Cost Reduction',
        sub: 'Per AI request vs. legacy single-prompt approach',
        color: 'var(--accent-success)',
    },
    {
        icon: <DollarSign size={20} />,
        value: '$240K',
        label: 'Annual Savings',
        sub: 'Estimated at 500M tokens/year (adjustable below)',
        color: 'var(--accent-primary)',
    },
    {
        icon: <Clock size={20} />,
        value: '5×',
        label: 'Faster Processing',
        sub: 'Parallel agent execution vs. sequential monolithic runs',
        color: 'var(--accent-secondary)',
    },
    {
        icon: <Target size={20} />,
        value: '+12%',
        label: 'Accuracy Gain',
        sub: 'Specialist agents outperform general-purpose prompts',
        color: 'var(--accent-warning)',
    },
    {
        icon: <Zap size={20} />,
        value: '30–90',
        label: 'Days to ROI',
        sub: 'Typical payback period for enterprise deployments',
        color: 'var(--accent-danger)',
    },
    {
        icon: <ShieldCheck size={20} />,
        value: '0',
        label: 'Hallucinations',
        sub: 'Achieved via verified citations in RAG-based pipelines',
        color: '#7C3AED',
    },
];

const adoptionPhases = [
    {
        badge: 'Phase 1',
        color: 'var(--accent-primary)',
        title: 'Pilot (Week 1–4)',
        detail: 'Select one high-volume, low-risk AI task (e.g., email triage). Deploy a 3-agent pipeline. Measure baseline vs. new cost.',
    },
    {
        badge: 'Phase 2',
        color: 'var(--accent-secondary)',
        title: 'Scale (Month 2–3)',
        detail: 'Expand to top 5 AI workflows. Integrate with existing LLM provider contracts. Monitor savings via built-in dashboards.',
    },
    {
        badge: 'Phase 3',
        color: 'var(--accent-success)',
        title: 'Enterprise Roll-Out (Month 4+)',
        detail: 'Standardize the agentic framework across all AI-dependent teams. Update vendor contracts using documented savings data.',
    },
];

const ExecDashboard = () => {
    return (
        <DashboardCard className="card">
            {/* Header */}
            <div className="card-header">
                <SectionLabel>Executive Intelligence</SectionLabel>
                <h2 className="flex items-center gap-sm" style={{ marginBottom: '0.25rem' }}>
                    <BarChart2 size={26} style={{ color: 'var(--accent-primary)' }} />
                    Business Impact at a Glance
                </h2>
                <p style={{ marginBottom: 0 }}>
                    Plain-English summary for senior leaders — no technical background required.
                </p>
            </div>

            <div className="card-body">
                {/* KPI Row */}
                <SectionLabel>Key Performance Indicators</SectionLabel>
                <KpiGrid>
                    {kpis.map((kpi, i) => (
                        <KpiCard key={i} $accentColor={kpi.color}>
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
                    <HighlightBox variant="warning">
                        <HighlightHeading variant="warning">
                            <AlertCircle size={18} /> The Business Challenge
                        </HighlightHeading>
                        <BulletList>
                            <li>Every AI request in a <strong>"monolithic" setup</strong> sends your entire data context to the model — even when only 10% is relevant.</li>
                            <li>You are billed for <strong>100% of the tokens</strong>, but getting value from roughly <strong>40%</strong> of them.</li>
                            <li>As AI adoption grows, this waste compounds: a 10× increase in usage equals a 10× increase in wasted spend.</li>
                            <li>Enterprises running 100M+ AI requests per month may overspend by <strong>$100K–$500K annually</strong>.</li>
                        </BulletList>
                    </HighlightBox>

                    {/* What the solution delivers */}
                    <HighlightBox variant="success">
                        <HighlightHeading variant="success">
                            <CheckCircle size={18} /> The Solution — In Plain English
                        </HighlightHeading>
                        <BulletList>
                            <li>Instead of one large AI request, we break the task into <strong>small, specialized "agents"</strong> — each focused on a single job.</li>
                            <li>Each agent only sees the context it actually needs, <strong>slashing unnecessary token spend by 60%+</strong>.</li>
                            <li>Agents run in <strong>parallel</strong>, making the whole process faster — not slower.</li>
                            <li>Results are more accurate because each agent is an <strong>expert at one thing</strong>, not a generalist at everything.</li>
                        </BulletList>
                    </HighlightBox>
                </TwoColumn>

                {/* Analogy / non-tech explanation */}
                <HighlightBox variant="primary" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <HighlightHeading variant="primary">
                        <Lightbulb size={18} /> Think of it Like a Hospital vs. a GP Clinic
                    </HighlightHeading>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                        A monolithic AI prompt is like sending every patient to a single general practitioner who must know everything.
                        An agentic workflow is like a <strong>specialist hospital</strong> — the receptionist routes you to the right department,
                        where an expert handles your specific need efficiently. The hospital treats more patients, faster, at lower cost per case.
                        Your AI should work the same way.
                    </p>
                </HighlightBox>

                {/* Adoption roadmap */}
                <SectionLabel>Recommended Adoption Roadmap</SectionLabel>
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
                    <HighlightBox variant="primary">
                        <HighlightHeading variant="primary">
                            <CheckCircle size={18} /> Questions for Your CTO / AI Team
                        </HighlightHeading>
                        <BulletList>
                            <li>What is our current monthly token spend across all AI tools?</li>
                            <li>How many of our workflows use a single large prompt today?</li>
                            <li>Which high-volume tasks are the best candidates for a pilot?</li>
                            <li>Do we have an LLM cost monitoring dashboard in place?</li>
                            <li>What SLAs do we have for AI response time?</li>
                        </BulletList>
                    </HighlightBox>

                    <HighlightBox variant="success">
                        <HighlightHeading variant="success">
                            <ArrowRight size={18} /> Expected Business Outcomes
                        </HighlightHeading>
                        <BulletList>
                            <li><strong>Lower operating costs</strong> — measurable within the first billing cycle.</li>
                            <li><strong>Faster AI responses</strong> — better end-user and customer experience.</li>
                            <li><strong>Higher accuracy</strong> — fewer errors, less manual review overhead.</li>
                            <li><strong>Predictable scaling</strong> — cost grows sub-linearly as usage increases.</li>
                            <li><strong>Regulatory readiness</strong> — smaller context windows reduce sensitive data exposure per call.</li>
                        </BulletList>
                    </HighlightBox>
                </TwoColumn>

                {/* Call-to-action banner */}
                <CalloutBanner>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>
                        Use the interactive tools below to model your specific savings
                    </p>
                    <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', marginBottom: 0 }}>
                        Enter your monthly token volume and pricing in the Cost Calculator → get a board-ready ROI figure in seconds.
                    </p>
                </CalloutBanner>
            </div>
        </DashboardCard>
    );
};

export default ExecDashboard;
