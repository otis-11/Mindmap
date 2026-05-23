import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  Sparkles, X, Rocket, Flag, Target, Compass,
  Plus, Trash2, Edit3, Check, Circle, CheckCircle2,
  Hand, ChevronUp, ChevronDown, ChevronRight, ChevronLeft,
  Settings, Pause, Play, Calendar, TrendingUp, BookOpen,
  ArrowUpRight, MoreVertical, Move, AlertCircle, Zap,
  DollarSign, Users, Clock, Bell, EyeOff, Eye, Search,
  Save, RotateCcw, Star, AlertTriangle, FileText, NotebookPen,
  ChevronsRight, CornerUpRight, GitBranch, Layers, Workflow,
  Telescope, Mouse, ScrollText, Maximize2, Minimize2
} from 'lucide-react';

const STORAGE_KEY = 'founder-hub-v1';
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);

// ==================== DEFAULT DATA ====================
const FALLBACK = {
  vision: {
    building: "AI services for SMBs — receptionists, CRMs, lead systems, scheduling, custom automations.",
    direction: "Be the AI translator for businesses that know they need AI but have no idea how to use it.",
    outcome: "$10k+ MRR in 3 months. Scalable system. Stop spinning."
  },
  branches: [
    { id: 'sales', name: 'Sales', tagline: 'Your #1 bottleneck', color: '#ef4444',
      items: [
        { id: 's1', text: 'Cold calls not working', notes: '', children: [] },
        { id: 's2', text: 'Referrals — working but finite', notes: '', children: [] },
        { id: 's3', text: 'Outreach campaign in progress', notes: '', children: [] },
        { id: 's4', text: 'Demos > resumes', notes: '', children: [] },
      ]},
    { id: 'offers', name: 'Offers', tagline: 'Pick ONE thing', color: '#f97316',
      items: [
        { id: 'o1', text: 'Too many offers confuses prospects', notes: '', children: [] },
        { id: 'o2', text: 'Fast-MRR entry: websites + automation', notes: '', children: [] },
      ]},
    { id: 'build', name: 'Build', tagline: 'Speed without quality loss', color: '#eab308',
      items: [
        { id: 'b1', text: 'Partner is the strong builder', notes: '', children: [] },
        { id: 'b2', text: 'Reusable templates across clients', notes: '', children: [] },
      ]},
    { id: 'money', name: 'Money', tagline: '$2-4k runway', color: '#10b981',
      items: [
        { id: 'm1', text: 'Audit subscriptions', notes: '', children: [] },
        { id: 'm2', text: 'Stripe this week', notes: '', children: [] },
      ]},
    { id: 'roles', name: 'Roles', tagline: "You're overloaded", color: '#0ea5e9',
      items: [
        { id: 'r1', text: 'AM = sales only, PM = build', notes: '', children: [] },
      ]},
  ],
  roadmap: [
    { id: 'ph1', phase: 1, title: 'Clarity & Foundation', timeframe: '2-3 weeks', color: '#f59e0b',
      items: [
        { id: 'ph1-1', text: 'Pick ONE lead offer', done: false, notes: '', children: [
          { id: 'ph1-1-a', text: 'Research 3 SMB niches', done: false, notes: '', children: [] },
          { id: 'ph1-1-b', text: 'Pick the niche', done: false, notes: '', children: [] },
          { id: 'ph1-1-c', text: 'Write the one-sentence pitch', done: false, notes: '', children: [] },
        ] },
        { id: 'ph1-2', text: 'Set Stripe + pricing', done: false, notes: '', children: [] },
        { id: 'ph1-3', text: 'Audit subscriptions', done: false, notes: '', children: [] },
        { id: 'ph1-4', text: 'Build 2-3 demos', done: false, notes: '', children: [] },
        { id: 'ph1-5', text: 'Calendar block: AM sales / PM build', done: false, notes: '', children: [] },
      ],
      pathSteps: [
        { id: 'ph1-ps1', text: 'Write down current offers', done: false, notes: '', children: [] },
        { id: 'ph1-ps2', text: 'Decide focus or freedom approach', done: false, notes: '', children: [] },
      ] },
    { id: 'ph2', phase: 2, title: 'Validate & Land', timeframe: 'Weeks 3-10', color: '#f97316',
      items: [
        { id: 'ph2-1', text: 'Run niche outreach', done: false, notes: '', children: [] },
        { id: 'ph2-2', text: 'Land 5-10 paying clients', done: false, notes: '', children: [] },
        { id: 'ph2-3', text: 'Build case studies', done: false, notes: '', children: [] },
        { id: 'ph2-4', text: 'Create reusable templates', done: false, notes: '', children: [] },
      ],
      pathSteps: [
        { id: 'ph2-ps1', text: 'Build prospect list (50 SMBs in niche)', done: false, notes: '', children: [] },
        { id: 'ph2-ps2', text: 'Record Loom demo', done: false, notes: '', children: [] },
        { id: 'ph2-ps3', text: 'First 10 outreach messages sent', done: false, notes: '', children: [] },
      ] },
    { id: 'ph3', phase: 3, title: 'Scale & Systemize', timeframe: 'Months 3-6', color: '#ec4899',
      items: [
        { id: 'ph3-1', text: 'Productize most-requested workflows', done: false, notes: '', children: [] },
        { id: 'ph3-2', text: 'Bring on VA / junior builder', done: false, notes: '', children: [] },
        { id: 'ph3-3', text: 'Hit $10k MRR', done: false, notes: '', children: [] },
      ],
      pathSteps: [
        { id: 'ph3-ps1', text: 'Document delivery process', done: false, notes: '', children: [] },
      ] },
    { id: 'ph4', phase: 4, title: 'Long-term Vision', timeframe: '6-18 months', color: '#a855f7',
      items: [
        { id: 'ph4-1', text: 'Known AI shop in niche', done: false, notes: '', children: [] },
        { id: 'ph4-2', text: 'Decide: agency / product / hybrid', done: false, notes: '', children: [] },
      ],
      pathSteps: [] },
  ],
  priorities: { now: [], later: [], optional: [], distraction: [] },
  nextMoves: [],
  notes: [],
  metrics: {
    mrr: 0, targetMrr: 10000, clients: 0, targetClients: 10,
    startDate: today(),
  },
  reflections: [],
  settings: { autoRotate: true, showBeacon: true, showLabels: true, celebrate: true },
  completionLog: [],
};

// ==================== SCHEMA / MIGRATION ====================
function ensureChildren(item) {
  return { ...item, children: (item.children || []).map(ensureChildren) };
}

function ensureSchema(d) {
  const merged = {
    ...FALLBACK,
    ...d,
    metrics: { ...FALLBACK.metrics, ...(d?.metrics || {}) },
    settings: { ...FALLBACK.settings, ...(d?.settings || {}) },
    reflections: d?.reflections || [],
    completionLog: d?.completionLog || [],
    notes: d?.notes || [],
  };
  // Migrate roadmap items to have children, ensure pathSteps
  merged.roadmap = (merged.roadmap || []).map(p => ({
    ...p,
    items: (p.items || []).map(ensureChildren),
    pathSteps: (p.pathSteps || []).map(ensureChildren),
  }));
  merged.branches = (merged.branches || []).map(b => ({
    ...b,
    items: (b.items || []).map(ensureChildren),
  }));
  return merged;
}

// ==================== TREE HELPERS ====================
function mapItems(items, fn) {
  return items.map(item => {
    const mapped = fn(item);
    if (mapped === null) return null;
    if (mapped.children) {
      return { ...mapped, children: mapItems(mapped.children, fn).filter(Boolean) };
    }
    return mapped;
  }).filter(Boolean);
}

function findInTree(items, predicate) {
  for (const item of items) {
    if (predicate(item)) return item;
    if (item.children) {
      const found = findInTree(item.children, predicate);
      if (found) return found;
    }
  }
  return null;
}

function updateNodeInList(items, nodeId, changes) {
  return mapItems(items, item => item.id === nodeId ? { ...item, ...changes } : item);
}

function addChildToNode(items, parentId, newChild) {
  return mapItems(items, item => {
    if (item.id === parentId) {
      return { ...item, children: [...(item.children || []), newChild] };
    }
    return item;
  });
}

function deleteNodeFromList(items, nodeId) {
  return items
    .filter(item => item.id !== nodeId)
    .map(item => ({
      ...item,
      children: deleteNodeFromList(item.children || [], nodeId),
    }));
}

// Recursive: count all undone leaves
function countLeaves(items) {
  let done = 0, total = 0;
  for (const item of items) {
    total++;
    if (item.done) done++;
    if (item.children?.length) {
      const sub = countLeaves(item.children);
      done += sub.done; total += sub.total;
    }
  }
  return { done, total };
}

// ==================== STATS ====================
function computeStats(data) {
  let done = 0, total = 0;
  for (const phase of data.roadmap || []) {
    const i = countLeaves(phase.items || []);
    const s = countLeaves(phase.pathSteps || []);
    done += i.done + s.done;
    total += i.total + s.total;
  }
  const progress = total > 0 ? done / total : 0;

  const start = new Date(data.metrics?.startDate || today());
  const now = new Date();
  const daysIn = Math.max(0, Math.floor((now - start) / 86400000));
  const weeksIn = Math.floor(daysIn / 7);

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const velocity = (data.completionLog || []).filter(e => new Date(e.date) >= weekAgo).length;

  return { done, total, progress, daysIn, weeksIn, velocity };
}

function findNextActions(data, limit = 3) {
  const next = [];
  // First, look in path steps (they come first chronologically)
  for (const phase of data.roadmap || []) {
    for (const step of (phase.pathSteps || [])) {
      if (!step.done) {
        next.push({ item: step, phase, kind: 'step' });
        if (next.length >= limit) return next;
      }
    }
    for (const init of (phase.items || [])) {
      if (!init.done) {
        next.push({ item: init, phase, kind: 'initiative' });
        if (next.length >= limit) return next;
      }
    }
  }
  return next;
}

