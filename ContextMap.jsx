import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { GitBranch, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

/* ── Styled Components ─────────────────────────────────── */

const Wrapper = styled.div`
  margin-top: var(--spacing-xl);
`;

const Card = styled.div`
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  h2 { margin: 0; font-size: 1.35rem; }
  p { margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--text-secondary); }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconBtn = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: var(--bg-secondary);
    color: var(--accent-primary);
    border-color: var(--accent-primary);
  }
`;

const LegendBar = styled.div`
  display: flex;
  gap: 1.25rem;
  padding: 0.75rem var(--spacing-lg);
  border-bottom: 1px solid var(--glass-border);
  background: var(--bg-tertiary);
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.color};
  flex-shrink: 0;
`;

const CanvasWrap = styled.div`
  position: relative;
  width: 100%;
  height: 560px;
  background: radial-gradient(ellipse at center, rgba(2,132,199,0.04) 0%, transparent 70%);
  cursor: grab;
  &:active { cursor: grabbing; }
  user-select: none;
`;

const SVGCanvas = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
`;

const TooltipBox = styled.div`
  position: absolute;
  pointer-events: none;
  background: var(--bg-card);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.9rem;
  box-shadow: var(--shadow-lg);
  max-width: 220px;
  z-index: 20;
  transition: opacity 0.15s;
  opacity: ${p => (p.visible ? 1 : 0)};

  .title { font-size: 0.875rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem; }
  .desc  { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; }
  .tag   {
    display: inline-block;
    margin-top: 0.4rem;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    background: ${p => p.tagColor + '22'};
    color: ${p => p.tagColor};
    border: 1px solid ${p => p.tagColor + '55'};
  }
`;

const InfoPanel = styled.div`
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--glass-border);
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  background: var(--bg-tertiary);
`;

const InfoStat = styled.div`
  .label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
  .value { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-top: 0.1rem; }
