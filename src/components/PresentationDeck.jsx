import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, Check, AlertCircle, Info, TrendingUp, Sparkles, Building } from 'lucide-react';
import { monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { calculateCostWithEngine, calculateLaborSavings, calculateNPV, calculatePaybackPeriod, calculateOpEx, formatCurrency, formatNumber } from '../utils/calculations';

/* ── Styled Components ─────────────────────────────────── */

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #0f172a; /* Dark slate background for premium executive vibe */
    z-index: 9999;
    display: flex;
    flex-direction: column;
    color: #f8fafc;
    font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
`;

const DeckHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: #1e293b;
`;

const FirmLogo = styled.div`
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
    color: #38bdf8;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-transform: uppercase;
`;

const HeaderControls = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const ActionBtn = styled.button`
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #f8fafc;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all var(--transition-base);

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
`;

const DeckBody = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
    overflow-y: auto;
`;

const SlideContainer = styled.div`
    width: 100%;
    max-width: 1000px;
    background: #1e293b;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    padding: 3rem;
    min-height: 540px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    transition: all 0.3s ease;
`;

const SlideTitle = styled.h2`
    font-size: 2.25rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid #0284c7;
    padding-bottom: 0.75rem;
    line-height: 1.15;
`;

const SlideSubtitle = styled.p`
    font-size: 1.05rem;
    color: #94a3b8;
    margin-bottom: 2rem;
`;

const SlideContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const DeckFooter = styled.footer`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: #1e293b;
`;

const PageIndicator = styled.div`
    font-size: 0.9rem;
    color: #94a3b8;
    font-weight: 600;
`;

const NavGroup = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const NavBtn = styled.button`
    background: #0284c7;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-base);

    &:hover:not(:disabled) {
        background: #0369a1;
        transform: scale(1.05);
    }

    &:disabled {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.2);
        cursor: not-allowed;
    }
`;

/* ── Slide-specific Styled Elements ───────────────────── */

const TitleSlideWrapper = styled.div`
    text-align: center;
    padding: 3rem 0;
`;

const TitleText = styled.h1`
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.03em;
`;

const StrategicBullets = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
`;

const BulletCard = styled.div`
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    border-top: 3px solid ${({ bordercolor }) => bordercolor || '#0284c7'};
`;

const CardTitle = styled.h4`
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const CardText = styled.p`
    font-size: 0.9rem;
    color: #cbd5e1;
    line-height: 1.6;
    margin-bottom: 0;
`;

const HighlightValue = styled.div`
    font-size: 2.25rem;
    font-weight: 800;
    color: ${({ color }) => color || '#38bdf8'};
    margin-bottom: 0.25rem;
`;

const TableWrapper = styled.div`
    width: 100%;
    overflow-x: auto;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-md);
`;

const SlideTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
    text-align: left;

    th, td {
        padding: 0.8rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    th {
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
    }

    td {
        color: #cbd5e1;
    }

    tr:last-child td {
        border-bottom: none;
    }
`;

const TableRowHighlight = styled.tr`
    background: rgba(16, 185, 129, 0.1);
    font-weight: bold;
    td {
        color: #34d399 !important;
    }
`;

const RoadmapGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const RoadmapStep = styled.div`
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    position: relative;
    border-left: 4px solid ${({ color }) => color || 'var(--accent-primary)'};
`;

const StepNum = styled.div`
    position: absolute;
    top: 1rem;
    right: 1.25rem;
    font-size: 1.5rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.07);
`;

