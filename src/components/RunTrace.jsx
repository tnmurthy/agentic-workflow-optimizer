import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Activity, ChevronDown, ChevronRight, Trash2, RefreshCw } from 'lucide-react';
import { getRecentTraces, clearTraces } from '../utils/tracer';

const TraceCard = styled.div`
    .trace-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .trace-item {
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        overflow: hidden;
    }

    .trace-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-sm) var(--spacing-md);
        cursor: pointer;
        user-select: none;
        background: var(--bg-tertiary);

        &:hover {
            background: var(--bg-secondary);
        }

        .trace-meta {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-size: 0.875rem;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .ok { background: var(--accent-success); }
        .fail { background: var(--accent-danger); }

        .trace-id {
            font-family: monospace;
            font-size: 0.75rem;
            opacity: 0.5;
        }

        .latency-badge {
            font-size: 0.75rem;
            padding: 0.125rem 0.5rem;
            border-radius: 999px;
            background: var(--bg-primary);
            border: 1px solid var(--glass-border);
        }
    }

    .trace-body {
        padding: var(--spacing-md);
        border-top: 1px solid var(--glass-border);
        overflow: auto;

        pre {
            font-size: 0.75rem;
            line-height: 1.5;
            margin: 0;
            white-space: pre-wrap;
            word-break: break-word;
        }
    }

    .empty-state {
        padding: var(--spacing-lg);
        text-align: center;
        opacity: 0.5;
        font-size: 0.9rem;
    }

    .actions {
        display: flex;
        gap: var(--spacing-sm);
        justify-content: flex-end;
        margin-bottom: var(--spacing-md);
    }
`;

function formatTs(iso) {
    try {
        return new Date(iso).toLocaleTimeString();
    } catch (_) {
        return iso;
    }
}

function TraceItem({ trace }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="trace-item">
            <div className="trace-header" onClick={() => setExpanded(prev => !prev)}>
                <div className="trace-meta">
                    <span className={`status-dot ${trace.ok ? 'ok' : 'fail'}`} />
                    <strong>{trace.runName}</strong>
                    <span className="trace-id">{trace.runId}</span>
                    <span style={{ opacity: 0.6 }}>{formatTs(trace.timestamp)}</span>
                    {trace.terminationReason && (
                        <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem' }}>
                            ⚠ {trace.terminationReason}
                        </span>
                    )}
                </div>
                <div className="trace-meta">
                    <span className="latency-badge">{trace.totalLatencyMs}ms</span>
                    {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
            </div>

            {expanded && (
                <div className="trace-body">
                    <pre>{JSON.stringify(trace, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

/**
 * Displays recent workflow run traces for debugging and observability.
 */
const RunTrace = () => {
    const [traces, setTraces] = useState(() => getRecentTraces().reverse());

    const refresh = useCallback(() => {
        setTraces(getRecentTraces().reverse());
    }, []);

    const handleClear = useCallback(() => {
        clearTraces();
        setTraces([]);
    }, []);

    return (
        <TraceCard className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center gap-sm">
                    <Activity size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h2>Run Traces</h2>
                        <p>Inspect recent workflow runs – step inputs/outputs, timing, and termination reasons</p>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="actions">
                    <button className="btn btn-secondary" onClick={refresh}>
                        <RefreshCw size={14} />
                        Refresh
                    </button>
                    <button className="btn btn-secondary" onClick={handleClear} disabled={traces.length === 0}>
                        <Trash2 size={14} />
                        Clear
                    </button>
                </div>

                {traces.length === 0 ? (
                    <div className="empty-state">
                        No traces yet. Analyze a prompt above to generate your first run trace.
                    </div>
                ) : (
                    <div className="trace-list">
                        {traces.map(trace => (
                            <TraceItem key={trace.runId} trace={trace} />
                        ))}
                    </div>
                )}
            </div>
        </TraceCard>
    );
};

export default RunTrace;