// ==================== MAIN APP ====================
export default function App() {
  const [data, setData] = useState(FALLBACK);
  const [loaded, setLoaded] = useState(false);
  const [focused, setFocused] = useState(null);
  const [modal, setModal] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [todayCollapsed, setTodayCollapsed] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const saveTimer = useRef(null);
  const sceneApiRef = useRef({});

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) setData(ensureSchema(JSON.parse(r.value)));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify(data));
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1200);
      } catch {}
    }, 350);
  }, [data, loaded]);

  const stats = useMemo(() => computeStats(data), [data]);
  const nextActions = useMemo(() => findNextActions(data, 3), [data]);
  const nextAction = nextActions[0];

  // ============ Update functions ============
  const updateVision = (changes) => setData(d => ({ ...d, vision: { ...d.vision, ...changes } }));

  const updateMetrics = (changes) => setData(d => ({ ...d, metrics: { ...d.metrics, ...changes } }));

  const toggleSetting = (key) => setData(d => ({ ...d, settings: { ...d.settings, [key]: !d.settings[key] } }));

  const updatePhase = (phaseId, changes) => setData(d => ({
    ...d, roadmap: d.roadmap.map(p => p.id === phaseId ? { ...p, ...changes } : p)
  }));

  const updateBranch = (branchId, changes) => setData(d => ({
    ...d, branches: d.branches.map(b => b.id === branchId ? { ...b, ...changes } : b)
  }));

  // Generic node update — finds node in any tree
  const updateNode = (nodeId, changes) => {
    setData(d => {
      // Capture pre-state for celebration logic
      const wasUndone = (() => {
        for (const ph of d.roadmap) {
          const f = findInTree([...ph.items, ...ph.pathSteps], i => i.id === nodeId);
          if (f) return !f.done;
        }
        return false;
      })();

      const newData = {
        ...d,
        roadmap: d.roadmap.map(p => ({
          ...p,
          items: updateNodeInList(p.items, nodeId, changes),
          pathSteps: updateNodeInList(p.pathSteps, nodeId, changes),
        })),
        branches: d.branches.map(b => ({
          ...b,
          items: updateNodeInList(b.items, nodeId, changes),
        })),
      };

      if (changes.done === true && wasUndone) {
        const found = (() => {
          for (const ph of newData.roadmap) {
            const f = findInTree([...ph.items, ...ph.pathSteps], i => i.id === nodeId);
            if (f) return f;
          }
          return null;
        })();
        if (found) {
          newData.completionLog = [
            { itemId: nodeId, text: found.text, date: new Date().toISOString() },
            ...(d.completionLog || []).slice(0, 199)
          ];
          if (d.settings.celebrate) {
            setCelebration({ text: found.text, ts: Date.now() });
            setTimeout(() => setCelebration(null), 2400);
          }
        }
      }
      return newData;
    });
  };

  const addRootNode = (phaseId, kind, text) => {
    const newNode = { id: uid(), text, done: false, notes: '', children: [] };
    setData(d => ({
      ...d,
      roadmap: d.roadmap.map(p => p.id === phaseId
        ? { ...p, [kind]: [...(p[kind] || []), newNode] }
        : p)
    }));
    return newNode;
  };

  const addBranchRootNode = (branchId, text) => {
    setData(d => ({
      ...d,
      branches: d.branches.map(b => b.id === branchId
        ? { ...b, items: [...b.items, { id: uid(), text, notes: '', children: [] }] }
        : b)
    }));
  };

  // Add child to ANY node anywhere
  const addChild = (parentId, text) => {
    const newChild = { id: uid(), text, done: false, notes: '', children: [] };
    setData(d => ({
      ...d,
      roadmap: d.roadmap.map(p => ({
        ...p,
        items: addChildToNode(p.items, parentId, newChild),
        pathSteps: addChildToNode(p.pathSteps, parentId, newChild),
      })),
      branches: d.branches.map(b => ({
        ...b,
        items: addChildToNode(b.items, parentId, newChild),
      })),
    }));
  };

  const deleteNode = (nodeId) => {
    setData(d => ({
      ...d,
      roadmap: d.roadmap.map(p => ({
        ...p,
        items: deleteNodeFromList(p.items, nodeId),
        pathSteps: deleteNodeFromList(p.pathSteps, nodeId),
      })),
      branches: d.branches.map(b => ({
        ...b,
        items: deleteNodeFromList(b.items, nodeId),
      })),
    }));
    setFocused(null);
  };

  // Move initiative <-> path step OR between phases
  const moveNode = (nodeId, targetPhaseId, targetKind) => {
    setData(d => {
      let nodeToMove = null;
      // Find and remove node
      const newRoadmap = d.roadmap.map(p => {
        let items = p.items;
        let pathSteps = p.pathSteps;
        const inItems = findInTree(items, i => i.id === nodeId);
        if (inItems) {
          nodeToMove = inItems;
          items = deleteNodeFromList(items, nodeId);
        }
        const inSteps = findInTree(pathSteps, i => i.id === nodeId);
        if (inSteps) {
          nodeToMove = inSteps;
          pathSteps = deleteNodeFromList(pathSteps, nodeId);
        }
        return { ...p, items, pathSteps };
      });
      if (!nodeToMove) return d;
      // Add to target
      return {
        ...d,
        roadmap: newRoadmap.map(p =>
          p.id === targetPhaseId
            ? { ...p, [targetKind]: [...(p[targetKind] || []), nodeToMove] }
            : p
        )
      };
    });
  };

  // Promote brain dump note to something
  const promoteNote = (note, kind, payload) => {
    // kind: 'initiative', 'step', 'child'
    // payload: { phaseId, parentId, branchId }
    if (kind === 'initiative') {
      addRootNode(payload.phaseId, 'items', note.text);
    } else if (kind === 'step') {
      addRootNode(payload.phaseId, 'pathSteps', note.text);
    } else if (kind === 'child') {
      addChild(payload.parentId, note.text);
    } else if (kind === 'branch') {
      addBranchRootNode(payload.branchId, note.text);
    }
    setData(d => ({ ...d, notes: d.notes.filter(n => n.id !== note.id) }));
  };

  const addReflection = (text) => setData(d => ({
    ...d, reflections: [{ id: uid(), text, date: new Date().toISOString() }, ...d.reflections]
  }));
  const deleteReflection = (id) => setData(d => ({ ...d, reflections: d.reflections.filter(r => r.id !== id) }));
  const addNote = (text) => setData(d => ({
    ...d, notes: [{ id: uid(), text, date: new Date().toISOString() }, ...d.notes]
  }));

  // Add a whole new milestone
  const addMilestone = (title) => {
    const nextPhase = (data.roadmap || []).length + 1;
    const colors = ['#f59e0b', '#f97316', '#ec4899', '#a855f7', '#6366f1', '#06b6d4'];
    setData(d => ({
      ...d,
      roadmap: [...d.roadmap, {
        id: uid(),
        phase: nextPhase,
        title: title || `Phase ${nextPhase}`,
        timeframe: '?',
        color: colors[(d.roadmap.length) % colors.length],
        items: [],
        pathSteps: [],
      }]
    }));
  };

  const deletePhase = (phaseId) => {
    setData(d => ({ ...d, roadmap: d.roadmap.filter(p => p.id !== phaseId) }));
    setFocused(null);
  };

  const flyTo = (zone) => sceneApiRef.current.flyTo?.(zone);
  const flyToNextAction = () => {
    if (!nextAction) return;
    flyTo(`phase${nextAction.phase.phase}`);
    setFocused({ type: nextAction.kind === 'step' ? 'pathStep' : 'phaseItem', item: nextAction.item, phase: nextAction.phase });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-body relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-body { font-family: 'Geist', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .slide-in-left { animation: slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes celebratePop { 0% { opacity: 0; transform: scale(0.5) translateY(20px); } 20% { opacity: 1; transform: scale(1.1) translateY(0); } 40% { transform: scale(1); } 90% { opacity: 1; } 100% { opacity: 0; transform: scale(0.95) translateY(-10px); } }
        .celebrate-pop { animation: celebratePop 2.4s ease-out forwards; }
        canvas { display: block; outline: none; touch-action: none; }
        input, textarea { font-family: inherit; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
      `}</style>

      <CosmicScene
        data={data}
        nextAction={nextAction}
        settings={data.settings}
        onFocus={setFocused}
        sceneApiRef={sceneApiRef}
      />

      <TopBar
        stats={stats} savedFlash={savedFlash} metrics={data.metrics}
        onSettings={() => setModal('settings')}
        onMetrics={() => setModal('metrics')}
        onJournal={() => setModal('journal')}
        toggleSetting={toggleSetting}
        autoRotate={data.settings.autoRotate}
      />

      <TodayPanel
        nextActions={nextActions} stats={stats}
        collapsed={todayCollapsed} setCollapsed={setTodayCollapsed}
        onToggleDone={(id, done) => updateNode(id, { done })}
        onFocus={(item, phase, kind) => setFocused({ type: kind === 'step' ? 'pathStep' : 'phaseItem', item, phase })}
        flyToNextAction={flyToNextAction}
      />

      <ZoneNav flyTo={flyTo} addMilestone={() => addMilestone('')} />

      <ScrollIndicator sceneApiRef={sceneApiRef} />

      <button
        onClick={() => setModal('capture')}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-transform"
        title="Quick capture"
      >
        <Plus className="w-6 h-6 text-zinc-950" strokeWidth={2.5} />
      </button>

      {modal === 'capture' && (
        <QuickCaptureModal
          data={data} onClose={() => setModal(null)}
          addNote={addNote} addReflection={addReflection}
          addRoot={addRootNode} addBranchRoot={addBranchRootNode}
        />
      )}
      {modal === 'settings' && (
        <SettingsModal data={data} toggleSetting={toggleSetting}
          onResetData={() => { setData(FALLBACK); setModal(null); }}
          onClose={() => setModal(null)} />
      )}
      {modal === 'metrics' && (
        <MetricsModal metrics={data.metrics} stats={stats}
          updateMetrics={updateMetrics} onClose={() => setModal(null)} />
      )}
      {modal === 'journal' && (
        <JournalModal data={data}
          addReflection={addReflection} deleteReflection={deleteReflection}
          promoteNote={promoteNote}
          onClose={() => setModal(null)} />
      )}

      {focused && (
        <InfoCard
          focused={focused} data={data} stats={stats}
          onClose={() => setFocused(null)} setFocused={setFocused}
          updateVision={updateVision}
          updatePhase={updatePhase}
          updateBranch={updateBranch}
          updateNode={updateNode}
          addRootNode={addRootNode}
          addChild={addChild}
          deleteNode={deleteNode}
          deletePhase={deletePhase}
          moveNode={moveNode}
          flyToNextAction={flyToNextAction}
        />
      )}

      {celebration && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="celebrate-pop bg-zinc-900/95 backdrop-blur-xl border border-amber-500/50 rounded-2xl px-6 py-5 max-w-sm text-center shadow-2xl shadow-amber-500/30">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 mb-1">Step Complete</div>
            <div className="text-sm text-zinc-100 leading-relaxed">{celebration.text}</div>
            <div className="text-xs text-zinc-500 mt-2 font-mono">Climber rises ↑</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== 3D SCENE ==================== */
function CosmicScene({ data, nextAction, settings, onFocus, sceneApiRef }) {
  const mountRef = useRef(null);

  const completedItems = (data.roadmap || []).reduce((s, p) => {
    const i = countLeaves(p.items || []);
    const ps = countLeaves(p.pathSteps || []);
    return s + i.done + ps.done;
  }, 0);
  const totalItems = (data.roadmap || []).reduce((s, p) => {
    const i = countLeaves(p.items || []);
    const ps = countLeaves(p.pathSteps || []);
    return s + i.total + ps.total;
  }, 0);
  const progress = totalItems > 0 ? completedItems / totalItems : 0;

  useEffect(() => {
    if (!data || !mountRef.current) return;
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05050a, 0.004);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const Y_ORIGIN = -55;
    const phaseCount = (data.roadmap || []).length;
    const phaseSpacing = phaseCount > 0 ? 30 : 0;
    const Y_PHASES = (data.roadmap || []).map((_, i) => -30 + i * phaseSpacing);
    const Y_VISION = Y_PHASES.length > 0 ? Y_PHASES[Y_PHASES.length - 1] + 40 : 60;
    const Y_MIN = Y_ORIGIN - 10;
    const Y_MAX = Y_VISION + 20;

    const ZONES = {
      overview: { camY: (Y_ORIGIN + Y_VISION) / 2, lookY: (Y_ORIGIN + Y_VISION) / 2, dist: 140, yaw: 0.2, pitch: 0.05 },
      origin: { camY: Y_ORIGIN + 5, lookY: Y_ORIGIN, dist: 28, yaw: 0.3, pitch: 0 },
      vision: { camY: Y_VISION - 5, lookY: Y_VISION, dist: 38, yaw: 0.2, pitch: 0.1 },
    };
    Y_PHASES.forEach((y, i) => {
      ZONES[`phase${i + 1}`] = { camY: y, lookY: y, dist: 26, yaw: (i % 2 === 0 ? 0.4 : -0.4), pitch: 0.1 };
    });

    // ============ LIGHTING ============
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const visionLight = new THREE.PointLight(0xfbbf24, 4, 250);
    visionLight.position.set(0, Y_VISION, 0);
    scene.add(visionLight);
    (data.roadmap || []).forEach((phase, i) => {
      const light = new THREE.PointLight(new THREE.Color(phase.color), 1.5, 50);
      light.position.set(0, Y_PHASES[i], 0);
      scene.add(light);
    });

    // ============ BACKGROUND ============
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1000;
    const sPos = new Float32Array(starCount * 3);
    const sCol = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 400;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      sPos[i * 3 + 2] = (Math.random() - 0.5) * 400;
      const t = 0.6 + Math.random() * 0.4;
      const w = Math.random() > 0.7;
      sCol[i * 3] = w ? t * 1.1 : t;
      sCol[i * 3 + 1] = t;
      sCol[i * 3 + 2] = w ? t * 0.85 : t * 1.05;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({
      size: 0.6, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true
    }));
    scene.add(stars);

    // Label helper
    function makeLabel(text, color, size = 1) {
      const cnv = document.createElement('canvas');
      cnv.width = 512; cnv.height = 128;
      const ctx = cnv.getContext('2d');
      ctx.font = 'bold 48px Geist, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 10;
      ctx.fillText(text, 256, 64);
      const tex = new THREE.CanvasTexture(cnv);
      tex.minFilter = THREE.LinearFilter;
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.9, depthTest: false });
      const sp = new THREE.Sprite(mat);
      sp.scale.set(12 * size, 3 * size, 1);
      return sp;
    }

    // ============ JOURNEY PATH ============
    // Build curve through all phases
    const pathPoints = [new THREE.Vector3(0, Y_ORIGIN, 0)];
    Y_PHASES.forEach((y, i) => {
      const xOff = (i % 2 === 0 ? 3 : -3);
      const zOff = (i % 2 === 0 ? 5 : -5);
      // Add midpoint and phase point
      const prevY = i === 0 ? Y_ORIGIN : Y_PHASES[i - 1];
      pathPoints.push(new THREE.Vector3((i % 2 === 0 ? 6 : -6), (prevY + y) / 2, (i % 2 === 0 ? 4 : -4)));
      pathPoints.push(new THREE.Vector3(xOff, y, zOff));
    });
    pathPoints.push(new THREE.Vector3(0, Y_VISION - 10, 0));

    const curve = new THREE.CatmullRomCurve3(pathPoints);

    // Faded full path
    const tubeMesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 200, 0.12, 8, false),
      new THREE.MeshBasicMaterial({ color: 0x52525b, transparent: true, opacity: 0.4 })
    );
    scene.add(tubeMesh);

    // Lit travel portion
    if (progress > 0.001) {
      const tPts = [];
      for (let i = 0; i <= 200 * progress; i++) tPts.push(curve.getPoint(i / 200));
      if (tPts.length > 1) {
        const travelCurve = new THREE.CatmullRomCurve3(tPts);
        scene.add(new THREE.Mesh(
          new THREE.TubeGeometry(travelCurve, Math.max(20, tPts.length), 0.18, 8, false),
          new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.85 })
        ));
      }
    }

    // ============ PATH STEP DOTS (CLICKABLE) ============
    const pathStepMeshes = [];

    // Segment t-ranges
    const segmentTs = []; // [start, end] for each segment
    // Segments: origin -> ph1, ph1 -> ph2, ..., phN -> vision
    const numSegments = Y_PHASES.length + 1;
    for (let s = 0; s < numSegments; s++) {
      segmentTs.push([s / numSegments, (s + 1) / numSegments]);
    }

    (data.roadmap || []).forEach((phase, phaseIdx) => {
      const segment = segmentTs[phaseIdx]; // path TO this phase from previous
      const steps = phase.pathSteps || [];
      const count = steps.length;
      const segStart = segment[0];
      const segEnd = segment[1];

      if (count === 0) {
        // Decorative dots only
        for (let i = 1; i <= 4; i++) {
          const t = segStart + ((segEnd - segStart) * i / 5);
          const p = curve.getPoint(t);
          const isLit = t <= progress;
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 8, 8),
            new THREE.MeshBasicMaterial({
              color: isLit ? 0xfbbf24 : 0x52525b,
              transparent: true, opacity: isLit ? 0.8 : 0.3
            })
          );
          dot.position.copy(p);
          scene.add(dot);
        }
      } else {
        steps.forEach((step, j) => {
          const t = segStart + ((segEnd - segStart) * (j + 1) / (count + 1));
          const p = curve.getPoint(t);
          const dotMesh = new THREE.Mesh(
            new THREE.SphereGeometry(step.done ? 0.5 : 0.35, 16, 16),
            new THREE.MeshStandardMaterial({
              color: step.done ? 0xfbbf24 : new THREE.Color(phase.color),
              emissive: step.done ? 0xfbbf24 : new THREE.Color(phase.color),
              emissiveIntensity: step.done ? 0.9 : 0.5,
              roughness: 0.4,
            })
          );
          dotMesh.position.copy(p);
          dotMesh.userData = { type: 'pathStep', item: step, phase, phaseIdx };
          scene.add(dotMesh);
          pathStepMeshes.push(dotMesh);

          // Glow for done
          if (step.done) {
            const ring = new THREE.Mesh(
              new THREE.RingGeometry(0.8, 1.0, 24),
              new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
            );
            ring.position.copy(p);
            ring.userData = { type: 'pathStepHalo', ref: dotMesh };
            scene.add(ring);
          }
        });
      }
    });

    // ============ ORIGIN ============
    const originGroup = new THREE.Group();
    const originMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.7, roughness: 0.5
      })
    );
    originMesh.position.set(0, Y_ORIGIN, 0);
    originMesh.userData = { type: 'origin' };
    originGroup.add(originMesh);
    const oRing = new THREE.Mesh(
      new THREE.RingGeometry(3, 3.3, 64),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    oRing.rotation.x = Math.PI / 2;
    oRing.position.set(0, Y_ORIGIN, 0);
    originGroup.add(oRing);
    scene.add(originGroup);

    if (settings.showLabels) {
      const lbl = makeLabel('Origin', '#10b981', 0.9);
      lbl.position.set(0, Y_ORIGIN + 4, 0);
      scene.add(lbl);
    }

    // ============ PHASES (planets + 5 orbiting initiatives) ============
    const phaseObjects = [];
    const initiativeMeshes = [];

    (data.roadmap || []).forEach((phase, i) => {
      const y = Y_PHASES[i];
      const phaseColor = new THREE.Color(phase.color);
      const initiatives = phase.items || [];
      const leaves = countLeaves(initiatives);
      const phaseProgress = leaves.total > 0 ? leaves.done / leaves.total : 0;
      const phaseComplete = leaves.total > 0 && leaves.done === leaves.total;

      // Planet
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(3.5, 48, 48),
        new THREE.MeshStandardMaterial({
          color: phaseColor, emissive: phaseColor,
          emissiveIntensity: 0.4 + phaseProgress * 0.5,
          roughness: 0.3, metalness: 0.2
        })
      );
      orb.position.set(0, y, 0);
      orb.userData = { type: 'phase', phase, phaseIdx: i };
      scene.add(orb);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(phaseComplete ? 5.5 : 4.8, 32, 32),
        new THREE.MeshBasicMaterial({
          color: phaseColor, transparent: true,
          opacity: phaseComplete ? 0.18 : 0.1, side: THREE.BackSide
        })
      );
      halo.position.set(0, y, 0);
      scene.add(halo);

      // Orbital ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(8, 8.15, 64),
        new THREE.MeshBasicMaterial({
          color: phaseColor, transparent: true,
          opacity: phaseComplete ? 0.35 : 0.18, side: THREE.DoubleSide
        })
      );
      ring.rotation.x = Math.PI / 2 + 0.2;
      ring.position.set(0, y, 0);
      scene.add(ring);

      if (settings.showLabels) {
        const lbl = makeLabel(`P${phase.phase} · ${phase.title}`, phase.color, 0.85);
        lbl.position.set(0, y + 5.5, 0);
        scene.add(lbl);
      }

      // 5 ORBITING INITIATIVES (top 5 of phase.items)
      const orbiting = initiatives.slice(0, 5);
      const itemMeshGroup = [];
      orbiting.forEach((init, j) => {
        const itemAngle = (j / Math.max(orbiting.length, 1)) * Math.PI * 2;
        const orbitR = 8;
        const isNext = nextAction && nextAction.phase.id === phase.id && nextAction.item.id === init.id;
        const hasChildren = (init.children || []).length > 0;
        const childLeaves = countLeaves(init.children || []);
        const initComplete = init.done || (hasChildren && childLeaves.done === childLeaves.total && childLeaves.total > 0);

        const iMesh = new THREE.Mesh(
          new THREE.SphereGeometry(initComplete ? 1.0 : 0.75, 16, 16),
          new THREE.MeshStandardMaterial({
            color: phaseColor,
            emissive: phaseColor,
            emissiveIntensity: initComplete ? 1.0 : 0.4,
            roughness: initComplete ? 0.2 : 0.5,
            opacity: initComplete ? 1 : 0.85, transparent: true
          })
        );
        iMesh.position.set(Math.cos(itemAngle) * orbitR, y, Math.sin(itemAngle) * orbitR);
        iMesh.userData = {
          type: 'phaseItem', item: init, phase, phaseIdx: i, itemIdx: j,
          orbitR, orbitAngle: itemAngle, baseY: y, isNext
        };
        scene.add(iMesh);
        itemMeshGroup.push(iMesh);
        initiativeMeshes.push(iMesh);

        // Done halo
        if (initComplete) {
          const dHalo = new THREE.Mesh(
            new THREE.RingGeometry(1.2, 1.4, 32),
            new THREE.MeshBasicMaterial({ color: phaseColor, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
          );
          dHalo.userData = { type: 'doneHalo', itemRef: iMesh };
          scene.add(dHalo);
        }

        // Has children indicator: extra small ring
        if (hasChildren) {
          const subRing = new THREE.Mesh(
            new THREE.RingGeometry(1.5, 1.6, 24),
            new THREE.MeshBasicMaterial({ color: phaseColor, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
          );
          subRing.userData = { type: 'childRing', itemRef: iMesh };
          scene.add(subRing);
        }

        // Beacon for next
        if (isNext && settings.showBeacon) {
          const b1 = new THREE.Mesh(
            new THREE.RingGeometry(1.4, 1.7, 32),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
          );
          b1.userData = { type: 'beacon', itemRef: iMesh };
          scene.add(b1);
          const b2 = new THREE.Mesh(
            new THREE.RingGeometry(2.2, 2.5, 32),
            new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
          );
          b2.userData = { type: 'beacon2', itemRef: iMesh };
          scene.add(b2);
        }
      });

      // Indicator for overflow (initiatives beyond 5)
      if (initiatives.length > 5) {
        // Show small text overflow indicator
        if (settings.showLabels) {
          const overLabel = makeLabel(`+${initiatives.length - 5} more`, '#a1a1aa', 0.55);
          overLabel.position.set(0, y - 6, 0);
          scene.add(overLabel);
        }
      }

      phaseObjects.push({ orb, halo, items: itemMeshGroup, color: phaseColor, complete: phaseComplete });
    });

    // ============ VISION ============
    const visionMesh = new THREE.Mesh(
      new THREE.SphereGeometry(6, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24, emissive: 0xfbbf24, emissiveIntensity: 0.95,
        roughness: 0.15, metalness: 0.3
      })
    );
    visionMesh.position.set(0, Y_VISION, 0);
    visionMesh.userData = { type: 'vision', data: data.vision };
    scene.add(visionMesh);

    const vHalo = new THREE.Mesh(
      new THREE.SphereGeometry(8.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.12, side: THREE.BackSide })
    );
    vHalo.position.set(0, Y_VISION, 0);
    scene.add(vHalo);

    const vHalo2 = new THREE.Mesh(
      new THREE.SphereGeometry(11, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.04, side: THREE.BackSide })
    );
    vHalo2.position.set(0, Y_VISION, 0);
    scene.add(vHalo2);

    if (settings.showLabels) {
      const vLbl = makeLabel('Vision', '#fbbf24', 1.1);
      vLbl.position.set(0, Y_VISION + 8.5, 0);
      scene.add(vLbl);
    }

    // Branches orbit Vision
    const branchMeshes = [];
    const branchItemMeshes = [];
    (data.branches || []).forEach((branch, i) => {
      const angle = (i / data.branches.length) * Math.PI * 2;
      const orbitR = 16;
      const yOff = (i % 2 === 0 ? 1 : -1) * (2 + Math.random() * 3);
      const bColor = new THREE.Color(branch.color);

      const bMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.8, 32, 32),
        new THREE.MeshStandardMaterial({
          color: bColor, emissive: bColor, emissiveIntensity: 0.55, roughness: 0.4
        })
      );
      bMesh.position.set(Math.cos(angle) * orbitR, Y_VISION + yOff, Math.sin(angle) * orbitR);
      bMesh.userData = { type: 'branch', branch, branchIdx: i, orbitAngle: angle, orbitR, yOff };
      scene.add(bMesh);
      branchMeshes.push(bMesh);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, Y_VISION, 0), bMesh.position.clone()
      ]);
      const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: bColor, transparent: true, opacity: 0.2 }));
      line.userData = { type: 'branchLine', branchIdx: i };
      scene.add(line);

      branch.items.slice(0, 4).forEach((item, j) => {
        const ia = (j / Math.max(branch.items.length, 1)) * Math.PI * 2;
        const ir = 3.5;
        const iMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.5, 12, 12),
          new THREE.MeshStandardMaterial({ color: bColor, emissive: bColor, emissiveIntensity: 0.7 })
        );
        iMesh.position.set(
          bMesh.position.x + Math.cos(ia) * ir,
          bMesh.position.y + Math.sin(ia * 0.5),
          bMesh.position.z + Math.sin(ia) * ir
        );
        iMesh.userData = { type: 'branchItem', item, branch, branchIdx: i, itemIdx: j, orbitAngle: ia, orbitR: ir };
        scene.add(iMesh);
        branchItemMeshes.push(iMesh);
      });
    });

    // ============ CLIMBER ============
    const climberGroup = new THREE.Group();
    const climberMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    climberMesh.userData = { type: 'climber' };
    climberGroup.add(climberMesh);
    const cGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.35 })
    );
    climberGroup.add(cGlow);
    const cGlow2 = new THREE.Mesh(
      new THREE.SphereGeometry(2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.12 })
    );
    climberGroup.add(cGlow2);
    const climberPos = curve.getPoint(Math.max(progress, 0.005));
    climberGroup.position.copy(climberPos);
    scene.add(climberGroup);

    // ============ CAMERA STATE ============
    const camState = {
      yaw: 0.2, pitch: 0.05,
      targetYaw: 0.2, targetPitch: 0.05,
      lookY: ZONES.overview.lookY, camY: ZONES.overview.camY, dist: ZONES.overview.dist,
      targetLookY: ZONES.overview.lookY, targetCamY: ZONES.overview.camY, targetDist: ZONES.overview.dist,
    };

    function updateCameraPos() {
      const x = Math.sin(camState.yaw) * Math.cos(camState.pitch) * camState.dist;
      const z = Math.cos(camState.yaw) * Math.cos(camState.pitch) * camState.dist;
      const y = camState.camY + Math.sin(camState.pitch) * camState.dist;
      camera.position.set(x, y, z);
      camera.lookAt(0, camState.lookY, 0);
    }
    updateCameraPos();

    // ============ INTERACTIONS ============
    let isDragging = false, isPotentialClick = false;
    let prevX = 0, prevY = 0, downX = 0, downY = 0;
    let touchStartDist = 0, touchStartCamDist = 0;
    let lastTapTime = 0;

    const onDown = (e) => {
      const t = e.touches ? e.touches[0] : e;
      if (e.touches && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx * dx + dy * dy);
        touchStartCamDist = camState.targetDist;
        isDragging = false;
        return;
      }
      isDragging = true;
      isPotentialClick = true;
      prevX = downX = t.clientX;
      prevY = downY = t.clientY;
    };
    const onMove = (e) => {
      if (e.touches && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ratio = touchStartDist / dist;
        camState.targetDist = Math.max(15, Math.min(200, touchStartCamDist * ratio));
        e.preventDefault?.();
        return;
      }
      if (!isDragging) return;
      if (e.touches) e.preventDefault?.();
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - prevX;
      const dy = t.clientY - prevY;
      if (Math.abs(t.clientX - downX) > 5 || Math.abs(t.clientY - downY) > 5) isPotentialClick = false;
      camState.targetYaw -= dx * 0.005;
      camState.targetPitch = Math.max(-0.6, Math.min(0.6, camState.targetPitch + dy * 0.005));
      prevX = t.clientX;
      prevY = t.clientY;
    };
    const onUp = (e) => {
      if (isDragging && isPotentialClick) {
        const t = e.changedTouches ? e.changedTouches[0] : e;
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((t.clientX - rect.left) / rect.width) * 2 - 1,
          -((t.clientY - rect.top) / rect.height) * 2 + 1
        );
        const ray = new THREE.Raycaster();
        ray.setFromCamera(mouse, camera);
        const targets = [
          visionMesh, originMesh,
          ...branchMeshes, ...branchItemMeshes,
          ...phaseObjects.map(p => p.orb),
          ...initiativeMeshes,
          ...pathStepMeshes,
          climberMesh
        ];
        const hits = ray.intersectObjects(targets);
        if (hits.length > 0) {
          const ud = hits[0].object.userData;
          if (ud.type) onFocus(ud);
        } else {
          onFocus(null);
        }
      }
      isDragging = false;
      isPotentialClick = false;
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onUp);

    // WHEEL: pan vertically (no modifier), zoom (ctrl/cmd modifier)
    const onWheel = (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        camState.targetDist = Math.max(15, Math.min(200, camState.targetDist + e.deltaY * 0.15));
      } else {
        // Pan vertically through galaxy
        const panAmt = e.deltaY * 0.12;
        camState.targetCamY = Math.max(Y_MIN, Math.min(Y_MAX, camState.targetCamY - panAmt));
        camState.targetLookY = Math.max(Y_MIN, Math.min(Y_MAX, camState.targetLookY - panAmt));
      }
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation
    let frameId, time = 0;
    const animate = () => {
      time += 0.01;

      visionMesh.scale.setScalar(1 + Math.sin(time * 2) * 0.04);
      vHalo.scale.setScalar(1 + Math.sin(time * 1.5) * 0.05);
      vHalo2.scale.setScalar(1 + Math.sin(time * 1.2 + 1) * 0.08);

      branchMeshes.forEach((bm, i) => {
        bm.userData.orbitAngle += 0.002;
        bm.position.x = Math.cos(bm.userData.orbitAngle) * bm.userData.orbitR;
        bm.position.z = Math.sin(bm.userData.orbitAngle) * bm.userData.orbitR;
        bm.position.y = Y_VISION + bm.userData.yOff + Math.sin(time + i) * 0.3;
        const ln = scene.children.find(c => c.userData?.type === 'branchLine' && c.userData.branchIdx === i);
        if (ln) ln.geometry.setFromPoints([new THREE.Vector3(0, Y_VISION, 0), bm.position.clone()]);
      });

      branchItemMeshes.forEach((im) => {
        const ud = im.userData;
        const p = branchMeshes[ud.branchIdx];
        ud.orbitAngle += 0.005;
        im.position.x = p.position.x + Math.cos(ud.orbitAngle) * ud.orbitR;
        im.position.y = p.position.y + Math.sin(ud.orbitAngle * 0.5) * 0.8;
        im.position.z = p.position.z + Math.sin(ud.orbitAngle) * ud.orbitR;
      });

      phaseObjects.forEach((po, i) => {
        po.orb.scale.setScalar(1 + Math.sin(time * 1.5 + i * 0.7) * (po.complete ? 0.06 : 0.03));
        po.halo.scale.setScalar(1 + Math.sin(time * 1.2 + i) * 0.06);
      });

      initiativeMeshes.forEach((im) => {
        const ud = im.userData;
        ud.orbitAngle += 0.004;
        im.position.x = Math.cos(ud.orbitAngle) * ud.orbitR;
        im.position.y = ud.baseY + Math.sin(ud.orbitAngle * 0.7) * 0.5;
        im.position.z = Math.sin(ud.orbitAngle) * ud.orbitR;
      });

      // Aux meshes follow their refs
      scene.children.forEach(c => {
        if (c.userData?.itemRef) {
          c.position.copy(c.userData.itemRef.position);
          c.lookAt(camera.position);
          if (c.userData.type === 'doneHalo') c.rotateY(time * 0.5);
          if (c.userData.type === 'childRing') c.rotateY(-time * 0.7);
          if (c.userData.type === 'beacon') {
            c.scale.setScalar(1 + Math.sin(time * 4) * 0.2);
            c.material.opacity = 0.5 + Math.sin(time * 4) * 0.3;
          }
          if (c.userData.type === 'beacon2') {
            c.scale.setScalar(1 + Math.sin(time * 4 + 0.5) * 0.4);
            c.material.opacity = 0.2 + Math.sin(time * 4 + 0.5) * 0.2;
          }
          if (c.userData.type === 'pathStepHalo') c.rotateY(time * 0.4);
        }
      });

      originGroup.children[0].scale.setScalar(1 + Math.sin(time * 1.8) * 0.06);

      climberGroup.position.y = climberPos.y + Math.sin(time * 2) * 0.15;
      cGlow.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
      cGlow2.scale.setScalar(1 + Math.sin(time * 2.2 + 0.5) * 0.15);

      stars.rotation.y += 0.0001;

      if (!isDragging && settings.autoRotate) camState.targetYaw += 0.0005;

      camState.yaw += (camState.targetYaw - camState.yaw) * 0.1;
      camState.pitch += (camState.targetPitch - camState.pitch) * 0.1;
      camState.camY += (camState.targetCamY - camState.camY) * 0.08;
      camState.lookY += (camState.targetLookY - camState.lookY) * 0.08;
      camState.dist += (camState.targetDist - camState.dist) * 0.08;
      updateCameraPos();

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    sceneApiRef.current.flyTo = (zone) => {
      const z = ZONES[zone];
      if (!z) return;
      camState.targetCamY = z.camY;
      camState.targetLookY = z.lookY;
      camState.targetDist = z.dist;
      camState.targetYaw = z.yaw;
      camState.targetPitch = z.pitch;
    };
    sceneApiRef.current.getScrollPos = () => {
      return (camState.lookY - Y_MIN) / (Y_MAX - Y_MIN);
    };
    sceneApiRef.current.setScrollPos = (frac) => {
      const y = Y_MIN + frac * (Y_MAX - Y_MIN);
      camState.targetCamY = y;
      camState.targetLookY = y;
    };

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('wheel', onWheel);
      if (mount && renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [data, settings.showLabels, settings.showBeacon, settings.autoRotate]);

  return <div ref={mountRef} className="absolute inset-0" />;
}

/* ==================== TOP BAR ==================== */
function TopBar({ stats, savedFlash, metrics, onSettings, onMetrics, onJournal, toggleSetting, autoRotate }) {
  const mrrPct = Math.min(1, (metrics.mrr || 0) / (metrics.targetMrr || 10000));
  return (
    <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-xl bg-zinc-950/70 border-b border-zinc-900/80">
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-3.5 h-3.5 text-zinc-950" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold tracking-tight leading-none truncate">Cosmic Galaxy</div>
              <div className="text-[9px] text-zinc-400 mt-0.5 font-mono uppercase tracking-wider">
                {stats.done}/{stats.total} · {Math.round(stats.progress * 100)}% · {stats.weeksIn}w in
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {savedFlash && (
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 fade-in font-mono uppercase tracking-wider px-1">
                <Check className="w-2.5 h-2.5" />
                Saved
              </div>
            )}
            <IconButton onClick={onMetrics} icon={TrendingUp} title="Metrics" />
            <IconButton onClick={onJournal} icon={BookOpen} title="Journal" />
            <IconButton onClick={() => toggleSetting('autoRotate')} icon={autoRotate ? Pause : Play} title={autoRotate ? 'Pause' : 'Play'} />
            <IconButton onClick={onSettings} icon={Settings} title="Settings" />
          </div>
        </div>
        <div className="mt-2 h-1 bg-zinc-900 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-fuchsia-500 transition-all duration-700" style={{ width: `${stats.progress * 100}%` }} />
          {mrrPct > 0 && (
            <div className="absolute top-0 h-full w-0.5 bg-emerald-400 shadow-lg shadow-emerald-400/50" style={{ left: `${mrrPct * 100}%` }} />
          )}
        </div>
      </div>
    </div>
  );
}

function IconButton({ onClick, icon: Icon, title }) {
  return (
    <button onClick={onClick} title={title} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

/* ==================== TODAY PANEL ==================== */
function TodayPanel({ nextActions, stats, collapsed, setCollapsed, onToggleDone, onFocus, flyToNextAction }) {
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute left-3 top-20 z-20 w-9 h-9 rounded-lg backdrop-blur-md bg-zinc-900/80 border border-zinc-800 flex items-center justify-center hover:border-amber-500/50 transition-colors"
      >
        <Zap className="w-3.5 h-3.5 text-amber-400" />
      </button>
    );
  }
  return (
    <div className="absolute left-3 top-20 z-20 w-64 max-w-[calc(100vw-100px)] slide-in-left">
      <div className="backdrop-blur-xl bg-zinc-950/80 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-400">Next Up</span>
          </div>
          <button onClick={() => setCollapsed(true)} className="p-0.5 text-zinc-500 hover:text-zinc-300">
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>
        {nextActions.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs text-zinc-300 font-medium">All done</div>
            <div className="text-[10px] text-zinc-500 mt-1">Add more milestones</div>
          </div>
        ) : (
          <div className="p-2 space-y-1.5">
            {nextActions.map((na, idx) => (
              <div
                key={na.item.id}
                className={`group flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${idx === 0 ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-zinc-900/40 hover:bg-zinc-900/80 border border-transparent'}`}
                onClick={() => onFocus(na.item, na.phase, na.kind)}
              >
                <button onClick={(e) => { e.stopPropagation(); onToggleDone(na.item.id, !na.item.done); }} className="flex-shrink-0 mt-0.5">
                  <Circle className="w-3.5 h-3.5 text-zinc-600 hover:text-emerald-400 transition-colors" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-100 leading-tight">{na.item.text}</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider mt-1" style={{ color: na.phase.color }}>
                    {na.kind === 'step' ? 'Step' : 'Initiative'} · P{na.phase.phase}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={flyToNextAction} className="w-full mt-1 px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-colors">
              <CornerUpRight className="w-3 h-3" />
              Fly to next
            </button>
          </div>
        )}
        <div className="px-3 py-2 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider">
          <span className="text-zinc-500">Velocity</span>
          <span className={stats.velocity > 0 ? 'text-emerald-400' : 'text-zinc-500'}>+{stats.velocity} this week</span>
        </div>
      </div>
    </div>
  );
}

/* ==================== ZONE NAV ==================== */
function ZoneNav({ flyTo, addMilestone }) {
  const [active, setActive] = useState('overview');
  const zones = [
    { key: 'vision', label: 'Vision', icon: Sparkles, color: '#fbbf24' },
    { key: 'phase4', label: 'Phase 4', icon: Flag, color: '#a855f7' },
    { key: 'phase3', label: 'Phase 3', icon: Flag, color: '#ec4899' },
    { key: 'phase2', label: 'Phase 2', icon: Flag, color: '#f97316' },
    { key: 'phase1', label: 'Phase 1', icon: Flag, color: '#f59e0b' },
    { key: 'overview', label: 'Overview', icon: Compass, color: '#94a3b8' },
    { key: 'origin', label: 'Origin', icon: Target, color: '#10b981' },
  ];
  const handle = (k) => { setActive(k); flyTo(k); };
  return (
    <div className="absolute right-9 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1">
      {zones.map(z => {
        const Icon = z.icon;
        const a = active === z.key;
        return (
          <button key={z.key} onClick={() => handle(z.key)} className="group flex items-center justify-end gap-1.5">
            <span className={`text-[9px] font-mono uppercase tracking-wider transition-opacity ${a ? 'opacity-100 text-zinc-100' : 'opacity-0 group-hover:opacity-60 text-zinc-400'}`}>{z.label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md border transition-all ${a ? 'bg-zinc-900/95 scale-110' : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'}`}
              style={a ? { borderColor: z.color + '90', boxShadow: `0 0 20px -5px ${z.color}80` } : {}}>
              <Icon className="w-3.5 h-3.5" style={{ color: a ? z.color : '#71717a' }} strokeWidth={a ? 2.5 : 2} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ==================== SCROLL INDICATOR ==================== */
function ScrollIndicator({ sceneApiRef }) {
  const [pos, setPos] = useState(0.5);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    let id;
    const tick = () => {
      const p = sceneApiRef.current.getScrollPos?.();
      if (typeof p === 'number' && !dragging) setPos(Math.max(0, Math.min(1, p)));
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(id);
  }, [dragging, sceneApiRef]);

  const handleStart = (e) => {
    setDragging(true);
    const onMove = (ev) => {
      const t = ev.touches ? ev.touches[0] : ev;
      const rect = trackRef.current.getBoundingClientRect();
      const frac = 1 - Math.max(0, Math.min(1, (t.clientY - rect.top) / rect.height));
      setPos(frac);
      sceneApiRef.current.setScrollPos?.(frac);
    };
    const onEnd = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    onMove(e);
  };

  return (
    <div className="absolute right-3 top-32 bottom-32 z-10 w-2 flex flex-col items-center">
      <div
        ref={trackRef}
        className="w-1 h-full rounded-full bg-zinc-900/60 relative cursor-pointer"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50 cursor-grab"
          style={{ top: `${(1 - pos) * 100}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>
    </div>
  );
}

/* ==================== INFO CARD ==================== */
function InfoCard(props) {
  const { focused } = props;
  return (
    <div className="absolute bottom-3 left-3 right-14 sm:right-20 z-30 slide-up">
      <div className="backdrop-blur-xl bg-zinc-950/95 border rounded-2xl p-4 shadow-2xl max-h-[60vh] overflow-y-auto scrollbar-thin"
        style={{
          borderColor:
            focused.type === 'vision' ? '#fbbf24aa' :
            focused.type === 'origin' ? '#10b981aa' :
            focused.type === 'climber' ? '#fbbf24aa' :
            focused.type === 'branch' || focused.type === 'branchItem' ? (focused.branch?.color || '#fff') + 'aa' :
            (focused.phase?.color || '#fff') + 'aa'
        }}
      >
        <button onClick={props.onClose} className="absolute top-2 right-2 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900 z-10">
          <X className="w-3.5 h-3.5" />
        </button>
        {focused.type === 'vision' && <VisionCard {...props} />}
        {focused.type === 'origin' && <OriginCard {...props} />}
        {focused.type === 'climber' && <ClimberCard {...props} />}
        {focused.type === 'phase' && <PhaseCard {...props} />}
        {focused.type === 'phaseItem' && <InitiativeCard {...props} />}
        {focused.type === 'pathStep' && <PathStepCard {...props} />}
        {focused.type === 'branch' && <BranchCard {...props} />}
        {focused.type === 'branchItem' && <BranchItemCard {...props} />}
      </div>
    </div>
  );
}

function EditableText({ value, onChange, multiline, className = '', displayClass = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const save = () => { if (draft.trim() !== value) onChange(draft.trim()); setEditing(false); };
  if (editing) {
    if (multiline) return (
      <textarea autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={save}
        onKeyDown={e => { if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
        rows={3} className={`w-full bg-zinc-900 border border-amber-500/50 rounded-lg p-2 text-sm focus:outline-none resize-none ${className}`} />
    );
    return (
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={save}
        onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
        className={`w-full bg-zinc-900 border border-amber-500/50 rounded-lg px-2 py-1 text-sm focus:outline-none ${className}`} />
    );
  }
  return (
    <span onClick={() => setEditing(true)} className={`cursor-text hover:bg-zinc-900/60 rounded px-1 -mx-1 ${displayClass}`}>
      {value || <span className="text-zinc-600 italic">Tap to edit</span>}
    </span>
  );
}

function VisionCard({ focused, data, updateVision }) {
  const v = data.vision;
  return (
    <>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 mb-2">The Summit · North Star</div>
      <div className="font-display text-lg font-semibold mb-3">Vision</div>
      <div className="space-y-3">
        {['building', 'direction', 'outcome'].map(field => (
          <div key={field}>
            <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1">{field}</div>
            <div className={`text-sm leading-relaxed ${field === 'outcome' ? 'text-amber-300 font-medium' : field === 'direction' ? 'text-zinc-300 italic' : 'text-zinc-200'}`}>
              <EditableText value={v[field]} onChange={x => updateVision({ [field]: x })} multiline />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function OriginCard({ stats }) {
  return (
    <>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-1">Origin</div>
      <div className="font-display text-lg font-semibold mb-2">Where you started</div>
      <p className="text-sm text-zinc-300 leading-relaxed mb-3">
        Launched {stats.daysIn} {stats.daysIn === 1 ? 'day' : 'days'} ago. 2-man team. The launchpad.
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">Days</div>
          <div className="font-display text-lg font-bold text-emerald-300">{stats.daysIn}</div>
        </div>
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">Weeks</div>
          <div className="font-display text-lg font-bold text-emerald-300">{stats.weeksIn}</div>
        </div>
      </div>
    </>
  );
}

function ClimberCard({ stats, flyToNextAction }) {
  return (
    <>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 mb-1">You Are Here</div>
      <div className="font-display text-2xl font-bold mb-1">{Math.round(stats.progress * 100)}%</div>
      <div className="text-sm text-zinc-300 mb-3">{stats.done} of {stats.total} to the summit</div>
      <button onClick={flyToNextAction} className="w-full py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors">
        <CornerUpRight className="w-3.5 h-3.5" />
        Jump to next
      </button>
    </>
  );
}

function PhaseCard(props) {
  const { focused, updatePhase, addRootNode, updateNode, deleteNode, deletePhase, setFocused, data } = props;
  const phase = focused.phase;
  const [tab, setTab] = useState('initiatives');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const initLeaves = countLeaves(phase.items || []);
  const stepLeaves = countLeaves(phase.pathSteps || []);
  const totalLeaves = initLeaves.total + stepLeaves.total;
  const doneLeaves = initLeaves.done + stepLeaves.done;
  const pct = totalLeaves ? Math.round((doneLeaves / totalLeaves) * 100) : 0;

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: phase.color }}>
          Phase {phase.phase} ·{' '}
          <EditableText value={phase.timeframe} onChange={v => updatePhase(phase.id, { timeframe: v })} displayClass="text-zinc-400 normal-case tracking-normal" />
        </div>
        <div className="font-display text-sm font-bold" style={{ color: phase.color }}>{pct}%</div>
      </div>
      <div className="font-display text-lg font-semibold mb-2">
        <EditableText value={phase.title} onChange={v => updatePhase(phase.id, { title: v })} />
      </div>
      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: phase.color }} />
      </div>

      <div className="flex gap-1 mb-3 p-0.5 bg-zinc-900 rounded-lg">
        <TabBtn active={tab === 'initiatives'} onClick={() => setTab('initiatives')} label={`Orbiting · ${phase.items.length}`} sub="What to build" />
        <TabBtn active={tab === 'steps'} onClick={() => setTab('steps')} label={`Path · ${phase.pathSteps.length}`} sub="How to get here" />
      </div>

      {tab === 'initiatives' && (
        <>
          <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            Top 5 orbit the planet. Drag the others up.
          </div>
          <NodeList
            items={phase.items}
            color={phase.color}
            highlightTop={5}
            onUpdate={(id, ch) => updateNode(id, ch)}
            onDelete={(id) => deleteNode(id)}
            onAdd={(text) => addRootNode(phase.id, 'items', text)}
            onAddChild={(parentId, text) => props.addChild(parentId, text)}
            onFocus={(item) => setFocused({ type: 'phaseItem', item, phase })}
            addLabel="Add initiative"
          />
        </>
      )}

      {tab === 'steps' && (
        <>
          <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            Dots on the path between planets. The tactical steps.
          </div>
          <NodeList
            items={phase.pathSteps}
            color={phase.color}
            onUpdate={(id, ch) => updateNode(id, ch)}
            onDelete={(id) => deleteNode(id)}
            onAdd={(text) => addRootNode(phase.id, 'pathSteps', text)}
            onAddChild={(parentId, text) => props.addChild(parentId, text)}
            onFocus={(item) => setFocused({ type: 'pathStep', item, phase })}
            addLabel="Add path step"
          />
        </>
      )}

      <div className="mt-4 pt-3 border-t border-zinc-900">
        {confirmDelete ? (
          <div className="space-y-1.5">
            <p className="text-[10px] text-red-400">Delete this entire phase and everything in it?</p>
            <div className="flex gap-1.5">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 px-2 py-1.5 rounded bg-zinc-900 text-[10px]">Cancel</button>
              <button onClick={() => deletePhase(phase.id)} className="flex-1 px-2 py-1.5 rounded bg-red-500/30 text-red-200 text-[10px] font-semibold">Delete</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="text-[9px] font-mono uppercase tracking-wider text-zinc-600 hover:text-red-400 flex items-center gap-1">
            <Trash2 className="w-2.5 h-2.5" />
            Remove this milestone
          </button>
        )}
      </div>
    </>
  );
}

function TabBtn({ active, onClick, label, sub }) {
  return (
    <button onClick={onClick} className={`flex-1 px-2 py-1.5 rounded text-left transition-colors ${active ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}`}>
      <div className={`text-[10px] font-mono uppercase tracking-wider ${active ? 'text-zinc-100' : 'text-zinc-400'}`}>{label}</div>
      <div className="text-[8px] text-zinc-500 mt-0.5">{sub}</div>
    </button>
  );
}

function InitiativeCard(props) {
  const { focused, updateNode, deleteNode, addChild, setFocused, data, moveNode } = props;
  const { item, phase } = focused;
  const [showMove, setShowMove] = useState(false);

  return (
    <>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1" style={{ color: phase.color }}>
        Orbiting · Phase {phase.phase}
      </div>
      <div className="flex items-start gap-2 mb-3">
        <button onClick={() => updateNode(item.id, { done: !item.done })} className="mt-0.5 flex-shrink-0">
          {item.done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-zinc-500 hover:text-emerald-400" />}
        </button>
        <div className={`text-sm leading-relaxed flex-1 ${item.done ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
          <EditableText value={item.text} onChange={t => updateNode(item.id, { text: t })} multiline />
        </div>
      </div>

      <div className="mb-3">
        <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Notes</div>
        <textarea value={item.notes || ''} onChange={e => updateNode(item.id, { notes: e.target.value })}
          placeholder="Context, links, blockers…" rows={2}
          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none" />
      </div>

      {/* Off-shoots (children) */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1">
            <GitBranch className="w-2.5 h-2.5" />
            Off-shoots ({(item.children || []).length})
          </div>
        </div>
        <ChildTree
          children={item.children || []}
          color={phase.color}
          onUpdate={(id, ch) => updateNode(id, ch)}
          onDelete={(id) => deleteNode(id)}
          onAddChild={(parentId, text) => addChild(parentId, text)}
          onAddRoot={(text) => addChild(item.id, text)}
        />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setShowMove(!showMove)} className="flex-1 px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 flex items-center justify-center gap-1">
          <Move className="w-3 h-3" />
          Move
        </button>
        <button onClick={() => deleteNode(item.id)} className="flex-1 px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[10px] font-mono uppercase tracking-wider text-red-400 flex items-center justify-center gap-1">
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>

      {showMove && (
        <div className="mt-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 fade-in space-y-1">
          <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Move to:</div>
          {data.roadmap.map(p => (
            <div key={p.id} className="space-y-0.5">
              <button
                onClick={() => { moveNode(item.id, p.id, 'items'); setShowMove(false); setFocused(null); }}
                className="w-full text-left px-2 py-1 rounded text-xs hover:bg-zinc-800 flex items-center gap-2"
                disabled={p.id === phase.id}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="flex-1">P{p.phase} initiative</span>
              </button>
              <button
                onClick={() => { moveNode(item.id, p.id, 'pathSteps'); setShowMove(false); setFocused(null); }}
                className="w-full text-left px-2 py-1 rounded text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-400"
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="flex-1">→ P{p.phase} path step</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function PathStepCard(props) {
  const { focused, updateNode, deleteNode, addChild, data, moveNode, setFocused } = props;
  const { item, phase } = focused;
  const [showMove, setShowMove] = useState(false);

  return (
    <>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1" style={{ color: phase.color }}>
        Path Step · Toward P{phase.phase}
      </div>
      <div className="flex items-start gap-2 mb-3">
        <button onClick={() => updateNode(item.id, { done: !item.done })} className="mt-0.5 flex-shrink-0">
          {item.done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-zinc-500 hover:text-emerald-400" />}
        </button>
        <div className={`text-sm leading-relaxed flex-1 ${item.done ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
          <EditableText value={item.text} onChange={t => updateNode(item.id, { text: t })} multiline />
        </div>
      </div>

      <div className="mb-3">
        <textarea value={item.notes || ''} onChange={e => updateNode(item.id, { notes: e.target.value })}
          placeholder="Notes…" rows={2}
          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none" />
      </div>

      <div className="mb-3">
        <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1">
          <GitBranch className="w-2.5 h-2.5" />
          Sub-steps ({(item.children || []).length})
        </div>
        <ChildTree
          children={item.children || []}
          color={phase.color}
          onUpdate={(id, ch) => updateNode(id, ch)}
          onDelete={(id) => deleteNode(id)}
          onAddChild={(parentId, text) => addChild(parentId, text)}
          onAddRoot={(text) => addChild(item.id, text)}
        />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setShowMove(!showMove)} className="flex-1 px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 flex items-center justify-center gap-1">
          <Move className="w-3 h-3" />
          Move
        </button>
        <button onClick={() => deleteNode(item.id)} className="flex-1 px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[10px] font-mono uppercase tracking-wider text-red-400 flex items-center justify-center gap-1">
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>

      {showMove && (
        <div className="mt-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 fade-in space-y-0.5">
          <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Move to:</div>
          {data.roadmap.map(p => (
            <div key={p.id}>
              <button onClick={() => { moveNode(item.id, p.id, 'pathSteps'); setShowMove(false); setFocused(null); }}
                className="w-full text-left px-2 py-1 rounded text-xs hover:bg-zinc-800 flex items-center gap-2" disabled={p.id === phase.id}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span>P{p.phase} path</span>
              </button>
              <button onClick={() => { moveNode(item.id, p.id, 'items'); setShowMove(false); setFocused(null); }}
                className="w-full text-left px-2 py-1 rounded text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-400">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span>→ P{p.phase} initiative</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function BranchCard(props) {
  const { focused, updateBranch, updateNode, deleteNode, addChild } = props;
  const branch = focused.branch;
  return (
    <>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1" style={{ color: branch.color }}>
        Branch · {branch.items.length} thoughts
      </div>
      <div className="font-display text-lg font-semibold mb-1">
        <EditableText value={branch.name} onChange={v => updateBranch(branch.id, { name: v })} />
      </div>
      <div className="text-xs text-zinc-400 italic mb-3">
        <EditableText value={branch.tagline} onChange={v => updateBranch(branch.id, { tagline: v })} />
      </div>
      <ChildTree
        children={branch.items}
        color={branch.color}
        onUpdate={(id, ch) => updateNode(id, ch)}
        onDelete={(id) => deleteNode(id)}
        onAddChild={(parentId, text) => addChild(parentId, text)}
        onAddRoot={(text) => props.addRootNode(branch.id, 'items', text)}
        hideToggleDone
      />
    </>
  );
}

function BranchItemCard(props) {
  const { focused, updateNode, deleteNode, addChild } = props;
  const { item, branch } = focused;
  return (
    <>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: branch.color }}>
        {branch.name}
      </div>
      <div className="text-sm text-zinc-200 leading-relaxed mb-3">
        <EditableText value={item.text} onChange={t => updateNode(item.id, { text: t })} multiline />
      </div>
      <textarea value={item.notes || ''} onChange={e => updateNode(item.id, { notes: e.target.value })}
        placeholder="Notes…" rows={2}
        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none mb-3" />
      <div className="mb-3">
        <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Off-shoots ({(item.children || []).length})</div>
        <ChildTree
          children={item.children || []}
          color={branch.color}
          onUpdate={(id, ch) => updateNode(id, ch)}
          onDelete={(id) => deleteNode(id)}
          onAddChild={(parentId, text) => addChild(parentId, text)}
          onAddRoot={(text) => addChild(item.id, text)}
          hideToggleDone
        />
      </div>
      <button onClick={() => deleteNode(item.id)} className="w-full px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[10px] font-mono uppercase tracking-wider text-red-400 flex items-center justify-center gap-1">
        <Trash2 className="w-3 h-3" />
        Delete
      </button>
    </>
  );
}

/* ==================== NODE LIST + CHILD TREE (RECURSIVE) ==================== */
function NodeList({ items, color, highlightTop, onUpdate, onDelete, onAdd, onAddChild, onFocus, addLabel }) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const handleAdd = () => { if (newText.trim()) { onAdd(newText.trim()); setNewText(''); setAdding(false); } };

  return (
    <div className="space-y-1">
      {items.map((it, idx) => (
        <NodeRow
          key={it.id}
          item={it}
          color={color}
          isTop={highlightTop && idx < highlightTop}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddChild={onAddChild}
          onFocus={onFocus}
          depth={0}
        />
      ))}
      {adding ? (
        <div className="flex gap-2 fade-in">
          <input autoFocus value={newText} onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAdding(false); setNewText(''); } }}
            placeholder="New entry…"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500" />
          <button onClick={handleAdd} className="px-2 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-semibold">Add</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
          <Plus className="w-3 h-3" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

function NodeRow({ item, color, isTop, onUpdate, onDelete, onAddChild, onFocus, depth }) {
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newChild, setNewChild] = useState('');
  const hasKids = (item.children || []).length > 0;
  const childCount = countLeaves(item.children || []);

  const handleAddChild = () => {
    if (newChild.trim()) { onAddChild(item.id, newChild.trim()); setNewChild(''); setAdding(false); setExpanded(true); }
  };

  return (
    <div>
      <div
        className={`group flex items-start gap-2 p-1.5 rounded-lg border transition-colors ${
          isTop ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-900/30 border-transparent hover:border-zinc-900'
        }`}
        style={isTop ? { borderColor: color + '40' } : {}}
      >
        <button onClick={() => onUpdate(item.id, { done: !item.done })} className="flex-shrink-0 mt-0.5">
          {item.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-400" />}
        </button>
        {hasKids && (
          <button onClick={() => setExpanded(!expanded)} className="flex-shrink-0 mt-0.5">
            <ChevronRight className={`w-3 h-3 text-zinc-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        )}
        <div className={`flex-1 min-w-0 text-xs leading-relaxed cursor-pointer ${item.done ? 'line-through text-zinc-600' : 'text-zinc-200'}`}
          onClick={() => onFocus(item)}>
          {item.text}
          {hasKids && (
            <span className="ml-1.5 text-[9px] font-mono text-zinc-600">{childCount.done}/{childCount.total}</span>
          )}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setAdding(true)} className="p-0.5 text-zinc-600 hover:text-amber-400" title="Add off-shoot">
            <GitBranch className="w-2.5 h-2.5" />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-0.5 text-zinc-600 hover:text-red-400">
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {adding && (
        <div className="ml-7 mt-1 flex gap-2 fade-in">
          <input autoFocus value={newChild} onChange={e => setNewChild(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddChild(); if (e.key === 'Escape') { setAdding(false); setNewChild(''); } }}
            placeholder="Sub-step…"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-amber-500" />
          <button onClick={handleAddChild} className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-semibold">Add</button>
        </div>
      )}

      {expanded && hasKids && (
        <div className="ml-7 mt-1 space-y-1 border-l border-zinc-800 pl-2 fade-in">
          {item.children.map(child => (
            <NodeRow
              key={child.id}
              item={child}
              color={color}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onFocus={onFocus}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChildTree({ children, color, onUpdate, onDelete, onAddChild, onAddRoot, hideToggleDone }) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const handleAdd = () => { if (newText.trim()) { onAddRoot(newText.trim()); setNewText(''); setAdding(false); } };

  return (
    <div className="space-y-1">
      {children.map(child => (
        <NodeRow
          key={child.id}
          item={child}
          color={color}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddChild={onAddChild}
          onFocus={() => {}}
          depth={0}
        />
      ))}
      {adding ? (
        <div className="flex gap-2 fade-in">
          <input autoFocus value={newText} onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAdding(false); setNewText(''); } }}
            placeholder="Add off-shoot…"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-amber-500" />
          <button onClick={handleAdd} className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-semibold">Add</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full flex items-center justify-center gap-1 py-1 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 text-[9px] font-mono uppercase tracking-wider">
          <Plus className="w-2.5 h-2.5" />
          Off-shoot
        </button>
      )}
    </div>
  );
}

/* ==================== QUICK CAPTURE ==================== */
function QuickCaptureModal({ data, onClose, addNote, addReflection, addRoot, addBranchRoot }) {
  const [text, setText] = useState('');
  const [destination, setDestination] = useState('brain-dump');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = () => {
    if (!text.trim()) return;
    if (destination === 'brain-dump') addNote(text.trim());
    else if (destination === 'reflection') addReflection(text.trim());
    else if (destination.startsWith('phI:')) addRoot(destination.slice(4), 'items', text.trim());
    else if (destination.startsWith('phS:')) addRoot(destination.slice(4), 'pathSteps', text.trim());
    else if (destination.startsWith('br:')) addBranchRoot(destination.slice(3), text.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 fade-in" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 mb-0.5">Quick Capture</div>
            <div className="font-display text-base font-semibold">What's in your head?</div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-3">
          <textarea autoFocus value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave(); if (e.key === 'Escape') onClose(); }}
            placeholder="Idea, action, doubt, reminder…" rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 rounded-xl p-3 text-sm focus:outline-none resize-none" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Send to</div>
            <div className="flex flex-wrap gap-1.5">
              <ChipBtn active={destination === 'brain-dump'} onClick={() => setDestination('brain-dump')} icon={FileText} label="Brain Dump" color="#94a3b8" />
              <ChipBtn active={destination === 'reflection'} onClick={() => setDestination('reflection')} icon={BookOpen} label="Reflection" color="#06b6d4" />
              <ChipBtn active={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)} icon={ChevronDown} label="Specific…" color="#a78bfa" />
            </div>
            {showAdvanced && (
              <div className="mt-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 fade-in max-h-48 overflow-y-auto scrollbar-thin space-y-3">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Phase initiatives (orbit)</div>
                  {data.roadmap.map(p => (
                    <button key={'I' + p.id} onClick={() => setDestination('phI:' + p.id)} className={`w-full text-left px-2 py-1 rounded text-xs flex items-center gap-2 ${destination === 'phI:' + p.id ? 'bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-800/60 text-zinc-300'}`}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      P{p.phase}: {p.title}
                    </button>
                  ))}
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Path steps</div>
                  {data.roadmap.map(p => (
                    <button key={'S' + p.id} onClick={() => setDestination('phS:' + p.id)} className={`w-full text-left px-2 py-1 rounded text-xs flex items-center gap-2 ${destination === 'phS:' + p.id ? 'bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-800/60 text-zinc-300'}`}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                      → P{p.phase} path
                    </button>
                  ))}
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Branches</div>
                  {data.branches.map(b => (
                    <button key={b.id} onClick={() => setDestination('br:' + b.id)} className={`w-full text-left px-2 py-1 rounded text-xs flex items-center gap-2 ${destination === 'br:' + b.id ? 'bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-800/60 text-zinc-300'}`}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300">Cancel</button>
            <button onClick={handleSave} disabled={!text.trim()} className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-zinc-950 text-sm font-semibold flex items-center justify-center gap-1.5">
              <Save className="w-3.5 h-3.5" />
              Capture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipBtn({ active, onClick, icon: Icon, label, color }) {
  return (
    <button onClick={onClick} className={`px-2.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border flex items-center gap-1 transition-all ${active ? 'border-transparent text-zinc-950' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'}`} style={active ? { background: color } : {}}>
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}

/* ==================== METRICS MODAL ==================== */
function MetricsModal({ metrics, stats, updateMetrics, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 fade-in" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400 mb-0.5">Metrics</div>
            <div className="font-display text-base font-semibold">The numbers</div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-3">
          <MetricEditor icon={DollarSign} label="MRR" value={metrics.mrr} target={metrics.targetMrr}
            onChangeValue={v => updateMetrics({ mrr: v })} onChangeTarget={v => updateMetrics({ targetMrr: v })}
            prefix="$" color="#10b981" />
          <MetricEditor icon={Users} label="Clients" value={metrics.clients} target={metrics.targetClients}
            onChangeValue={v => updateMetrics({ clients: v })} onChangeTarget={v => updateMetrics({ targetClients: v })}
            color="#06b6d4" />
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Time</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><div className="font-display text-xl font-bold text-zinc-100">{stats.daysIn}</div><div className="text-[9px] font-mono uppercase text-zinc-500">Days</div></div>
              <div><div className="font-display text-xl font-bold text-zinc-100">{stats.weeksIn}</div><div className="text-[9px] font-mono uppercase text-zinc-500">Weeks</div></div>
              <div><div className={`font-display text-xl font-bold ${stats.velocity > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>+{stats.velocity}</div><div className="text-[9px] font-mono uppercase text-zinc-500">7d Vel</div></div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Start Date</div>
            <input type="date" value={metrics.startDate} onChange={e => updateMetrics({ startDate: e.target.value })}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricEditor({ icon: Icon, label, value, target, onChangeValue, onChangeTarget, prefix = '', color }) {
  const pct = target ? Math.min(1, value / target) : 0;
  return (
    <div className="p-3 rounded-xl border" style={{ borderColor: color + '40', background: `linear-gradient(180deg, ${color}08, transparent)` }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" style={{ color }} />
        <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color }}>{label}</div>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="font-display text-2xl font-bold text-zinc-100">
          {prefix}<NumberInput value={value} onChange={onChangeValue} />
        </span>
        <span className="text-xs text-zinc-500">/ {prefix}<NumberInput value={target || 0} onChange={onChangeTarget} /></span>
      </div>
      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${pct * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function NumberInput({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  if (editing) return (
    <input autoFocus type="number" value={draft} onChange={e => setDraft(e.target.value)}
      onBlur={() => { onChange(Number(draft) || 0); setEditing(false); }}
      onKeyDown={e => { if (e.key === 'Enter') { onChange(Number(draft) || 0); setEditing(false); } }}
      className="bg-transparent border-b border-amber-500 w-20 focus:outline-none" />
  );
  return <span onClick={() => setEditing(true)} className="cursor-text hover:bg-zinc-900/60 rounded px-0.5">{value.toLocaleString()}</span>;
}

/* ==================== JOURNAL MODAL (with note promotion) ==================== */
function JournalModal({ data, addReflection, deleteReflection, promoteNote, onClose }) {
  const [tab, setTab] = useState('reflections');
  const [newRef, setNewRef] = useState('');
  const [promoting, setPromoting] = useState(null); // note being promoted

  const handleSave = () => {
    if (!newRef.trim()) return;
    addReflection(newRef.trim());
    setNewRef('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 fade-in" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-0.5">Journal</div>
            <div className="font-display text-base font-semibold">History & raw thoughts</div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex gap-1 px-4 pt-3">
          <JournalTab active={tab === 'reflections'} onClick={() => setTab('reflections')} label="Reflections" count={data.reflections.length} />
          <JournalTab active={tab === 'notes'} onClick={() => setTab('notes')} label="Brain Dump" count={data.notes.length} />
          <JournalTab active={tab === 'log'} onClick={() => setTab('log')} label="Done Log" count={data.completionLog.length} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {tab === 'reflections' && (
            <div className="space-y-2">
              <div className="space-y-1.5 mb-3">
                <textarea value={newRef} onChange={e => setNewRef(e.target.value)} placeholder="What did you learn? What changed?" rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg p-2.5 text-sm focus:outline-none resize-none" />
                <button onClick={handleSave} disabled={!newRef.trim()} className="w-full px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-40 text-cyan-300 text-xs font-mono uppercase tracking-wider">
                  Save reflection
                </button>
              </div>
              {data.reflections.length === 0 ? (
                <div className="text-center py-6 text-zinc-600 text-xs">No reflections yet.</div>
              ) : (
                data.reflections.map(r => (
                  <div key={r.id} className="group p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 fade-in">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap flex-1">{r.text}</p>
                      <button onClick={() => deleteReflection(r.id)} className="p-0.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-600 mt-1.5">
                      {new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'notes' && (
            <div className="space-y-2">
              {data.notes.length === 0 ? (
                <div className="text-center py-6 text-zinc-600 text-xs">No brain dumps yet. Use Quick Capture (+).</div>
              ) : (
                data.notes.map(n => (
                  <div key={n.id} className="group p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                    <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap mb-2">{n.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-600">
                        {new Date(n.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                      <button onClick={() => setPromoting(n)} className="text-[9px] font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1">
                        <Workflow className="w-2.5 h-2.5" />
                        Promote
                      </button>
                    </div>
                    {promoting?.id === n.id && (
                      <div className="mt-2 p-2 rounded-lg bg-zinc-900 border border-amber-500/30 fade-in space-y-1">
                        <div className="text-[9px] font-mono uppercase tracking-wider text-amber-400 mb-1">Send to:</div>
                        {data.roadmap.map(p => (
                          <button key={p.id} onClick={() => { promoteNote(n, 'initiative', { phaseId: p.id }); setPromoting(null); }}
                            className="w-full text-left px-2 py-1 rounded text-[11px] hover:bg-zinc-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                            P{p.phase} orbit
                          </button>
                        ))}
                        {data.roadmap.map(p => (
                          <button key={'s' + p.id} onClick={() => { promoteNote(n, 'step', { phaseId: p.id }); setPromoting(null); }}
                            className="w-full text-left px-2 py-1 rounded text-[11px] hover:bg-zinc-800 flex items-center gap-2 text-zinc-400">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                            → P{p.phase} path step
                          </button>
                        ))}
                        <button onClick={() => setPromoting(null)} className="w-full text-center py-1 text-[9px] text-zinc-500 hover:text-zinc-300">Cancel</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'log' && (
            <div className="space-y-1.5">
              {data.completionLog.length === 0 ? (
                <div className="text-center py-6 text-zinc-600 text-xs">No completions yet.</div>
              ) : (
                data.completionLog.map(e => (
                  <div key={e.itemId + e.date} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-zinc-200 leading-relaxed">{e.text}</div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-600 mt-0.5">
                        {new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JournalTab({ active, onClick, label, count }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${active ? 'bg-zinc-900 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>
      {label}
      <span className={`text-[9px] px-1 rounded ${active ? 'bg-zinc-800 text-zinc-300' : 'text-zinc-600'}`}>{count}</span>
    </button>
  );
}

/* ==================== SETTINGS ==================== */
function SettingsModal({ data, toggleSetting, onResetData, onClose }) {
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 fade-in" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Settings</div>
            <div className="font-display text-base font-semibold">Make it yours</div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-2">
          <Toggle label="Auto-rotate camera" sub="Ambient spin when idle" value={data.settings.autoRotate} onChange={() => toggleSetting('autoRotate')} />
          <Toggle label="Next-action beacon" sub="Pulsing ring around the next step" value={data.settings.showBeacon} onChange={() => toggleSetting('showBeacon')} />
          <Toggle label="3D labels" sub="Floating names on planets" value={data.settings.showLabels} onChange={() => toggleSetting('showLabels')} />
          <Toggle label="Celebrations" sub="Pop-up when you complete a step" value={data.settings.celebrate} onChange={() => toggleSetting('celebrate')} />
          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 mt-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
              <Mouse className="w-2.5 h-2.5" />
              Controls
            </div>
            <ul className="space-y-1 text-[11px] text-zinc-300">
              <li className="flex justify-between"><span>Scroll</span><span className="text-zinc-500">Pan vertically</span></li>
              <li className="flex justify-between"><span>Drag</span><span className="text-zinc-500">Rotate view</span></li>
              <li className="flex justify-between"><span>Pinch / Ctrl+Scroll</span><span className="text-zinc-500">Zoom</span></li>
              <li className="flex justify-between"><span>Tap orb</span><span className="text-zinc-500">Edit details</span></li>
            </ul>
          </div>
          <div className="pt-3 mt-3 border-t border-zinc-800">
            {confirmReset ? (
              <div className="space-y-2">
                <p className="text-xs text-zinc-300">Wipe all your data?</p>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmReset(false)} className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 text-xs">Cancel</button>
                  <button onClick={onResetData} className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-300 text-xs font-semibold">Reset</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="w-full px-3 py-2 rounded-lg bg-zinc-900 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5">
                <RotateCcw className="w-3 h-3" />
                Reset all data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, sub, value, onChange }) {
  return (
    <button onClick={onChange} className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 transition-colors text-left">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-100">{label}</div>
        <div className="text-[10px] text-zinc-500 mt-0.5">{sub}</div>
      </div>
      <div className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${value ? 'bg-amber-500' : 'bg-zinc-700'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-zinc-50 transition-all ${value ? 'left-4' : 'left-0.5'}`} />
      </div>
    </button>
  );
}