const PresentationDeck = ({
    isOpen,
    onClose,
    pricePerThousand,
    monthlyRequests,
    monthlyTokens,
    laborRate,
    auditTime,
    monoError,
    agenticError,
    implCost,
    cacheHitRate,
    frontierMix,
    contractDiscount,
    maintenancePercent = 15
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!isOpen) return null;

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

    const laborSavingsObj = calculateLaborSavings(
        monthlyRequests,
        monoError,
        agenticError,
        auditTime,
        laborRate
    );

    // OpEx monthly maintenance cost
    const monthlyMaintenanceOpEx = calculateOpEx(implCost, maintenancePercent);

    const totalMonthlyGrossSavings = monthlyTokenSavings + laborSavingsObj.monthlySavings;
    const totalMonthlyNetSavings = totalMonthlyGrossSavings - monthlyMaintenanceOpEx;
    const totalAnnualNetSavings = totalMonthlyNetSavings * 12;

    const npv = calculateNPV(implCost, totalMonthlyGrossSavings, monthlyMaintenanceOpEx);
    const paybackPeriod = calculatePaybackPeriod(implCost, totalMonthlyGrossSavings, monthlyMaintenanceOpEx);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
                console.error("Error attempting to enable full-screen mode:", err);
            });
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    const nextSlide = () => {
        if (currentSlide < 4) setCurrentSlide(prev => prev + 1);
    };

    const prevSlide = () => {
        if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
    };

    return (
        <Overlay>
            {/* Header */}
            <DeckHeader>
                <FirmLogo>
                    <Building size={18} />
                    Executive Advisory Services
                </FirmLogo>
                <HeaderControls>
                    <ActionBtn onClick={toggleFullscreen}>
                        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </ActionBtn>
                    <ActionBtn onClick={onClose} style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        <X size={15} />
                        Exit Slides
                    </ActionBtn>
                </HeaderControls>
            </DeckHeader>

            {/* Slide Body */}
            <DeckBody>
                <SlideContainer>
                    {/* Slide 0: Title Slide */}
                    {currentSlide === 0 && (
                        <TitleSlideWrapper className="animate-fadeIn">
                            <FirmLogo style={{ justifyContent: 'center', marginBottom: '1rem', fontSize: '0.8rem' }}>
                                <Sparkles size={14} /> Technology Strategy Group
                            </FirmLogo>
                            <TitleText>
                                Agentic AI Orchestration:<br />
                                The Strategic Business Case
                            </TitleText>
                            <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
                                Quantifying direct API cost compression, caching efficiencies, and indirect manual labor savings through self-healing agent pipelines.
                            </p>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                Prepared for Corporate Leadership Team &bull; {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                            </div>
                        </TitleSlideWrapper>
                    )}

                    {/* Slide 1: The Problem */}
                    {currentSlide === 1 && (
                        <div className="animate-fadeIn">
                            <SlideTitle>The Legacy AI Cost Bottleneck</SlideTitle>
                            <SlideSubtitle>Monolithic prompt architectures introduce structural token inflation and costly audit failure loops.</SlideSubtitle>
                            
                            <StrategicBullets>
                                <BulletCard bordercolor="var(--accent-danger)">
                                    <CardTitle>
                                        <AlertCircle size={16} color="var(--accent-danger)" />
                                        Context Token Expansion
                                    </CardTitle>
                                    <CardText>
                                        Every monolithic request pushes the entire raw context window into the LLM. Ingesting large files repeatedly leads to <strong>runaway vendor costs</strong>.
                                    </CardText>
                                </BulletCard>

                                <BulletCard bordercolor="var(--accent-danger)">
                                    <CardTitle>
                                        <AlertCircle size={16} color="var(--accent-danger)" />
                                        High Operational Error Rate
                                    </CardTitle>
                                    <CardText>
                                        Without verification steps, legacy prompts suffer from hallucination and invalid formats, forcing a costly <strong>{monoError}% error rate</strong>.
                                    </CardText>
                                </BulletCard>

                                <BulletCard bordercolor="var(--accent-danger)">
                                    <CardTitle>
                                        <AlertCircle size={16} color="var(--accent-danger)" />
                                        Compounding Labor Overhead
                                    </CardTitle>
                                    <CardText>
                                        Enterprise scaling is blocked by labor: every failure requires manual correction. Auditor capacity must grow linearly with transaction volume.
                                    </CardText>
                                </BulletCard>
                            </StrategicBullets>
                        </div>
                    )}

                    {/* Slide 2: The Solution */}
                    {currentSlide === 2 && (
                        <div className="animate-fadeIn">
                            <SlideTitle>The Solution: Self-Healing Agents</SlideTitle>
                            <SlideSubtitle>Decomposing monolithic prompt tasks into modular, specialized agents with embedded guardrails.</SlideSubtitle>

                            <StrategicBullets>
                                <BulletCard bordercolor="var(--accent-success)">
                                    <HighlightValue color="var(--accent-success)">
                                        {cacheHitRate}% / -{((monolithicTokens - agenticTotalTokens)/monolithicTokens * 100).toFixed(0)}%
                                    </HighlightValue>
                                    <CardTitle>Cache Hits & Compression</CardTitle>
                                    <CardText>
                                        Sub-steps hit semantic context cache, costing zero tokens. Independent agents compress payloads and target cheaper models.
                                    </CardText>
                                </BulletCard>

                                <BulletCard bordercolor="var(--accent-success)">
                                    <HighlightValue color="var(--accent-success)">
                                        {agenticError}%
                                    </HighlightValue>
                                    <CardTitle>Self-Healing Schema Check</CardTitle>
                                    <CardText>
                                        Outputs are dynamically validated. Schema repairs and loop guards catch and correct corrupted JSON on-the-fly, avoiding human reviews.
                                    </CardText>
                                </BulletCard>

                                <BulletCard bordercolor="var(--accent-success)">
                                    <HighlightValue color="var(--accent-success)">
                                        {formatNumber(laborSavingsObj.hoursSaved)} Hrs
                                    </HighlightValue>
                                    <CardTitle>Monthly Labor Reclaimed</CardTitle>
                                    <CardText>
                                        Shifting the audit burden from manual inspectors to self-healing validation guards frees operational staff for higher-value advisory work.
                                    </CardText>
                                </BulletCard>
                            </StrategicBullets>
                        </div>
                    )}

                    {/* Slide 3: Financial ROI */}
                    {currentSlide === 3 && (
                        <div className="animate-fadeIn">
                            <SlideTitle>Economic Value Assessment (EVA)</SlideTitle>
                            <SlideSubtitle>Modeling direct and indirect business benefits at {formatNumber(monthlyRequests)} monthly requests (factoring in PM CapEx & OpEx).</SlideSubtitle>

                            <TableWrapper>
                                <SlideTable>
                                    <thead>
                                        <tr>
                                            <th>Cost Category</th>
                                            <th>Monolithic (Legacy)</th>
                                            <th>Agentic (Target)</th>
                                            <th>Variance / Benefit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Direct LLM Token Cost (Monthly)</strong></td>
                                            <td>{formatCurrency(monolithicTokenCost * monthlyRequests)}</td>
                                            <td>{formatCurrency(agenticTokenCost * monthlyRequests)}</td>
                                            <td style={{ color: 'var(--accent-success)', fontWeight: '600' }}>
                                                {formatCurrency(monthlyTokenSavings)} (Token Savings)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Indirect Labor Cost (Monthly)</strong></td>
                                            <td>{formatCurrency(monolithicLaborCost * monthlyRequests)}</td>
                                            <td>{formatCurrency(agenticLaborCost * monthlyRequests)}</td>
                                            <td style={{ color: 'var(--accent-success)', fontWeight: '600' }}>
                                                {formatCurrency(laborSavingsObj.monthlySavings)} (Labor Savings)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>System Maintenance Cost (OpEx)</strong></td>
                                            <td>$0.00</td>
                                            <td>{formatCurrency(monthlyMaintenanceOpEx)}</td>
                                            <td style={{ color: 'var(--accent-danger)' }}>
                                                -{formatCurrency(monthlyMaintenanceOpEx)} (Maintenance OpEx)
                                            </td>
                                        </tr>
                                        <TableRowHighlight>
                                            <td>Total Monthly Net TCO</td>
                                            <td>{formatCurrency(monolithicCostPerRequest * monthlyRequests)}</td>
                                            <td>{formatCurrency(agenticCostPerRequest * monthlyRequests + monthlyMaintenanceOpEx)}</td>
                                            <td>{formatCurrency(totalMonthlyNetSavings)} / Month</td>
                                        </TableRowHighlight>
                                    </tbody>
                                </SlideTable>
                            </TableWrapper>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem', textAlign: 'center' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Payback Period</span>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--accent-primary)' }}>
                                        {paybackPeriod === 999 ? 'Immediate' : `${paybackPeriod} Months`}
                                    </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CapEx Build Cost</span>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>
                                        {formatCurrency(implCost)}
                                    </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>5-Year Net NPV</span>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--accent-success)' }}>
                                        {formatCurrency(npv)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Slide 4: Roadmap */}
                    {currentSlide === 4 && (
                        <div className="animate-fadeIn">
                            <SlideTitle>Implementation & Scaling Roadmap</SlideTitle>
                            <SlideSubtitle>A structured rollout plan designed to mitigate technology risks and capture economic gains early.</SlideSubtitle>

                            <RoadmapGrid>
                                <RoadmapStep color="var(--accent-primary)">
                                    <StepNum>01</StepNum>
                                    <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Pilot (Weeks 1–4)</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 0 }}>
                                        Establish code baseline, deploy 3 basic agents, verify cache hit rates, and validate cost reduction on a single email or report routing workflow.
                                    </p>
                                </RoadmapStep>

                                <RoadmapStep color="var(--accent-secondary)">
                                    <StepNum>02</StepNum>
                                    <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Scale (Months 2–3)</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 0 }}>
                                        Integrate self-healing schema validators to pull down manual audit reviews. Scale agentic structures to the top 5 high-volume document pipelines.
                                    </p>
                                </RoadmapStep>

                                <RoadmapStep color="var(--accent-success)">
                                    <StepNum>03</StepNum>
                                    <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Enterprise (Months 4+)</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 0 }}>
                                        Publish reusable validation templates internally. Restructure third-party LLM cloud vendor contracts around consolidated token volumes.
                                    </p>
                                </RoadmapStep>
                            </RoadmapGrid>

                            <div style={{
                                marginTop: '2rem',
                                padding: '1rem',
                                background: 'rgba(2, 132, 199, 0.08)',
                                border: '1px solid rgba(2, 132, 199, 0.2)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.88rem',
                                color: '#94a3b8'
                            }}>
                                <Info size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                                <div>
                                    <strong>Solution Architect Note:</strong> Transitioning from Phase 1 to Phase 2 should be gate-reviewed based on achieving a token savings threshold of at least 50% and proving schema validation stability.
                                </div>
                            </div>
                        </div>
                    )}
                </SlideContainer>
            </DeckBody>

            {/* Footer Navigation */}
            <DeckFooter>
                <PageIndicator>
                    Slide {currentSlide + 1} of 5
                </PageIndicator>
                <NavGroup>
                    <NavBtn onClick={prevSlide} disabled={currentSlide === 0}>
                        <ChevronLeft size={20} />
                    </NavBtn>
                    <NavBtn onClick={nextSlide} disabled={currentSlide === 4}>
                        <ChevronRight size={20} />
                    </NavBtn>
                </NavGroup>
            </DeckFooter>
        </Overlay>
    );
};

export default PresentationDeck;
