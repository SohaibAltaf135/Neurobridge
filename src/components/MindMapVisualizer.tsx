import React, { useState } from 'react';
import { MindMapData, MindMapNode } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Info, Sparkles } from 'lucide-react';

interface MindMapVisualizerProps {
  data: MindMapData;
  topicTitle: string;
}

export const MindMapVisualizer: React.FC<MindMapVisualizerProps> = ({ data, topicTitle }) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(
    data.nodes.find((n) => n.category === 'core') || data.nodes[0] || null
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No visual nodes available for this concept.
      </div>
    );
  }

  // Calculate layout coordinates dynamically
  // Core node at center-left or center-top, concepts branching out in concentric levels
  const width = 800;
  const height = 480;

  const coreNodes = data.nodes.filter((n) => n.category === 'core');
  const conceptNodes = data.nodes.filter((n) => n.category === 'concept');
  const detailNodes = data.nodes.filter((n) => n.category === 'detail' || n.category === 'example');

  // Map node positions:
  const positions: Record<string, { x: number; y: number }> = {};

  // Core at center left
  coreNodes.forEach((node, i) => {
    positions[node.id] = { x: 160, y: height / 2 + (i - (coreNodes.length - 1) / 2) * 80 };
  });

  // Concepts in middle column
  conceptNodes.forEach((node, i) => {
    const spacing = height / (conceptNodes.length + 1);
    positions[node.id] = { x: 420, y: spacing * (i + 1) };
  });

  // Details in right column
  detailNodes.forEach((node, i) => {
    const spacing = height / (detailNodes.length + 1);
    positions[node.id] = { x: 680, y: spacing * (i + 1) };
  });

  // Fallback for any unmapped nodes
  data.nodes.forEach((node, i) => {
    if (!positions[node.id]) {
      positions[node.id] = { x: 300 + (i % 3) * 150, y: 100 + Math.floor(i / 3) * 90 };
    }
  });

  const getCategoryColor = (category: string, isSelected: boolean) => {
    switch (category) {
      case 'core':
        return isSelected
          ? 'fill-indigo-600 stroke-indigo-300 dark:fill-indigo-500'
          : 'fill-indigo-500 stroke-indigo-200 dark:fill-indigo-600';
      case 'concept':
        return isSelected
          ? 'fill-sky-600 stroke-sky-300 dark:fill-sky-500'
          : 'fill-sky-500 stroke-sky-200 dark:fill-sky-600';
      case 'detail':
        return isSelected
          ? 'fill-emerald-600 stroke-emerald-300 dark:fill-emerald-500'
          : 'fill-emerald-500 stroke-emerald-200 dark:fill-emerald-600';
      case 'example':
        return isSelected
          ? 'fill-amber-600 stroke-amber-300 dark:fill-amber-500'
          : 'fill-amber-500 stroke-amber-200 dark:fill-amber-600';
      default:
        return 'fill-slate-600 stroke-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 overflow-hidden">
      
      {/* Top Header & Zoom Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Interactive Concept Mind Map</span>
          </h3>
          <p className="text-xs text-slate-500">
            Click on any circle to explore its meaning without reading dense paragraphs.
          </p>
        </div>

        {/* Legend & Zoom */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-[11px] mr-2">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Core</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Concept</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Detail</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Example</span>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-500">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 overflow-x-auto">
        <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', minWidth: '800px' }} className="transition-transform duration-150">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-[440px] select-none"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="24"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>

            {/* Connecting Edges */}
            {data.edges.map((edge, i) => {
              const start = positions[edge.from];
              const end = positions[edge.to];
              if (!start || !end) return null;

              // Smooth Bezier Curve
              const dx = end.x - start.x;
              const controlX1 = start.x + dx * 0.5;
              const controlY1 = start.y;
              const controlX2 = start.x + dx * 0.5;
              const controlY2 = end.y;

              const pathString = `M ${start.x} ${start.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${end.x} ${end.y}`;

              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;

              return (
                <g key={`edge-${i}`} className="transition-opacity">
                  <path
                    d={pathString}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    markerEnd="url(#arrowhead)"
                    className="dark:stroke-slate-700"
                  />
                  {edge.relation && (
                    <text
                      x={midX}
                      y={midY - 6}
                      textAnchor="middle"
                      className="text-[9px] fill-slate-400 dark:fill-slate-500 font-medium"
                    >
                      {edge.relation}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {data.nodes.map((node) => {
              const pos = positions[node.id];
              if (!pos) return null;
              const isSelected = selectedNode?.id === node.id;
              const isCore = node.category === 'core';
              const radius = isCore ? 34 : 26;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Glow circle for active selection */}
                  {isSelected && (
                    <circle
                      r={radius + 8}
                      className="fill-brand-400/20 stroke-brand-500 stroke-2 animate-pulse"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={radius}
                    className={`${getCategoryColor(node.category, isSelected)} stroke-2 transition-all group-hover:scale-110 shadow-sm`}
                  />

                  {/* Node Title Text (truncated) */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    className="fill-white font-bold text-[11px] pointer-events-none select-none"
                  >
                    {node.label.length > 12 ? node.label.substring(0, 10) + '…' : node.label}
                  </text>

                  {/* Label underneath */}
                  <text
                    textAnchor="middle"
                    y={radius + 16}
                    className={`text-[10px] pointer-events-none select-none font-semibold ${
                      isSelected
                        ? 'fill-brand-600 dark:fill-brand-400 font-bold'
                        : 'fill-slate-700 dark:fill-slate-300'
                    }`}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-start gap-3 transition-all animate-fadeIn">
          <div className="p-2 rounded-lg bg-brand-600 text-white mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">
                {selectedNode.category.toUpperCase()} NODE
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                — {selectedNode.label}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedNode.description}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
