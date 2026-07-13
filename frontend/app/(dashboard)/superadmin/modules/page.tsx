'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MODULE_CATALOG as initialModuleCatalog, DEFAULT_MODULES as initialDefaultModules, INSTITUTION_TYPE_LABELS, type InstitutionType, type ModuleKey, type ModuleDef } from '@/lib/modules';
import { Layers, CheckCircle2, AlertCircle, Save, Settings2, ShieldCheck, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

export default function SuperadminModulesPage() {
  const [activeTab, setActiveTab] = useState<'defaults' | 'catalog'>('defaults');
  const [selectedType, setSelectedType] = useState<InstitutionType>('school');
  
  // State for active default module mappings
  const [defaultModules, setDefaultModules] = useState<Record<InstitutionType, ModuleKey[]>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buildroonix_default_modules');
      if (saved) return JSON.parse(saved);
    }
    return initialDefaultModules;
  });

  // State for module definitions
  const [moduleCatalog, setModuleCatalog] = useState<ModuleDef[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buildroonix_module_catalog');
      if (saved) return JSON.parse(saved);
    }
    return initialModuleCatalog;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveDefaults = () => {
    localStorage.setItem('buildroonix_default_modules', JSON.stringify(defaultModules));
    // Trigger storage event so sidebar updates immediately
    window.dispatchEvent(new Event('storage'));
    showToast('Default module mappings saved successfully!');
  };

  const handleSaveCatalog = () => {
    localStorage.setItem('buildroonix_module_catalog', JSON.stringify(moduleCatalog));
    // Trigger storage event so sidebar updates immediately
    window.dispatchEvent(new Event('storage'));
    showToast('Module catalog specifications updated successfully!');
  };

  // Toggle a module in the default list for selected institution type
  const toggleDefaultModule = (moduleKey: ModuleKey) => {
    setDefaultModules(prev => {
      const currentList = prev[selectedType] || [];
      const hasModule = currentList.includes(moduleKey);
      const updatedList = hasModule
        ? currentList.filter(k => k !== moduleKey)
        : [...currentList, moduleKey];
      
      return {
        ...prev,
        [selectedType]: updatedList
      };
    });
  };

  // Toggle module premium status
  const togglePremium = (moduleKey: ModuleKey) => {
    setModuleCatalog(prev => 
      prev.map(mod => mod.key === moduleKey ? { ...mod, isPremium: !mod.isPremium } : mod)
    );
  };

  // Edit module attributes
  const handleEditAttribute = (moduleKey: ModuleKey, field: 'name' | 'description', value: string) => {
    setModuleCatalog(prev =>
      prev.map(mod => mod.key === moduleKey ? { ...mod, [field]: value } : mod)
    );
  };

  // Categories mapping
  const CATEGORY_LABELS = {
    core: 'Core System',
    academic: 'Academics & Study',
    admin: 'Administration Ops',
    coaching: 'Coaching Utilities',
    online: 'Online Courseware',
    college: 'Collegiate Systems'
  };

  const CATEGORY_COLORS = {
    core: 'bg-slate-100 text-slate-700 border-slate-200',
    academic: 'bg-teal-50 text-teal-700 border-teal-200',
    admin: 'bg-blue-50 text-blue-700 border-blue-200',
    coaching: 'bg-orange-50 text-orange-700 border-orange-200',
    online: 'bg-purple-50 text-purple-700 border-purple-200',
    college: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="h-6 w-6 text-purple-600" /> Feature Modules Configuration
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Control default modules per institution type and customize SAAS licensing packages.</p>
        </div>
        {toastMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs border border-green-200 rounded-lg animate-fade-in shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('defaults')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'defaults' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Settings2 className="h-4 w-4" /> Default Mappings
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'catalog' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <ShieldCheck className="h-4 w-4" /> Module Catalog Specs
        </button>
      </div>

      {/* Tab 1: Default Mappings */}
      {activeTab === 'defaults' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <span className="text-sm font-medium text-gray-600">Select Institution Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as InstitutionType)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.entries(INSTITUTION_TYPE_LABELS).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleSaveDefaults} className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Mappings
              </Button>
            </CardContent>
          </Card>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleCatalog.map(mod => {
              const isEnabled = (defaultModules[selectedType] || []).includes(mod.key);
              const labelInfo = CATEGORY_LABELS[mod.category];
              const colorInfo = CATEGORY_COLORS[mod.category];

              return (
                <Card
                  key={mod.key}
                  onClick={() => toggleDefaultModule(mod.key)}
                  className={`cursor-pointer transition-all border ${isEnabled ? 'border-purple-300 bg-purple-50/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <CardContent className="p-4 flex items-start justify-between">
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 text-sm">{mod.name}</p>
                          {mod.isPremium && (
                            <Badge variant="default" className="text-[9px] bg-amber-500 text-white border-0 py-0 px-1.5 flex items-center gap-0.5">
                              <Sparkles className="h-2 w-2" /> Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-mono">{mod.key}</p>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">{mod.description}</p>
                      <span className={`inline-block px-2 py-0.5 border rounded-full text-[9px] font-bold tracking-wider ${colorInfo}`}>
                        {labelInfo}
                      </span>
                    </div>
                    <div className="pt-0.5">
                      {isEnabled ? (
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white">
                          ✓
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-200" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Catalog Specification Editor */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between bg-gray-50 border-b border-gray-100 rounded-t-xl">
              <div>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-purple-500" /> Module Catalog Settings
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Edit system module metadata, change licensing plans (Premium/Free), and rename features.</p>
              </div>
              <Button onClick={handleSaveCatalog} className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Catalog Specifications
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Module Key</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Display Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                      <th className="px-3 py-3 text-center font-semibold text-gray-600">Category</th>
                      <th className="px-3 py-3 text-center font-semibold text-gray-600">License Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moduleCatalog.map(mod => (
                      <tr key={mod.key} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-xs text-gray-400 font-bold">{mod.key}</td>
                        <td className="px-4 py-3.5">
                          <Input
                            value={mod.name}
                            onChange={(e) => handleEditAttribute(mod.key, 'name', e.target.value)}
                            className="h-8 max-w-[200px] text-xs font-semibold"
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <Input
                            value={mod.description}
                            onChange={(e) => handleEditAttribute(mod.key, 'description', e.target.value)}
                            className="h-8 text-xs min-w-[250px]"
                          />
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${CATEGORY_COLORS[mod.category]}`}>
                            {mod.category}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => togglePremium(mod.key)} className="text-gray-400 hover:text-purple-600 transition-colors">
                              {mod.isPremium ? (
                                <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                  <Sparkles className="h-3 w-3" /> Premium
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                                  Free Tier
                                </div>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