`;

/* ── Graph Data ─────────────────────────────────────────── */

const NODE_GROUPS = {
  agent:     { color: '#6366F1', label: 'Agent' },
  util:      { color: '#0284C7', label: 'Utility Module' },
  component: { color: '#10B981', label: 'UI Component' },
  data:      { color: '#F59E0B', label: 'Data / Store' },
  external:  { color: '#EF4444', label: 'External / API' },
  flow:      { color: '#8B5CF6', label: 'Data Flow' },
};

const NODES = [
  // ── Agents ──────────────────────────────────────
  { id: 'retriever',    label: 'Retriever Agent',     group: 'agent',     r: 26, desc: 'Fetches relevant context from knowledge base. Token budget: 300.', x: 0, y: 0 },
  { id: 'summarizer',   label: 'Summarizer Agent',    group: 'agent',     r: 24, desc: 'Compresses retrieved information into concise summaries. Token budget: 250.', x: 0, y: 0 },
  { id: 'classifier',   label: 'Classifier Agent',    group: 'agent',     r: 22, desc: 'Routes requests by categorizing intent. Token budget: 150.', x: 0, y: 0 },
  { id: 'insight',      label: 'Insight Agent',       group: 'agent',     r: 20, desc: 'Identifies patterns and key signals. Token budget: 100.', x: 0, y: 0 },
  { id: 'output',       label: 'Output Agent',        group: 'agent',     r: 18, desc: 'Generates the final formatted response. Token budget: 50.', x: 0, y: 0 },

  // ── Utility Modules ──────────────────────────────
  { id: 'workflowEngine', label: 'WorkflowRunner',   group: 'util',      r: 28, desc: 'Orchestrates sequential step execution with LoopGuard, retry, and AbortController cancellation.', x: 0, y: 0 },
  { id: 'loopGuard',    label: 'LoopGuard',           group: 'util',      r: 22, desc: 'Enforces max 25 iterations, 50 tool calls, and 30s wall-clock limit per run.', x: 0, y: 0 },
  { id: 'withRetry',    label: 'withRetry()',         group: 'util',      r: 20, desc: 'Exponential back-off retry wrapper with jitter. Respects AbortSignal.', x: 0, y: 0 },
  { id: 'cache',        label: 'Two-Tier Cache',      group: 'util',      r: 24, desc: 'Memory + localStorage cache keyed by stableStringify(stepName, inputs, model, params). TTL: 5 min.', x: 0, y: 0 },
  { id: 'tracer',       label: 'RunTracer',           group: 'util',      r: 22, desc: 'Logs step start/end with timings. Redacts secrets. Persists up to 50 traces in localStorage.', x: 0, y: 0 },
  { id: 'schemaVal',    label: 'SchemaValidator',     group: 'util',      r: 22, desc: 'Validates tokenAnalysis shape. Auto-repairs string numerics and clamps reduction to [0,100].', x: 0, y: 0 },
  { id: 'calculations', label: 'calculations.js',     group: 'util',      r: 20, desc: 'Pure cost & projection math: calculateCost, calculateSavings, calculateMonthlyProjection, etc.', x: 0, y: 0 },

  // ── UI Components ─────────────────────────────────
  { id: 'tokenizerInput', label: 'TokenizerInput',   group: 'component', r: 26, desc: 'Orchestrates the 3-step prompt-analysis pipeline using WorkflowRunner, cache, and tracer.', x: 0, y: 0 },
  { id: 'tokenFlow',    label: 'TokenFlowSankey',    group: 'component', r: 20, desc: 'Sankey chart showing token movement through the agent pipeline.', x: 0, y: 0 },
  { id: 'costCalc',     label: 'CostCalculator',     group: 'component', r: 20, desc: 'Real-time cost comparison at configurable price-per-1K-token.', x: 0, y: 0 },
  { id: 'projChart',    label: 'ProjectionCharts',   group: 'component', r: 20, desc: 'Monthly bar chart and 5-year line chart for ROI projections.', x: 0, y: 0 },
  { id: 'benchmarkMode',label: 'BenchmarkMode',      group: 'component', r: 20, desc: 'Pre-loaded benchmarks: Document Summarization, Email Classification, RAG Q&A.', x: 0, y: 0 },
  { id: 'runTrace',     label: 'RunTrace',           group: 'component', r: 20, desc: 'Observability panel: reads from tracer store and displays collapsible JSON run records.', x: 0, y: 0 },
  { id: 'exportTools',  label: 'ExportTools',        group: 'component', r: 18, desc: 'PDF (html2canvas + jsPDF) and CSV export of cost analysis results.', x: 0, y: 0 },
  { id: 'execDash',     label: 'ExecDashboard',      group: 'component', r: 18, desc: 'Business-impact KPIs for executives: cost reduction, accuracy, speed, ROI timeline.', x: 0, y: 0 },
  { id: 'providerComp', label: 'ProviderComparison', group: 'component', r: 18, desc: 'Side-by-side cost table across OpenAI, Anthropic, Google, Mistral models.', x: 0, y: 0 },
  { id: 'contextMap',   label: 'ContextMap ★',       group: 'component', r: 22, desc: 'You are here! Interactive force-directed graph mapping all system relationships.', x: 0, y: 0 },

  // ── Data / Store ──────────────────────────────────
  { id: 'workflowData', label: 'workflowData.js',    group: 'data',      r: 22, desc: 'Defines 5 agents with token weights, monolithicTokens=2000, agenticTotalTokens=850.', x: 0, y: 0 },
  { id: 'llmProviders', label: 'llmProviders.js',    group: 'data',      r: 20, desc: '4 providers × 14+ models with input/output pricing per 1M tokens and context window sizes.', x: 0, y: 0 },
  { id: 'localStorage', label: 'localStorage',       group: 'data',      r: 20, desc: 'Stores: aw_cache__*, aw_run_traces (max 50), agentic-scenarios. All ephemeral, browser-only.', x: 0, y: 0 },
  { id: 'appState',     label: 'App Global State',   group: 'data',      r: 22, desc: 'React state in App.jsx: pricePerThousand, monthlyRequests, monthlyTokens, tokenAnalysis.', x: 0, y: 0 },

  // ── External / API ────────────────────────────────
  { id: 'gptTokenizer', label: 'gpt-tokenizer',      group: 'external',  r: 22, desc: 'Client-side tokenizer (no API call). encode(prompt) returns GPT-compatible token IDs.', x: 0, y: 0 },
  { id: 'googleCharts', label: 'react-google-charts',group: 'external',  r: 18, desc: 'Sankey diagram renderer for TokenFlowSankey and CostBreakdownSankey.', x: 0, y: 0 },
  { id: 'chartjs',      label: 'Chart.js',           group: 'external',  r: 18, desc: 'Bar and line charts in TokenComparison and ProjectionCharts.', x: 0, y: 0 },
  { id: 'mermaid',      label: 'Mermaid',            group: 'external',  r: 16, desc: 'Flowchart diagrams rendered in LogicFlow.jsx.', x: 0, y: 0 },
  { id: 'githubPages',  label: 'GitHub Pages',       group: 'external',  r: 16, desc: 'Deployment target. GitHub Actions → ci.yml (test+build) → deploy.yml (push dist/).', x: 0, y: 0 },
];

const EDGES = [
  // Workflow engine internal
  { s: 'workflowEngine', t: 'loopGuard',     w: 3 },
  { s: 'workflowEngine', t: 'withRetry',     w: 3 },
  { s: 'workflowEngine', t: 'tracer',        w: 2 },

  // TokenizerInput pipeline
  { s: 'tokenizerInput', t: 'workflowEngine',w: 4 },
  { s: 'tokenizerInput', t: 'cache',         w: 3 },
  { s: 'tokenizerInput', t: 'gptTokenizer',  w: 4 },
  { s: 'tokenizerInput', t: 'schemaVal',     w: 3 },
  { s: 'tokenizerInput', t: 'tracer',        w: 2 },
  { s: 'tokenizerInput', t: 'workflowData',  w: 2 },
  { s: 'tokenizerInput', t: 'appState',      w: 3 },

  // Agents (pipeline order)
  { s: 'retriever',    t: 'summarizer',   w: 3 },
  { s: 'summarizer',   t: 'classifier',   w: 3 },
  { s: 'classifier',   t: 'insight',      w: 3 },
  { s: 'insight',      t: 'output',       w: 3 },
  { s: 'workflowData', t: 'retriever',    w: 2 },
  { s: 'workflowData', t: 'summarizer',   w: 2 },
  { s: 'workflowData', t: 'classifier',   w: 2 },
  { s: 'workflowData', t: 'insight',      w: 2 },
  { s: 'workflowData', t: 'output',       w: 2 },
  { s: 'tokenizerInput', t: 'retriever',  w: 3 },

  // Cache + tracer → localStorage
  { s: 'cache',      t: 'localStorage',  w: 3 },
  { s: 'tracer',     t: 'localStorage',  w: 3 },

  // Schema validator ↔ cache
  { s: 'schemaVal',  t: 'cache',         w: 2 },

  // UI components → data
  { s: 'costCalc',   t: 'calculations',  w: 3 },
  { s: 'projChart',  t: 'calculations',  w: 3 },
  { s: 'exportTools',t: 'calculations',  w: 2 },
  { s: 'providerComp',t:'llmProviders',  w: 3 },
  { s: 'costCalc',   t: 'workflowData',  w: 2 },
  { s: 'projChart',  t: 'workflowData',  w: 2 },

  // App state distribution
  { s: 'appState',   t: 'costCalc',      w: 2 },
  { s: 'appState',   t: 'projChart',     w: 2 },
  { s: 'appState',   t: 'providerComp',  w: 2 },
  { s: 'appState',   t: 'exportTools',   w: 2 },
  { s: 'appState',   t: 'tokenFlow',     w: 2 },

  // UI → charts
  { s: 'tokenFlow',  t: 'googleCharts',  w: 3 },
  { s: 'projChart',  t: 'chartjs',       w: 3 },

  // RunTrace → tracer store
  { s: 'runTrace',   t: 'tracer',        w: 3 },
  { s: 'runTrace',   t: 'localStorage',  w: 2 },

  // Benchmark
  { s: 'benchmarkMode',t:'calculations', w: 2 },

  // ExecDash
  { s: 'execDash',   t: 'appState',      w: 1 },

  // ContextMap (meta)
  { s: 'contextMap', t: 'appState',      w: 1 },
  { s: 'contextMap', t: 'workflowData',  w: 1 },

  // Mermaid
  { s: 'mermaid',    t: 'execDash',      w: 1 },

  // Deployment
  { s: 'githubPages',t: 'appState',      w: 1 },

  // Scenario builder saves to localStorage
  { s: 'localStorage',t:'workflowData',  w: 1 },
];

/* ── Force Simulation (vanilla JS, no d3) ───────────────── */

function initPositions(nodes, width, height) {
  // Place nodes in rough clusters by group
  const groupAngles = { agent: 0, util: 72, component: 144, data: 216, external: 288, flow: 330 };
  const cx = width / 2, cy = height / 2;
  const grouped = {};
  nodes.forEach(n => { (grouped[n.group] = grouped[n.group] || []).push(n); });

  nodes.forEach(n => {
    const angle = ((groupAngles[n.group] || 0) + Math.random() * 55) * Math.PI / 180;
    const spread = 130 + Math.random() * 80;
    n.x = cx + Math.cos(angle) * spread + (Math.random() - 0.5) * 60;
    n.y = cy + Math.sin(angle) * spread + (Math.random() - 0.5) * 60;
    n.vx = 0; n.vy = 0;
  });
}

function runSimulation(nodes, edges, steps = 300) {
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const REPULSION = 9000;
  const SPRING_K  = 0.04;
  const DAMPING   = 0.82;
  const GRAVITY   = 0.015;
  const cx = 500, cy = 280;

  for (let t = 0; t < steps; t++) {
    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d2 = Math.max(dx * dx + dy * dy, 0.01);
        const f = REPULSION / d2;
        const nx = dx / Math.sqrt(d2), ny = dy / Math.sqrt(d2);
        a.vx -= f * nx; a.vy -= f * ny;
        b.vx += f * nx; b.vy += f * ny;
      }
    }
    // Spring (edges)
    edges.forEach(e => {
      const a = byId[e.s], b = byId[e.t];
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const rest = 120 + 30 / (e.w || 1);
      const f = (d - rest) * SPRING_K;
      a.vx += f * dx / d; a.vy += f * dy / d;
      b.vx -= f * dx / d; b.vy -= f * dy / d;
    });
    // Gravity to center
    nodes.forEach(n => {
      n.vx += (cx - n.x) * GRAVITY;
      n.vy += (cy - n.y) * GRAVITY;
      n.vx *= DAMPING; n.vy *= DAMPING;
      n.x += n.vx; n.y += n.vy;
    });
  }
}

/* ── Component ───────────────────────────────────────────── */

const ContextMap = () => {
  const svgRef     = useRef(null);
  const nodesRef   = useRef(null);
  const [positions, setPositions] = useState([]);
  const [zoom, setZoom]           = useState(1);
  const [pan,  setPan]            = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip]     = useState({ visible: false, x: 0, y: 0, node: null });
  const [highlighted, setHighlighted] = useState(null);
  const dragging  = useRef(null);
  const panStart  = useRef(null);

  // Build nodes once
  useEffect(() => {
    const nodes = NODES.map(n => ({ ...n }));
    initPositions(nodes, 1000, 560);
    runSimulation(nodes, EDGES, 400);
    nodesRef.current = nodes;
    setPositions(nodes.map(n => ({ id: n.id, x: n.x, y: n.y })));
  }, []);

  const posMap = Object.fromEntries(positions.map(p => [p.id, p]));

  // Highlighted edges
  const neighborIds = highlighted
    ? new Set(EDGES.filter(e => e.s === highlighted || e.t === highlighted).flatMap(e => [e.s, e.t]))
    : null;

  /* Zoom controls */
  const zoomIn  = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const reset   = () => { setZoom(1); setPan({ x: 0, y: 0 }); setHighlighted(null); };

  /* Pan */
  const onMouseDown = useCallback((e) => {
    if (e.target.closest('.node-g')) return;
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);
  const onMouseMove = useCallback((e) => {
    if (!panStart.current) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  }, []);
  const onMouseUp = useCallback(() => { panStart.current = null; }, []);

  /* Node hover */
  const onNodeEnter = (e, node) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ visible: true, x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10, node });
    setHighlighted(node.id);
  };
  const onNodeLeave = () => {
    setTooltip(t => ({ ...t, visible: false }));
    setHighlighted(null);
  };
  const onNodeClick = (node) => {
    setHighlighted(h => h === node.id ? null : node.id);
  };

  const stats = {
    nodes: NODES.length,
    edges: EDGES.length,
    groups: Object.keys(NODE_GROUPS).length,
  };

  return (
    <Wrapper>
      <Card>
        <CardHeader>
          <HeaderLeft>
            <GitBranch size={26} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h2>Context Map</h2>
              <p>Interactive graph of all system relationships — click nodes to highlight connections</p>
            </div>
          </HeaderLeft>
          <Controls>
            <IconBtn onClick={zoomIn}  title="Zoom in">  <ZoomIn  size={15} /></IconBtn>
            <IconBtn onClick={zoomOut} title="Zoom out"> <ZoomOut size={15} /></IconBtn>
            <IconBtn onClick={reset}   title="Reset">    <RotateCcw size={15} /></IconBtn>
          </Controls>
        </CardHeader>

        <LegendBar>
          {Object.entries(NODE_GROUPS).map(([key, { color, label }]) => (
            <LegendItem key={key}>
              <LegendDot color={color} />
              {label}
            </LegendItem>
          ))}
        </LegendBar>

        <CanvasWrap
          ref={svgRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <SVGCanvas>
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#CBD5E1" />
              </marker>
              <marker id="arrow-hi" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#0284C7" />
              </marker>
              {Object.entries(NODE_GROUPS).map(([key, { color }]) => (
                <radialGradient key={key} id={`grad-${key}`} cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                </radialGradient>
              ))}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {EDGES.map((e, i) => {
                const a = posMap[e.s], b = posMap[e.t];
                if (!a || !b) return null;
                const isHi = highlighted && (e.s === highlighted || e.t === highlighted);
                const isDim = highlighted && !isHi;
                const na = NODES.find(n => n.id === e.s);
                const nb = NODES.find(n => n.id === e.t);
                // Shorten line to node radius
                const dx = b.x - a.x, dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const rA = (na?.r || 18) + 3, rB = (nb?.r || 18) + 3;
                const x1 = a.x + dx / dist * rA;
                const y1 = a.y + dy / dist * rA;
                const x2 = b.x - dx / dist * rB;
                const y2 = b.y - dy / dist * rB;

                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isHi ? '#0284C7' : '#CBD5E1'}
                    strokeWidth={isHi ? e.w * 1.5 : e.w * 0.7}
                    strokeOpacity={isDim ? 0.12 : isHi ? 0.9 : 0.45}
                    markerEnd={`url(#${isHi ? 'arrow-hi' : 'arrow'})`}
                    style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
                  />
                );
              })}

              {/* Nodes */}
              {NODES.map(node => {
                const pos = posMap[node.id];
                if (!pos) return null;
                const { color } = NODE_GROUPS[node.group];
                const isHi  = highlighted === node.id;
                const isNei = neighborIds?.has(node.id);
                const isDim = highlighted && !isHi && !isNei;

                return (
                  <g
                    key={node.id}
                    className="node-g"
                    transform={`translate(${pos.x},${pos.y})`}
                    style={{ cursor: 'pointer', opacity: isDim ? 0.22 : 1, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => onNodeEnter(e, node)}
                    onMouseLeave={onNodeLeave}
                    onClick={() => onNodeClick(node)}
                  >
                    {/* Glow ring when highlighted */}
                    {(isHi || isNei) && (
                      <circle
                        r={node.r + 8}
                        fill="none"
                        stroke={color}
                        strokeWidth={isHi ? 3 : 1.5}
                        strokeOpacity={isHi ? 0.7 : 0.35}
                        filter="url(#glow)"
                      />
                    )}
                    <circle
                      r={node.r}
                      fill={`url(#grad-${node.group})`}
                      stroke={isHi ? color : 'rgba(255,255,255,0.4)'}
                      strokeWidth={isHi ? 2.5 : 1}
                      style={{ transition: 'r 0.15s' }}
                    />
                    {/* Label inside for bigger nodes, outside for small */}
                    {node.r >= 22 ? (
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize={node.r >= 26 ? 9 : 8}
                        fontWeight="700"
                        fontFamily="system-ui, sans-serif"
                        style={{ pointerEvents: 'none' }}
                      >
                        {node.label.length > 14
                          ? node.label.split(' ').map((w, i) => (
                              <tspan key={i} x="0" dy={i === 0 ? (node.label.split(' ').length > 1 ? '-5' : '0') : '10'}>{w}</tspan>
                            ))
                          : node.label
                        }
                      </text>
                    ) : (
                      <text
                        textAnchor="middle"
                        y={node.r + 11}
                        fill={color}
                        fontSize={8}
                        fontWeight="700"
                        fontFamily="system-ui, sans-serif"
                        style={{ pointerEvents: 'none' }}
                      >
                        {node.label.split(' ')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </SVGCanvas>

          {/* Tooltip */}
          {tooltip.node && (
            <TooltipBox
              visible={tooltip.visible}
              tagColor={NODE_GROUPS[tooltip.node.group]?.color}
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div className="title">{tooltip.node.label}</div>
              <div className="desc">{tooltip.node.desc}</div>
              <div className="tag">{NODE_GROUPS[tooltip.node.group]?.label}</div>
            </TooltipBox>
          )}
        </CanvasWrap>

        <InfoPanel>
          <InfoStat>
            <div className="label">Nodes</div>
            <div className="value">{stats.nodes}</div>
          </InfoStat>
          <InfoStat>
            <div className="label">Connections</div>
            <div className="value">{stats.edges}</div>
          </InfoStat>
          <InfoStat>
            <div className="label">Node Types</div>
            <div className="value">{stats.groups}</div>
          </InfoStat>
          <InfoStat>
            <div className="label">Interaction</div>
            <div className="value" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Hover to inspect · Click to pin highlights · Drag canvas to pan · Scroll buttons to zoom
            </div>
          </InfoStat>
        </InfoPanel>
      </Card>
    </Wrapper>
  );
};

export default ContextMap;
