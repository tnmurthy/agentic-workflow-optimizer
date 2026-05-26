import React, { useState } from 'react';
import styled from 'styled-components';
import { DollarSign, Clock, AlertTriangle, ShieldCheck, Cpu, Briefcase, Zap, Settings, ShieldAlert, BarChart, ChevronDown, ChevronUp, Database, MessageSquare, FileText, Sparkles } from 'lucide-react';
import { monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { calculateLaborSavings, calculateCostWithEngine, calculateCapEx, calculateOpEx, formatCurrency, formatNumber } from '../utils/calculations';

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

const SectionHeader = styled.h3`
    font-size: 0.78rem;
    color: var(--accent-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.35rem;
    margin-bottom: 0.15rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    border-bottom: 1px solid var(--glass-border);
    padding-bottom: 0.15rem;
`;

const PresetRow = styled.div`
    display: flex;
    gap: 0.25rem;
    width: 100%;
    margin-bottom: 0.25rem;
`;

const MiniPresetPill = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.35rem 0.4rem;
    font-size: 0.72rem;
    font-weight: 700;
    border-radius: var(--radius-sm);
    border: 1px solid ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--glass-border)'};
    background: ${({ $active }) => $active ? 'rgba(2, 132, 199, 0.08)' : 'transparent'};
    color: ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
    cursor: pointer;
    transition: all var(--transition-base);
    white-space: nowrap;

    &:hover {
        background: rgba(255, 255, 255, 0.02);
        border-color: var(--accent-primary);
    }
`;

const SliderWrapper = styled.div`
    margin-bottom: 0.2rem;

    .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.1rem;
    }

    .value-display {
        font-weight: 700;
        color: var(--accent-primary);
        font-size: 0.8rem;
    }

    input[type="range"] {
        width: 100%;
        accent-color: var(--accent-primary);
        background: var(--bg-tertiary);
        height: 5px;
        border-radius: var(--radius-full);
        outline: none;
        margin-top: 0.1rem;
        cursor: pointer;
    }
`;

const AdvancedGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35rem;
    margin-top: 0.35rem;
`;

