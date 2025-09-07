import React from 'react';
import { Github, Eye } from 'lucide-react';

interface TechStack {
  name: string;
  color: string;
}

export interface Project {
  id: number;
  title: string;
  shortDesc: string;
  description: string;
  detailedDescription: string;
  technologies: string[];
  techStack: TechStack[];
  github?: string;
  demo?: string;
  image: string;
  status: string;
  type: string;
  featured: boolean;
  users?: string;
  year: string;
}

interface ProjectCardProps {
  project: Project;
  expandedProject: number | null;
  setExpandedProject: (id: number | null) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  expandedProject,
  setExpandedProject
}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Live': return 'bg-green-500';
      case 'In Development': return 'bg-yellow-500';
      case 'Completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-500 group relative hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20 border border-transparent hover:border-cyan-500/30">
      {/* Enhanced Project Image */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden transition-all duration-500">
        
        {/* Creative Backgrounds */}
        {project.id === 1 && (
          // TCGNode Website Background - Green Gradient
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-900 to-emerald-900 overflow-hidden">
            {/* Subtle pattern effects */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-8 right-6 w-1 h-1 bg-green-300 rounded-full opacity-30 animate-pulse delay-200"></div>
            <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-25 animate-pulse delay-400"></div>
            <div className="absolute bottom-12 right-4 w-2 h-2 bg-green-300 rounded-full opacity-20 animate-pulse delay-600"></div>
            
            {/* Floating TCG symbols */}
            <div className="absolute top-6 left-12 text-yellow-300 opacity-15 animate-pulse text-sm">⚡</div>
            <div className="absolute top-16 right-12 text-blue-300 opacity-15 animate-pulse delay-300 text-sm">💎</div>
            <div className="absolute bottom-16 left-16 text-red-300 opacity-15 animate-pulse delay-500 text-sm">🔥</div>
          </div>
        )}
        
        {project.id === 2 && (
          // Gaming Fantasy Forest Background
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
            {/* Trees silhouettes */}
            <div className="absolute bottom-0 left-2 w-3 h-16 bg-green-800 opacity-40 rounded-t-full"></div>
            <div className="absolute bottom-0 left-6 w-4 h-20 bg-green-700 opacity-50 rounded-t-full"></div>
            <div className="absolute bottom-0 right-4 w-3 h-14 bg-green-800 opacity-40 rounded-t-full"></div>
            <div className="absolute bottom-0 right-8 w-2 h-18 bg-green-700 opacity-50 rounded-t-full"></div>
            
            {/* Mystical particles */}
            <div className="absolute top-8 left-8 w-1 h-1 bg-green-300 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-12 right-12 w-1 h-1 bg-emerald-300 rounded-full animate-ping delay-200 opacity-60"></div>
            <div className="absolute bottom-20 left-16 w-1 h-1 bg-teal-300 rounded-full animate-ping delay-400 opacity-60"></div>
            
            {/* Moon */}
            <div className="absolute top-4 right-4 w-6 h-6 bg-gray-200 rounded-full opacity-30"></div>
          </div>
        )}
        
        {project.id === 3 && (
          // IoT Hardware Project Background
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-slate-900 to-blue-900 overflow-hidden">
            {/* Circuit board traces */}
            <div className="absolute top-4 left-8 w-12 h-0.5 bg-green-400 opacity-30 group-hover:opacity-60 transition-opacity"></div>
            <div className="absolute top-8 left-4 w-0.5 h-8 bg-blue-400 opacity-25 group-hover:opacity-50 transition-opacity"></div>
            <div className="absolute bottom-8 right-6 w-8 h-0.5 bg-red-400 opacity-30 group-hover:opacity-60 transition-opacity"></div>
            <div className="absolute bottom-12 right-12 w-0.5 h-6 bg-yellow-400 opacity-25 group-hover:opacity-50 transition-opacity"></div>
            
            {/* Electronic components */}
            <div className="absolute top-6 left-12 w-2 h-2 bg-red-500 rounded-full opacity-40 animate-pulse"></div>
            <div className="absolute top-16 right-8 w-1.5 h-1.5 bg-blue-500 rounded opacity-35 animate-pulse delay-200"></div>
            <div className="absolute bottom-16 left-16 w-3 h-1.5 bg-green-500 rounded opacity-30 animate-pulse delay-400"></div>
            
            {/* WiFi signals */}
            <div className="absolute top-8 right-12 opacity-20 group-hover:opacity-50 transition-opacity">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="w-2 h-2 border border-cyan-400 rounded-full absolute -inset-0.5 animate-ping delay-100"></div>
              <div className="w-3 h-3 border border-cyan-300 rounded-full absolute -inset-1 animate-ping delay-200"></div>
            </div>
          </div>
        )}
        
        {project.id === 4 && (
          // Corporate Data Center Background
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900"></div>
        )}

        {project.id === 5 && (
          // POS System / Business Dashboard Background
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-teal-900 to-blue-900"></div>
        )}

        {project.id === 6 && (
          // Developer Tool / Terminal Background with Matrix Rain Effect
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900 overflow-hidden">
            {/* Matrix-style falling code */}
            <div className="absolute top-0 left-4 w-0.5 h-full bg-gradient-to-b from-green-400 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-8 w-0.5 h-full bg-gradient-to-b from-cyan-400 to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-500 animation-delay-100"></div>
            <div className="absolute top-0 left-12 w-0.5 h-full bg-gradient-to-b from-blue-400 to-transparent opacity-25 group-hover:opacity-55 transition-opacity duration-500 animation-delay-200"></div>
            <div className="absolute top-0 right-8 w-0.5 h-full bg-gradient-to-b from-purple-400 to-transparent opacity-20 group-hover:opacity-45 transition-opacity duration-500 animation-delay-300"></div>
            <div className="absolute top-0 right-12 w-0.5 h-full bg-gradient-to-b from-indigo-400 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500 animation-delay-400"></div>
            
            {/* Floating terminal symbols */}
            <div className="absolute top-4 left-6 text-green-300 opacity-20 group-hover:opacity-40 transition-opacity duration-500 font-mono text-xs animate-pulse">$</div>
            <div className="absolute top-8 right-6 text-cyan-300 opacity-20 group-hover:opacity-40 transition-opacity duration-500 font-mono text-xs animate-pulse delay-200">&gt;</div>
            <div className="absolute bottom-8 left-8 text-blue-300 opacity-20 group-hover:opacity-40 transition-opacity duration-500 font-mono text-xs animate-pulse delay-400">~</div>
            <div className="absolute bottom-12 right-10 text-purple-300 opacity-20 group-hover:opacity-40 transition-opacity duration-500 font-mono text-xs animate-pulse delay-600">#</div>
            
            {/* Network nodes */}
            <div className="absolute top-6 left-16 w-2 h-2 bg-green-400 rounded-full opacity-30 group-hover:opacity-70 group-hover:animate-ping transition-all duration-500"></div>
            <div className="absolute top-16 right-16 w-1 h-1 bg-cyan-400 rounded-full opacity-40 group-hover:opacity-80 group-hover:animate-ping delay-100 transition-all duration-500"></div>
            <div className="absolute bottom-16 left-12 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-35 group-hover:opacity-75 group-hover:animate-ping delay-200 transition-all duration-500"></div>
          </div>
        )}
        
        {/* Custom Pixel Art Animations */}
        {project.id === 1 && (
          <div className="relative w-full h-full p-3 opacity-40 group-hover:opacity-95 transition-all duration-500">
            {/* TCGNode Search Interface Recreation */}
            <div className="w-full h-full bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-lg shadow-2xl border-2 border-yellow-500 p-2 transform group-hover:scale-105 transition-all duration-500">
              
              {/* Header */}
              <div className="text-center mb-2">
                <div className="text-green-800 text-[8px] font-bold group-hover:animate-pulse">Find Card Prices</div>
                <div className="text-green-700 text-[6px] group-hover:animate-pulse delay-100">Enter your card name or details</div>
              </div>
              
              {/* Trading Card Game Selection */}
              <div className="mb-2">
                <div className="text-[6px] text-green-800 mb-1">Trading Card Game</div>
                <div className="flex space-x-2 text-[6px]">
                  <div className="flex items-center space-x-1 group-hover:animate-pulse">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-green-800">Pokemon TCG</span>
                  </div>
                  <div className="flex items-center space-x-1 group-hover:animate-pulse delay-100">
                    <div className="w-1.5 h-1.5 border border-green-600 rounded-full"></div>
                    <span className="text-green-700">One Piece TCG</span>
                  </div>
                </div>
              </div>
              
              {/* Form Fields */}
              <div className="space-y-1 mb-2">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <div className="text-[6px] text-green-800">Card Name</div>
                    <div className="w-full h-2 bg-white/80 rounded border border-green-300 flex items-center px-1">
                      <div className="text-[5px] text-gray-500 group-hover:animate-pulse">e.g. Pikachu, Charizard</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[6px] text-green-800">Set Name</div>
                    <div className="w-full h-2 bg-white/80 rounded border border-green-300 flex items-center px-1">
                      <div className="text-[5px] text-gray-500 group-hover:animate-pulse delay-100">e.g. Base Set, Evolv...</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <div className="text-[6px] text-green-800">Rarity</div>
                    <div className="w-full h-2 bg-white/80 rounded border border-green-300 flex items-center justify-between px-1">
                      <div className="text-[5px] text-gray-500">Any Rarity</div>
                      <div className="text-[4px] text-gray-400">▼</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[6px] text-green-800">Card Number</div>
                    <div className="w-full h-2 bg-white/80 rounded border border-green-300 flex items-center justify-between px-1">
                      <div className="text-[5px] text-gray-500">e.g. 25/102</div>
                      <div className="text-[4px] text-gray-400">▼</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Search Button */}
              <div className="text-center mb-2">
                <div className="inline-block bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-[7px] font-bold group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                  🔍 Search Pokemon Cards
                </div>
              </div>
              
              {/* Ready to Search */}
              <div className="text-center">
                <div className="text-[8px] text-green-600 animate-pulse">🔍</div>
                <div className="text-[6px] text-green-700 group-hover:animate-pulse">Ready to Search</div>
                <div className="text-[5px] text-green-600 group-hover:animate-pulse delay-200">Enter a Pokemon card name to find pricing information.</div>
              </div>
              
            </div>
          </div>
        )}

        {project.id === 2 && (
          <div className="relative w-full h-full p-2 opacity-40 group-hover:opacity-95 transition-all duration-500 font-sans">
            {/* Discord Chat Interface */}
            <div className="w-full h-full bg-gray-800 rounded-lg shadow-2xl border border-gray-600 p-2 transition-all duration-500 overflow-hidden">
              
              {/* Discord Header */}
              <div className="bg-gray-700 text-white px-2 py-1 rounded-t text-[8px] font-bold mb-2 flex items-center justify-between group-hover:animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-600 rounded-full text-[6px] flex items-center justify-center">#</div>
                  <span>mvp-tracking</span>
                </div>
                <div className="text-[6px] text-gray-300">🟢 12 Online</div>
              </div>
              
              {/* Chat Messages */}
              <div className="space-y-1 text-white text-[7px] font-mono">
                
                {/* User Command */}
                <div className="flex items-start space-x-1 group-hover:animate-pulse">
                  <div className="w-4 h-4 bg-blue-500 rounded-full text-[5px] flex items-center justify-center font-bold">M</div>
                  <div className="flex-1">
                    <div className="text-blue-300 text-[6px] font-bold">Marc <span className="text-gray-400 font-normal">Today at 2:15 PM</span></div>
                    <div className="text-gray-200">!mvp list</div>
                  </div>
                </div>
                
                {/* Bot Response */}
                <div className="flex items-start space-x-1 group-hover:animate-pulse delay-100">
                  <div className="w-4 h-4 bg-green-500 rounded-full text-[5px] flex items-center justify-center font-bold">🤖</div>
                  <div className="flex-1">
                    <div className="text-green-400 text-[6px] font-bold">MVPBot <span className="text-indigo-400 text-[5px]">BOT</span> <span className="text-gray-400 font-normal">Today at 2:15 PM</span></div>
                    <div className="bg-gray-700 rounded p-1 mt-0.5">
                      <div className="text-yellow-300 text-[6px] font-bold mb-1">📍 Current MVP Status:</div>
                      <div className="text-green-300">🔴 Amon Ra: <span className="text-white">Ready to spawn</span></div>
                      <div className="text-blue-300">🔵 Pharaoh: <span className="text-orange-300">12:34 remaining</span></div>
                      <div className="text-purple-300">🟣 Baphomet: <span className="text-orange-300">45:22 remaining</span></div>
                      <div className="text-red-300">🔴 Lord of Death: <span className="text-white">Ready to spawn</span></div>
                    </div>
                  </div>
                </div>
                
                {/* Another User Command */}
                <div className="flex items-start space-x-1 group-hover:animate-pulse delay-200">
                  <div className="w-4 h-4 bg-red-500 rounded-full text-[5px] flex items-center justify-center font-bold">J</div>
                  <div className="flex-1">
                    <div className="text-red-300 text-[6px] font-bold">Jake <span className="text-gray-400 font-normal">Today at 2:16 PM</span></div>
                    <div className="text-gray-200">!mvp killed amon_ra</div>
                  </div>
                </div>
                
                {/* Bot Confirmation */}
                <div className="flex items-start space-x-1 group-hover:animate-pulse delay-300">
                  <div className="w-4 h-4 bg-green-500 rounded-full text-[5px] flex items-center justify-center font-bold">🤖</div>
                  <div className="flex-1">
                    <div className="text-green-400 text-[6px] font-bold">MVPBot <span className="text-indigo-400 text-[5px]">BOT</span> <span className="text-gray-400 font-normal">Today at 2:16 PM</span></div>
                    <div className="text-green-300">✅ Amon Ra timer started! Next spawn: <span className="text-yellow-300">60:00</span></div>
                  </div>
                </div>
                
              </div>
              
              {/* Discord Input Bar */}
              <div className="absolute bottom-2 left-2 right-2 bg-gray-600 rounded px-2 py-1">
                <div className="text-gray-400 text-[6px]">Message #mvp-tracking</div>
              </div>
              
              {/* Online indicator */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              
            </div>
          </div>
        )}

        {project.id === 3 && (
          <div className="relative w-full h-full p-2 opacity-40 group-hover:opacity-95 transition-all duration-500 font-mono">
            {/* Scalp Massager Web Interface */}
            <div className="w-full h-full bg-white rounded-lg shadow-2xl border border-gray-300 p-2 transition-all duration-500 overflow-hidden">
              
              {/* Header */}
              <div className="bg-gray-700 text-white text-center py-1 rounded text-[10px] font-bold mb-2 group-hover:animate-pulse">
                Scalp Masseuse
              </div>
              
              {/* Wi-Fi Status */}
              <div className="mb-2">
                <div className="text-[9px] font-bold text-gray-800 mb-1">Wi-Fi Status</div>
                <div className="text-[8px] text-gray-700">
                  <span>Status: </span>
                  <span className="bg-green-500 text-white px-1 py-0.5 rounded text-[8px] group-hover:animate-pulse">Connected</span>
                  <span className="ml-1">IP: xxx.xxx.x.xx</span>
                </div>
              </div>
              
              {/* Massage Controls */}
              <div className="mb-2">
                <div className="text-[9px] font-bold text-gray-800 mb-1 text-center">Massage Controls:</div>
                <div className="flex justify-center space-x-1">
                  <button className="bg-blue-500 text-white px-2 py-0.5 rounded text-[8px] group-hover:animate-pulse transition-all duration-300">
                    Extend
                  </button>
                  <button className="bg-blue-500 text-white px-2 py-0.5 rounded text-[8px] group-hover:animate-pulse delay-100 transition-all duration-300">
                    Retract
                  </button>
                  <button className="bg-red-500 text-white px-2 py-0.5 rounded text-[8px] group-hover:animate-pulse delay-200 transition-all duration-300">
                    Stop
                  </button>
                </div>
              </div>
              
              {/* Massage Mode */}
              <div className="mb-2">
                <div className="text-[9px] font-bold text-gray-800 text-center mb-1">Massage Mode:</div>
                <div className="text-center">
                  <button className="bg-green-600 text-white px-2 py-0.5 rounded text-[8px] group-hover:animate-pulse transition-all duration-300">
                    Continuous Massage
                  </button>
                </div>
              </div>
              
              {/* Mini Terminal */}
              <div className="mb-1">
                <div className="text-[9px] font-bold text-gray-800 mb-1">Mini Terminal</div>
                <div className="bg-black text-green-400 p-1 rounded text-[9px] font-mono h-16 overflow-hidden leading-tight">
                  <div className="group-hover:animate-pulse">WiFi connected</div>
                  <div className="text-cyan-400 group-hover:animate-pulse delay-100">192.168.1.16</div>
                  <div className="text-yellow-400 group-hover:animate-pulse delay-200">Server started</div>
                  <div className="text-green-400 group-hover:animate-pulse delay-300">mDNS started: http://scalpmassage.local</div>
                </div>
              </div>
              
              {/* Status indicator */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              
            </div>
          </div>
        )}

        {project.id === 4 && (
          <div className="relative w-full h-full p-2 opacity-40 group-hover:opacity-95 transition-all duration-500 font-sans">
            {/* Data Collection System Interface */}
            <div className="w-full h-full bg-white rounded-lg shadow-2xl border border-gray-300 p-2 transition-all duration-500 overflow-hidden">
              
              {/* Header with Navigation */}
              <div className="bg-blue-600 text-white px-2 py-1 rounded-t text-[8px] font-bold mb-2 flex items-center justify-between group-hover:animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-white/20 rounded text-[6px] flex items-center justify-center">📊</div>
                  <span>Input Errors</span>
                  <span className="text-white/80">Errors</span>
                </div>
                <div className="text-[6px] text-white/80">Hey, Scooby</div>
              </div>
              
              {/* Main Content */}
              <div className="mb-2">
                <div className="text-center text-[10px] font-bold text-gray-800 mb-2">ERRORS</div>
                
                {/* Tab Navigation */}
                <div className="flex justify-center space-x-1 mb-2">
                  <span className="text-[7px] text-gray-600">Electrical</span>
                  <span className="text-[7px] text-blue-500 font-bold">Bay 1</span>
                  <span className="text-[7px] text-yellow-500">Bay 2</span>
                  <span className="text-[7px] text-green-500">Bay 3</span>
                  <span className="text-[7px] text-blue-400">Bay 4</span>
                  <span className="text-[7px] text-red-500">Bay 5</span>
                </div>
                
                {/* Error Entry */}
                <div className="bg-gray-50 border rounded p-1 mb-2 group-hover:animate-pulse">
                  <div className="text-[7px] text-gray-600 mb-1">General Error: CPU {'->'} ID: 3</div>
                  <div className="text-[9px] font-bold text-gray-800 mb-1">Keyboard not working.</div>
                  <div className="text-[6px] text-gray-500">Cycle power.</div>
                  <div className="text-[6px] text-gray-500 mt-1">
                    <span>Reported by: </span>
                    <span className="font-semibold">Marc</span>
                  </div>
                  <div className="text-[6px] text-gray-400">July 8, 2022, 10:15 p.m.</div>
                </div>
                
                {/* Bay Section */}
                <div className="mb-1">
                  <div className="text-[8px] font-bold text-blue-500 mb-1">BAY 1</div>
                  <div className="bg-gray-50 border rounded p-1 group-hover:animate-pulse delay-200">
                    <div className="text-[7px] text-gray-600">General Error: CPU {'->'} ID: 5</div>
                    <div className="text-[6px] text-gray-400 mt-1">Page 1 of 2</div>
                  </div>
                </div>
              </div>
              
              {/* Status indicator */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              
            </div>
          </div>
        )}

        {project.id === 5 && (
          <div className="relative w-full h-full p-4 transition-all duration-500 flex items-center justify-center">
            {/* Unified POS Unit */}
            <div className="w-36 h-36 bg-gray-800 rounded-lg shadow-xl border border-gray-700 relative overflow-hidden flex flex-col">
              {/* Screen Area */}
              <div className="w-full h-2/3 bg-gray-900 rounded-t-lg p-3 flex flex-col justify-between overflow-hidden relative">
                <div className="text-green-400 text-xs font-mono space-y-1">
                  <p className="transition-opacity duration-300">Item 1: $5.00</p>
                  <p className="transition-opacity duration-300 delay-100">Item 2: $3.00</p>
                  <p className="transition-opacity duration-300 delay-200">Item 3: $2.50</p>
                </div>
                <div className="text-right text-white text-sm font-bold transition-opacity duration-300 delay-300">TOTAL: $10.50</div>
                
              </div>
              {/* Keypad / Cash Drawer Area */}
              <div className="w-full h-1/3 bg-gray-700 rounded-b-lg flex items-center justify-center shadow-inner relative overflow-hidden">
                {/* Keypad (visible by default) */}
                <div className="w-20 h-6 bg-gray-600 rounded-sm animate-pulse transition-opacity duration-300 group-hover:opacity-0"></div>
                {/* Cash Drawer (appears on hover) */}
                <div className="absolute inset-0 bg-gray-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-end justify-center p-1 space-x-1">
                  {/* Coin slots */}
                  <div className="w-6 h-6 bg-gray-600 rounded-full border border-gray-500 flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 bg-gray-600 rounded-full border border-gray-500 flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  {/* Bill slots */}
                  <div className="w-12 h-8 bg-gray-600 rounded-sm border border-gray-500 flex flex-col justify-end p-0.5">
                    <div className="w-full h-2 bg-green-500 rounded-sm"></div>
                    <div className="w-full h-2 bg-green-600 rounded-sm mt-0.5"></div>
                  </div>
                  <div className="w-12 h-8 bg-gray-600 rounded-sm border border-gray-500 flex flex-col justify-end p-0.5">
                    <div className="w-full h-2 bg-blue-500 rounded-sm"></div>
                    <div className="w-full h-2 bg-blue-600 rounded-sm mt-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {project.id === 6 && (
          <div className="relative w-full h-full p-1 opacity-40 group-hover:opacity-95 transition-all duration-500 font-mono overflow-hidden">
            {/* Accurate portndock TUI Recreation */}
            <div className="w-full h-full bg-black/95 rounded-md shadow-2xl border border-cyan-500/50 p-1 transform group-hover:scale-[1.02] transition-all duration-500">
              
              {/* Header */}
              <div className="text-cyan-300 text-[8px] leading-tight mb-1">
                <div className="group-hover:animate-pulse">portndock - Kill processes using your ports</div>
                <div className="text-gray-300 group-hover:animate-pulse delay-100">Use arrows to select - ENTER to kill process - ? for help - Q to quit</div>
                <div className="text-gray-400 group-hover:animate-pulse delay-200">Found 26 processes - ALL - all filter - IPv6 hidden - ports only</div>
              </div>
              
              {/* Table Header */}
              <div className="text-gray-400 text-[7px] border-b border-gray-600 pb-0.5 mb-1 grid grid-cols-6 gap-1">
                <span>PROTO</span>
                <span>PORT</span>
                <span>PID</span>
                <span>USER</span>
                <span>PROCESS</span>
                <span>CONTAINER</span>
              </div>
              
              {/* Process List */}
              <div className="space-y-0.5 text-[7px] max-h-20 overflow-hidden">
                {/* Selected row - highlighted */}
                <div className="bg-gray-700/80 text-white grid grid-cols-6 gap-1 px-1 group-hover:animate-pulse">
                  <span className="text-cyan-300">tcp</span>
                  <span className="text-cyan-300">53</span>
                  <span>-</span>
                  <span>-</span>
                  <span className="text-yellow-300">systemd-resolved</span>
                  <span>-</span>
                </div>
                
                {/* Regular rows */}
                <div className="text-gray-300 grid grid-cols-6 gap-1 px-1 group-hover:animate-pulse delay-100">
                  <span className="text-cyan-300">tcp</span>
                  <span className="text-cyan-300">631</span>
                  <span>-</span>
                  <span>-</span>
                  <span className="text-orange-300">cupsd</span>
                  <span>-</span>
                </div>
                
                <div className="text-gray-300 grid grid-cols-6 gap-1 px-1 group-hover:animate-pulse delay-200">
                  <span className="text-cyan-300">tcp</span>
                  <span className="text-green-300">3001</span>
                  <span className="text-blue-300">40594</span>
                  <span className="text-pink-300">marc</span>
                  <span className="text-green-300">node</span>
                  <span>-</span>
                </div>
                
                <div className="text-gray-300 grid grid-cols-6 gap-1 px-1 group-hover:animate-pulse delay-300">
                  <span className="text-cyan-300">tcp</span>
                  <span className="text-green-300">4002</span>
                  <span className="text-blue-300">40326</span>
                  <span className="text-pink-300">marc</span>
                  <span className="text-green-300">next-server</span>
                  <span>-</span>
                </div>
                
                <div className="text-gray-300 grid grid-cols-6 gap-1 px-1 group-hover:animate-pulse delay-400">
                  <span className="text-cyan-300">tcp</span>
                  <span className="text-green-300">5432</span>
                  <span>-</span>
                  <span className="text-blue-400">docker</span>
                  <span className="text-green-300">postgres</span>
                  <span className="text-blue-400">tcgnode_postgres_1</span>
                </div>
                
                <div className="text-gray-300 grid grid-cols-6 gap-1 px-1 group-hover:animate-pulse delay-500">
                  <span className="text-cyan-300">tcp</span>
                  <span className="text-green-300">8000</span>
                  <span>-</span>
                  <span className="text-blue-400">docker</span>
                  <span className="text-green-300">backend</span>
                  <span className="text-blue-400">tcgnode_backend_1</span>
                </div>
              </div>
              
              {/* Footer Status */}
              <div className="absolute bottom-1 left-1 right-1 text-gray-300 text-[7px] border-t border-gray-600 pt-0.5">
                <div className="group-hover:animate-pulse">Selected: systemd-resolved (PID N/A) on port 53</div>
              </div>
              
              {/* Floating indicators */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-[10px]">🔍</div>
              </div>
              
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Project Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{project.shortDesc} • {project.year}</p>
            {project.users && (
              <p className="text-cyan-400 text-xs mt-1">{project.users}</p>
            )}
          </div>
        </div>

        {/* Project Description */}
        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
          {expandedProject === project.id ? project.detailedDescription : project.description}
        </p>
        
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium mb-4 transition-colors"
        >
          {expandedProject === project.id ? 'Show Less' : 'Read More'}
        </button>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.techStack.map((tech, i) => (
            <span key={i} className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              {tech.name}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {project.demo && (
            <a
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 transform flex items-center gap-2 shadow-lg"
            >
              <Eye size={16} />
              {project.id === 1 ? 'Visit Live Site' : 'Live Demo'}
            </a>
          )}
          {project.github && (
            <a
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 transform flex items-center gap-2 shadow-lg"
            >
              <Github size={16} />
              Code
            </a>
          )}
        </div>
        {project.status === 'In Development' && !project.github && (
          <p className="text-yellow-400 text-xs mt-4">
            This project is currently in active development and will be available on GitHub soon!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
