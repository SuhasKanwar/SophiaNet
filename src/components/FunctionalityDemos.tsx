import { motion } from 'motion/react';

export const AnimatedImageDemo: React.FC<{ title: string; alt?: string }> = ({ title, alt }) => {
  const steps = ['Load', 'Preprocess', 'OCR', 'Parse', 'Metadata'];
  const cycle = 8;
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-gray-850 to-slate-900 border border-gray-700">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg,rgba(255,255,255,0.08) 0 1px,transparent 1px 120px),repeating-linear-gradient(0deg,rgba(255,255,255,0.06) 0 1px,transparent 1px 90px)'
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 40% 35%, rgba(59,130,246,0.18), transparent 55%)'
        }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center gap-6">
        <motion.div
          className="relative w-32 h-32 rounded-2xl bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-slate-600/60 backdrop-blur-sm flex items-center justify-center"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl border border-white/5"
            style={{ mask: 'linear-gradient(160deg, #000 40%, transparent)' }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="w-16 h-16 rounded-xl bg-slate-800/70 border border-slate-600 flex items-center justify-center text-white font-semibold tracking-wide text-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            IMG
          </motion.div>
          <motion.span
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-[9px] flex items-center justify-center text-white font-medium shadow-md shadow-blue-500/30"
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            AI
          </motion.span>
        </motion.div>
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-white text-xl font-semibold">{title}</h3>
          <p className="text-gray-300 text-xs max-w-sm leading-relaxed">{alt}</p>
        </div>
        <div className="w-full max-w-md flex justify-center">
          <div className="flex items-center gap-3 px-1">
            {steps.map((s, i) => (
              <motion.span
                key={s}
                className="px-4 py-1.5 rounded-full border border-slate-600/70 bg-slate-800/60 text-[11px] font-medium text-gray-300 tracking-wide transition-colors"
                animate={{
                  backgroundColor: [
                    'rgba(30,41,59,0.55)',
                    'rgba(59,130,246,0.35)',
                    'rgba(30,41,59,0.55)'
                  ],
                  color: ['#cbd5e1', '#ffffff', '#cbd5e1'],
                  boxShadow: [
                    '0 0 0px rgba(59,130,246,0)',
                    '0 0 6px rgba(59,130,246,0.5)',
                    '0 0 0px rgba(59,130,246,0)'
                  ]
                }}
                transition={{
                  duration: cycle,
                  repeat: Infinity,
                  delay: (i / steps.length) * cycle,
                  ease: 'easeInOut'
                }}
                whileHover={{ scale: 1.07 }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>
        <div className="w-full max-w-md mt-2">
          <div className="h-1.5 w-full rounded-full bg-slate-700/70 overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
              style={{ width: '100%' }}
              animate={{ clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }}
              transition={{ duration: cycle, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 w-1.5 bg-white/70 rounded-full"
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: cycle, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between mt-1 px-0.5">
            {steps.map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-slate-600 relative">
                <motion.span
                  className="absolute inset-0 rounded-full bg-cyan-400"
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: cycle,
                    repeat: Infinity,
                    delay: (i / steps.length) * cycle,
                    ease: 'easeInOut'
                  }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnimatedVideoDemo: React.FC<{ title: string; alt?: string }> = ({ title, alt }) => {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-850 to-black border border-gray-700">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800/60 backdrop-blur flex items-center gap-2 px-4 border-b border-gray-700">
        <div className="flex gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-4 text-xs text-gray-400 tracking-wide">Processing pipeline preview</span>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pb-20 px-8">
        <motion.div
          className="relative w-40 h-40 rounded-full border-4 border-gray-700 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-emerald-400"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-semibold"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            VID
          </motion.div>
        </motion.div>
        <h3 className="mt-8 text-white text-2xl font-semibold">{title}</h3>
        <p className="text-gray-300 mt-2 text-sm text-center max-w-md">{alt}</p>
      </div>
      <div className="absolute left-0 right-0 bottom-0 px-6 pb-6 pt-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <motion.button
            className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300"
            whileTap={{ scale: 0.9 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ▶
          </motion.button>
          <div className="flex-1 h-2 rounded bg-gray-700 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
        <div className="flex gap-2 text-[10px] tracking-wider text-gray-400">
          {['FRAME EXTRACTION', 'SCENE SPLIT', 'AUDIO EMBED', 'SUMMARIZE'].map(s => (
            <motion.span
              key={s}
              className="px-2 py-1 rounded bg-gray-800/70"
              whileHover={{ scale: 1.08 }}
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const InteractivePipelineDemo: React.FC<{ title: string; content?: string }> = ({ title, content }) => {
  const nodes = [
    { id: 'ingest', label: 'Ingest', color: 'from-blue-500 to-indigo-500' },
    { id: 'process', label: 'Process', color: 'from-purple-500 to-fuchsia-500' },
    { id: 'embed', label: 'Embed', color: 'from-rose-500 to-orange-500' },
    { id: 'generate', label: 'Generate', color: 'from-emerald-500 to-teal-500' },
    { id: 'deliver', label: 'Deliver', color: 'from-cyan-500 to-sky-500' },
  ];
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-[#0b0f17] via-[#121923] to-[#0b0f17] border border-gray-700">
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 120px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 80px)'
        }}
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0">
        {nodes.slice(0, -1).map((n, i) => (
          <motion.div
            key={n.id}
            className="absolute h-1 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent rounded-full"
            style={{ top: `${28 + i * 11}%`, left: '18%', right: '18%', originX: 0.5 }}
            animate={{ scaleX: [0.2, 1, 0.2], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
      </div>
      <div className="relative h-full flex flex-col items-center justify-center gap-10 px-6">
        <h3 className="text-white text-2xl font-semibold">{title}</h3>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {nodes.map((node, i) => (
            <motion.div
              key={node.id}
              className={`relative group w-32 h-32 rounded-2xl p-[2px] bg-gradient-to-br ${node.color} shadow-lg shadow-black/40`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 120 }}
            >
              <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500 bg-gradient-to-br from-white/30 to-transparent" />
              <motion.div
                className="relative w-full h-full rounded-[14px] bg-[#121923] flex flex-col items-center justify-center gap-1 text-sm text-gray-200"
                whileHover={{ y: -6 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-semibold tracking-wide"
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                >
                  {i + 1}
                </motion.div>
                <span className="mt-1 font-medium">{node.label}</span>
                <motion.span
                  className="w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-sky-400"
                  animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
        <p className="text-gray-300 text-xs max-w-lg text-center leading-relaxed">
          {content || 'Autonomous agents coordinate data flow, embeddings, generation, analysis, and delivery in a resilient pipeline.'}
        </p>
      </div>
    </div>
  );
};

export const OrchestrationNetworkDemo: React.FC<{ title: string; alt?: string }> = ({ title, alt }) => {
  const nodes = [
    { id: 'orchestrator', label: 'Orchestrator', x: 50, y: 50, core: true, color: 'from-blue-500 via-indigo-500 to-purple-500' },
    { id: 'crawler', label: 'Crawler', x: 15, y: 20, color: 'from-cyan-500 to-sky-500' },
    { id: 'notes', label: 'Notes', x: 85, y: 25, color: 'from-indigo-500 to-violet-500' },
    { id: 'embed', label: 'Embedding', x: 15, y: 78, color: 'from-fuchsia-500 to-pink-500' },
    { id: 'generate', label: 'Generation', x: 50, y: 86, color: 'from-emerald-500 to-teal-500' },
    { id: 'analysis', label: 'Analysis', x: 85, y: 75, color: 'from-amber-500 to-orange-500' },
    { id: 'storage', label: 'Storage', x: 30, y: 50, color: 'from-sky-500 to-blue-500' },
    { id: 'queue', label: 'Queue', x: 70, y: 50, color: 'from-teal-500 to-emerald-500' },
    { id: 'monitor', label: 'Monitor', x: 50, y: 15, color: 'from-rose-500 to-orange-500' },
  ];

  const edges = [
    { id: 'orc-crawler', from: 'orchestrator', to: 'crawler', color: '#38bdf8' },
    { id: 'orc-notes', from: 'orchestrator', to: 'notes', color: '#818cf8' },
    { id: 'orc-embed', from: 'orchestrator', to: 'embed', color: '#ec4899' },
    { id: 'orc-generate', from: 'orchestrator', to: 'generate', color: '#10b981' },
    { id: 'orc-analysis', from: 'orchestrator', to: 'analysis', color: '#f59e0b' },
    { id: 'orc-storage', from: 'orchestrator', to: 'storage', color: '#38bdf8' },
    { id: 'orc-queue', from: 'orchestrator', to: 'queue', color: '#10b981' },
    { id: 'orc-monitor', from: 'orchestrator', to: 'monitor', color: '#f472b6' },
    { id: 'crawler-notes', from: 'crawler', to: 'notes', color: '#64748b' },
    { id: 'notes-embed', from: 'notes', to: 'embed', color: '#64748b' },
    { id: 'embed-generate', from: 'embed', to: 'generate', color: '#64748b' },
    { id: 'generate-analysis', from: 'generate', to: 'analysis', color: '#64748b' },
    { id: 'analysis-orchestrator', from: 'analysis', to: 'orchestrator', color: '#64748b' },
    { id: 'storage-embed', from: 'storage', to: 'embed', color: '#64748b' },
    { id: 'queue-generate', from: 'queue', to: 'generate', color: '#64748b' },
  ];
  const getNode = (id: string) => nodes.find(n => n.id === id)!;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#0c141d] border border-gray-700">
      <div className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg,rgba(255,255,255,0.04) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,0.035) 0 1px,transparent 1px 70px)'
        }} />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(circle at 55% 45%, rgba(56,189,248,0.18), transparent 60%)' }}
      />
      <svg className="absolute inset-0 w-full h-full pointer-events-none"
           viewBox="0 0 100 100"
           preserveAspectRatio="none">
        {edges.map((e) => {
          const a = getNode(e.from); const b = getNode(e.to);
          return (
            <motion.line
              key={e.id}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={e.color}
              strokeWidth={0.9}
              strokeLinecap="round"
              strokeDasharray="1.8 4"
              strokeOpacity={0.85}
              animate={{ strokeDashoffset: [0, -30] }}
              transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
              style={{ filter: 'drop-shadow(0 0 2px rgba(56,189,248,0.25))' }}
            />
          );
        })}
        <motion.path
          d="M15 20 L30 50 L15 78 L50 86 L85 75 L50 50"
          fill="none"
          stroke="#94a3b8"
          strokeWidth={0.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1.8 4"
          strokeOpacity={0.85}
          animate={{ strokeDashoffset: [0, -30] }}
          transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
          style={{ filter: 'drop-shadow(0 0 3px rgba(148,163,184,0.35))' }}
          opacity={0.85}
        />
      </svg>
      <div className="absolute inset-0">
        {nodes.map((n, i) => (
          <motion.div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 160 }}
          >
            <motion.div
              className={`relative ${n.core ? 'w-32 h-32' : 'w-20 h-20 md:w-24 md:h-24'} rounded-2xl p-[2px] bg-gradient-to-br ${n.color}`}
              animate={{ y: [0, -2, 0, 2, 0] }}
              transition={{ duration: 8 + (i % 4), repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative w-full h-full rounded-[14px] bg-[#101a24] flex flex-col items-center justify-center text-center">
                <span className={`text-[10px] md:text-[11px] font-semibold tracking-wide ${n.core ? 'text-white' : 'text-gray-200'}`}>
                  {n.label}
                </span>
                {!n.core && (
                  <motion.span
                    className="mt-1 text-[8px] md:text-[9px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3.4, repeat: Infinity, delay: i * 0.2 }}
                  >
                    active
                  </motion.span>
                )}
                {n.core && (
                  <motion.div
                    className="mt-2 flex gap-1"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                  </motion.div>
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition duration-500 blur bg-gradient-to-br from-white/30 to-transparent" />
            </motion.div>
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/10 to-transparent">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-gray-300 text-xs mt-1">{alt}</p>
      </div>
    </div>
  );
};

export const OutputShowcaseDemo: React.FC<{ title: string; alt?: string }> = ({ title, alt }) => {
  const cards = [
    { t: 'Notes (Markdown + LaTeX)', c: 'md.svg', hue: 'from-indigo-500 to-blue-500' },
    { t: 'Video Summary', c: 'video.svg', hue: 'from-rose-500 to-orange-500' },
    { t: 'Thumbnail', c: 'thumb.svg', hue: 'from-emerald-500 to-teal-500' },
    { t: 'Poster', c: 'poster.svg', hue: 'from-fuchsia-500 to-pink-500' },
    { t: 'Semantic Search', c: 'search.svg', hue: 'from-cyan-500 to-sky-500' },
    { t: 'Trend Monitor', c: 'dashboard.svg', hue: 'from-amber-500 to-lime-500' }
  ];
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-[#141922] via-[#0f141b] to-[#141922] border border-gray-700">
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: 'linear-gradient(120deg,rgba(255,255,255,0.06),transparent 60%)' }}
        animate={{ opacity:[0.2,0.5,0.2] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <div className="relative p-5 flex flex-col h-full">
        <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-3 gap-4 auto-rows-[100px] flex-1">
          {cards.map((card,i)=>(
            <motion.div
              key={card.t}
              className={`relative rounded-xl p-[2px] bg-gradient-to-br ${card.hue} group`}
              initial={{ scale:0.5, opacity:0 }}
              animate={{ scale:1, opacity:1 }}
              transition={{ delay: i*0.08, type:'spring', stiffness:140 }}
              whileHover={{ y:-6 }}
            >
              <div className="absolute inset-0 rounded-xl blur opacity-0 group-hover:opacity-60 transition duration-500 bg-gradient-to-br from-white/30 to-transparent" />
              <div className="relative h-full w-full rounded-[10px] bg-[#0f141b] flex flex-col items-start justify-between p-3">
                <span className="text-[10px] font-medium text-gray-200 leading-tight">{card.t}</span>
                <motion.span
                  className="text-[9px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300"
                  animate={{ opacity:[0.4,1,0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i*0.2 }}
                >
                  ready
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-gray-300 text-xs mt-4">{alt}</p>
      </div>
      <motion.div
        className="pointer-events-none absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{ scale:[0.8,1.2,0.8], opacity:[0.2,0.45,0.2] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
    </div>
  );
};