const CostCalculator = ({
    pricePerThousand,
    onPriceChange,
    laborRate,
    onLaborRateChange,
    auditTime,
    onAuditTimeChange,
    monoError,
    onMonoErrorChange,
    agenticError,
    onAgenticErrorChange,
    devFte,
    onDevFteChange,
    buildWeeks,
    onBuildWeeksChange,
    builderRate,
    onBuilderRateChange,
    maintenancePercent,
    onMaintenancePercentChange,
    cacheHitRate,
    onCacheHitRateChange,
    frontierMix,
    onFrontierMixChange,
    contractDiscount,
    onContractDiscountChange,
    monthlyRequests,
    onMonthlyRequestsChange,
    monthlyTokens,
    onMonthlyTokensChange,
    selectedPresetId,
    onApplyPreset
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    // 1. CapEx & OpEx calculations
    const capEx = calculateCapEx(devFte, buildWeeks, builderRate);
    const monthlyMaintenanceOpEx = calculateOpEx(capEx, maintenancePercent);

    // 2. Direct Token Cost calculations with Caching and Discounts
    const monolithicTokenCost = calculateCostWithEngine(monolithicTokens, pricePerThousand, 0, contractDiscount);
    const utilityPricePerThousand = pricePerThousand / 8; 
    const blendedPricePerThousand = (frontierMix / 100) * pricePerThousand + (1 - frontierMix / 100) * utilityPricePerThousand;
    const agenticTokenCost = calculateCostWithEngine(agenticTotalTokens, blendedPricePerThousand, cacheHitRate, contractDiscount);
    
    const tokenSavingsPerRequest = monolithicTokenCost - agenticTokenCost;
    const monthlyTokenSavings = tokenSavingsPerRequest * monthlyRequests;

    // 3. Indirect Labor calculations
    const laborSavingsObj = calculateLaborSavings(
        monthlyRequests,
        monoError,
        agenticError,
        auditTime,
        laborRate
    );

    // 4. Combined Value
    const totalMonthlyGrossSavings = monthlyTokenSavings + laborSavingsObj.monthlySavings;
    const totalMonthlyNetSavings = totalMonthlyGrossSavings - monthlyMaintenanceOpEx;

    const handleVolumeChange = (val) => {
        onMonthlyRequestsChange(val);
        onMonthlyTokensChange(val * agenticTotalTokens);
    };

    return (
        <div className="card animate-fadeIn" style={{ height: '100%', marginBottom: 0, padding: '0.75rem var(--spacing-sm)' }}>
            <div className="card-header" style={{ paddingBottom: '0.4rem', marginBottom: '0.6rem', borderBottom: '1px solid var(--glass-border)' }}>
                <h2 className="flex items-center gap-sm" style={{ fontSize: '1rem', marginBottom: 0 }}>
                    <Briefcase size={16} style={{ color: 'var(--accent-primary)' }} />
                    ROI Modeling Engine
                </h2>
                <p style={{ fontSize: '0.75rem', margin: 0 }}>Configure strategic levers to simulate ROI impact in real time</p>
            </div>

            <div className="card-body" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <FormContainer>
                    {/* Section 0: Presets */}
                    <SectionHeader style={{ marginTop: 0 }}>
                        <Sparkles size={12} /> Use Case Preset Profile
                    </SectionHeader>
                    <PresetRow>
                        <MiniPresetPill 
                            $active={selectedPresetId === 'credit_underwriting'}
                            onClick={() => onApplyPreset('credit_underwriting')}
                        >
                            <Database size={11} />
                            Credit (RAG)
                        </MiniPresetPill>
                        <MiniPresetPill 
                            $active={selectedPresetId === 'telco_routing'}
                            onClick={() => onApplyPreset('telco_routing')}
                        >
                            <MessageSquare size={11} />
                            Telco (Router)
                        </MiniPresetPill>
                        <MiniPresetPill 
                            $active={selectedPresetId === 'healthcare_claims'}
                            onClick={() => onApplyPreset('healthcare_claims')}
                        >
                            <FileText size={11} />
                            Health (Claims)
                        </MiniPresetPill>
                    </PresetRow>

                    {/* Section 1: Core Strategic Levers */}
                    <SectionHeader>
                        <Zap size={12} /> Strategic Core Levers
                    </SectionHeader>

                    {/* Lever 1: Monthly Volume */}
                    <SliderWrapper>
                        <div className="label-row">
                            <label className="input-label" data-tooltip="Total requests processed through the workflow per month." style={{ marginBottom: 0, fontSize: '0.78rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Monthly Volume</label>
                            <span className="value-display">{formatNumber(monthlyRequests)} reqs</span>
                        </div>
                        <input
                            type="range"
                            min="5000"
                            max="1000000"
                            step="5000"
                            value={monthlyRequests}
                            onChange={(e) => handleVolumeChange(parseInt(e.target.value) || 0)}
                        />
                    </SliderWrapper>

                    {/* Lever 2: Labor Review Rate */}
                    <SliderWrapper>
                        <div className="label-row">
                            <label className="input-label" data-tooltip="Fully burdened hourly wage rate of auditors reviewing system flags." style={{ marginBottom: 0, fontSize: '0.78rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Auditor Labor Rate</label>
                            <span className="value-display">${laborRate}/hr</span>
                        </div>
                        <input
                            type="range"
                            min="15"
                            max="150"
                            step="5"
                            value={laborRate}
                            onChange={(e) => onLaborRateChange(parseFloat(e.target.value) || 0)}
                        />
                    </SliderWrapper>

                    {/* Lever 3: Negotiated volume discount */}
                    <SliderWrapper>
                        <div className="label-row">
                            <label className="input-label" data-tooltip="Negotiated volume discount rate applied to base token pricing." style={{ marginBottom: 0, fontSize: '0.78rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Volume Discount</label>
                            <span className="value-display">{contractDiscount}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="70"
                            step="5"
                            value={contractDiscount}
                            onChange={(e) => onContractDiscountChange(parseInt(e.target.value) || 0)}
                        />
                    </SliderWrapper>

                    {/* Section 2: Collapsible Advanced Settings Accordion */}
                    <div style={{ marginTop: '0.2rem' }}>
                        <button
                            className="btn btn-secondary flex items-center justify-between"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}
                        >
                            <span className="flex items-center gap-sm">
                                <Settings size={12} />
                                Advanced Assumptions
                            </span>
                            {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        
                        {showAdvanced && (
                            <div style={{
                                padding: '0.5rem',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(255,255,255,0.01)',
                                marginTop: '0.35rem'
                            }}>
                                <AdvancedGrid>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Standard input pricing per thousand tokens of the primary LLM model." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Base Model Price</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={pricePerThousand}
                                            onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
                                            step="0.001"
                                            min="0"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Estimated percentage of inputs served immediately by semantic caching." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Cache Hit Rate (%)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={cacheHitRate}
                                            onChange={(e) => onCacheHitRateChange(parseInt(e.target.value) || 0)}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Percentage of sub-steps routed to premium models vs. lower-cost utility models." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Frontier Mix (%)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={frontierMix}
                                            onChange={(e) => onFrontierMixChange(parseInt(e.target.value) || 0)}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Average minutes spent by a human auditor reviewing a single failed request." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Audit Mins/Error</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={auditTime}
                                            onChange={(e) => onAuditTimeChange(parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Estimated failure rate of standard single-prompt monolithic pipelines." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Mono Error (%)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={monoError}
                                            onChange={(e) => onMonoErrorChange(parseFloat(e.target.value) || 0)}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Targeted failure rate of the multi-agent self-correcting validation system." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Agentic Error (%)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={agenticError}
                                            onChange={(e) => onAgenticErrorChange(parseFloat(e.target.value) || 0)}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Number of full-time developers allocated to build the agentic pipeline." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Dev Build FTEs</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={devFte}
                                            onChange={(e) => onDevFteChange(parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Duration of the initial design, development, and testing phases." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Build Weeks</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={buildWeeks}
                                            onChange={(e) => onBuildWeeksChange(parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Average hourly contractor rate for development personnel." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Contractor Rate</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={builderRate}
                                            onChange={(e) => onBuilderRateChange(parseFloat(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label className="input-label" data-tooltip="Annual software support, testing, and operations overhead as a % of initial CapEx." style={{ fontSize: '0.7rem', marginBottom: '0.1rem', textDecoration: 'underline dotted var(--accent-primary)' }}>Maintenance (%)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                            value={maintenancePercent}
                                            onChange={(e) => onMaintenancePercentChange(parseFloat(e.target.value) || 0)}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </AdvancedGrid>
                            </div>
                        )}
                    </div>
                </FormContainer>

                {/* Dashboard Summary Panel */}
                <div style={{
                    padding: '0.4rem 0.6rem',
                    background: 'var(--gradient-success)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '0.8rem',
                    marginTop: '0.25rem'
                }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Net Monthly Savings:</span>
                        <span>{formatCurrency(totalMonthlyNetSavings)}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.9, marginTop: '0.1rem', textAlign: 'right' }}>
                        Annual: {formatCurrency(totalMonthlyNetSavings * 12)}/yr | CapEx: {formatCurrency(capEx)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostCalculator;
