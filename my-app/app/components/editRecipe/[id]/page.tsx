'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GetRecipeById, UpdateRecipe, supabase } from '@/app/interfaces/utilities/fetching';
import { FullRecipe, instruction, ingridient } from '@/app/interfaces/obj';
import { Loader2, Plus, Trash2, ArrowLeft, Save, FileText, Layers, Utensils, ClipboardList } from 'lucide-react';

type DraftRecipe = {
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  notes: string;
  ingredients: ingridient[];
  instructions: instruction[];
};

const PALETTE = {
  bg: "#2B262D", // Charcoal Dark
  surface: "#F2EBE5", // Warm Alabaster
  primary: "#647295", // Slate Blue
  secondary: "#9F496E", // Muted Berry
};

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<DraftRecipe | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const { id: recipeId } = await params;
      if (!mounted) return;
      setId(recipeId);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/components/login');
        return;
      }

      if (!mounted) return;
      setUserId(user.id);

      const result: FullRecipe = await GetRecipeById(recipeId);

      // Ownership check in UI (backend still enforces on update/delete)
      // If backend returns user_id (not user_id), use that.
      // Ownership check in UI (backend still enforces on update/delete)
      // If backend returns user_ID, enforce that here.
      if (result?.recipe?.user_id && result.recipe.user_id !== user.id) {
        router.push('/components/getAll');
        return;
      }

      const d: DraftRecipe = {
        name: result.recipe.name || '',
        description: result.recipe.description || '',
        prepTime: result.recipe.prepTime || '',
        cookTime: result.recipe.cookTime || '',
        totalTime: result.recipe.totalTime || '',
        servings: result.recipe.servings || '',
        calories: result.recipe.calories || '',
        protein: result.recipe.protein || '',
        carbs: result.recipe.carbs || '',
        fat: result.recipe.fat || '',
        notes: result.recipe.notes || '',
        // replace ingredients/instructions entirely
        ingredients: result.ingridients || [],
        instructions: result.instructions || [],
      };

      if (!mounted) return;
      setDraft(d);
      setLoading(false);
    };

    run().catch((e) => {
      console.error(e);
      setError('Failed to load recipe for editing.');
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [params, router]);

  const updateField = (key: keyof Omit<DraftRecipe, 'ingredients' | 'instructions'>, value: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  const updateIngredient = (index: number, patch: Partial<ingridient>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.ingredients];
      next[index] = { ...next[index], ...patch };
      return { ...prev, ingredients: next };
    });
  };

  const updateInstruction = (index: number, patch: Partial<instruction>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.instructions];
      next[index] = { ...next[index], ...patch };
      return { ...prev, instructions: next };
    });
  };

  const addIngredientRow = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ingredients: [...prev.ingredients, { item: '', quantity: '' }],
      };
    });
  };

  const addInstructionRow = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      const nextStepNo = (prev.instructions?.length ? Math.max(...prev.instructions.map((s) => s.stepnumber)) : 0) + 1;
      return {
        ...prev,
        instructions: [...prev.instructions, { stepnumber: nextStepNo, description: '' }],
      };
    });
  };

  const removeIngredientRow = (index: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      };
    });
  };

  const removeInstructionRow = (index: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index),
      };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError('');

    try {
      await UpdateRecipe({
        recipeId: id,
        userId,
        updated: {
          ...draft,
          // image_url must NOT be edited per requirement -> backend should keep current image_url.
        },
      });

      router.push(`/components/getOne/${id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update recipe.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !draft) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div 
          className="rounded-2xl border p-10 w-full max-w-sm flex flex-col items-center gap-4 text-center backdrop-blur-sm"
          style={{ borderColor: "rgba(242,235,229,0.1)", backgroundColor: "rgba(242,235,229,0.02)" }}
        >
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: PALETTE.primary }} />
          <p className="text-sm font-medium tracking-wide" style={{ color: "rgba(242,235,229,0.7)" }}>Fetching recipe configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        
        {/* Navigation Action Area */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: "rgba(242,235,229,0.08)" }}>
          <button
            type="button"
            onClick={() => router.push(`/components/getOne/${id}`)}
            className="group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition hover:bg-white/5 active:scale-[0.98]"
            style={{ borderColor: "rgba(242,235,229,0.15)", color: "rgba(242,235,229,0.85)" }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" style={{ color: PALETTE.primary }} />
            Back to Recipe
          </button>
          <span className="text-xs uppercase tracking-widest font-black opacity-30" style={{ color: PALETTE.surface }}>
            Form Management
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: PALETTE.surface }}>
            Modify Recipe
          </h1>
          <p className="text-sm mt-1 opacity-60" style={{ color: PALETTE.surface }}> Update parameters, ingredients, and workflow constraints.</p>
        </div>

        {error && (
          <div 
            className="mb-8 p-4 rounded-xl border text-sm font-semibold tracking-wide" 
            style={{ backgroundColor: "rgba(159,73,110,0.1)", borderColor: "rgba(159,73,110,0.3)", color: PALETTE.surface }}
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Card Module 1: General Core Context */}
          <div className="rounded-2xl border p-6 space-y-5" style={{ borderColor: "rgba(242,235,229,0.08)", backgroundColor: "rgba(242,235,229,0.01)" }}>
            <div className="flex items-center gap-2 opacity-80 mb-1">
              <FileText className="w-4 h-4" style={{ color: PALETTE.primary }} />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: PALETTE.surface }}>Core Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="flex flex-col gap-2 col-span-1 md:col-span-2">
                <span className="text-xs font-bold tracking-wide opacity-70" style={{ color: PALETTE.surface }}>Recipe Name</span>
                <input
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-opacity-100 focus:bg-white/[0.02]"
                  style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                  value={draft.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold tracking-wide opacity-70" style={{ color: PALETTE.surface }}>Servings Count</span>
                <input
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-opacity-100 focus:bg-white/[0.02]"
                  style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                  value={draft.servings}
                  onChange={(e) => updateField('servings', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold tracking-wide opacity-70" style={{ color: PALETTE.surface }}>Calories (kcal)</span>
                <input
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-opacity-100 focus:bg-white/[0.02]"
                  style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                  value={draft.calories}
                  onChange={(e) => updateField('calories', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold tracking-wide opacity-70" style={{ color: PALETTE.surface }}>Preparation Duration</span>
                <input
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-opacity-100 focus:bg-white/[0.02]"
                  style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                  value={draft.prepTime}
                  onChange={(e) => updateField('prepTime', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold tracking-wide opacity-70" style={{ color: PALETTE.surface }}>Cooking Duration</span>
                <input
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-opacity-100 focus:bg-white/[0.02]"
                  style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                  value={draft.cookTime}
                  onChange={(e) => updateField('cookTime', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 col-span-1 md:col-span-2">
                <span className="text-xs font-bold tracking-wide opacity-70" style={{ color: PALETTE.surface }}>Total Elapsed Time</span>
                <input
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-opacity-100 focus:bg-white/[0.02]"
                  style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                  value={draft.totalTime}
                  onChange={(e) => updateField('totalTime', e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Card Module 2: Macronutrient Specifications */}
          <div className="rounded-2xl border p-6 space-y-5" style={{ borderColor: "rgba(242,235,229,0.08)", backgroundColor: "rgba(242,235,229,0.01)" }}>
            <div className="flex items-center gap-2 opacity-80 mb-1">
              <Layers className="w-4 h-4" style={{ color: PALETTE.primary }} />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: PALETTE.surface }}>Macronutrient Breakdown</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold opacity-70" style={{ color: PALETTE.surface }}>Protein (g)</span>
                <input
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm font-semibold transition focus:outline-none focus:border-opacity-100 text-center"
                  style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                  value={draft.protein}
                  onChange={(e) => updateField('protein', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold opacity-70" style={{ color: PALETTE.surface }}>Carbohydrates (g)</span>
                <input
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm font-semibold transition focus:outline-none focus:border-opacity-100 text-center"
                  style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                  value={draft.carbs}
                  onChange={(e) => updateField('carbs', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold opacity-70" style={{ color: PALETTE.surface }}>Lipids/Fat (g)</span>
                <input
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm font-semibold transition focus:outline-none focus:border-opacity-100 text-center"
                  style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                  value={draft.fat}
                  onChange={(e) => updateField('fat', e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Text Areas Module */}
          <div className="space-y-5">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-wide opacity-70" style={{ color: PALETTE.surface }}>Brief Overview Description</span>
              <textarea
                className="w-full min-h-[110px] rounded-xl border bg-transparent px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-opacity-100 resize-none leading-relaxed"
                style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                value={draft.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-wide opacity-70" style={{ color: PALETTE.surface }}>Chef Notes & Reminders</span>
              <textarea
                className="w-full min-h-[90px] rounded-xl border bg-transparent px-4 py-3 text-sm font-medium transition focus:outline-none focus:border-opacity-100 resize-none leading-relaxed"
                style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                value={draft.notes}
                onChange={(e) => updateField('notes', e.target.value)}
              />
            </label>
          </div>

          {/* Card Module 3: Ingredients Row Array */}
          <div className="rounded-2xl border p-6 space-y-4" style={{ borderColor: "rgba(242,235,229,0.08)", backgroundColor: "rgba(242,235,229,0.01)" }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(242,235,229,0.08)" }}>
              <div className="flex items-center gap-2 opacity-80">
                <Utensils className="w-4 h-4" style={{ color: PALETTE.primary }} />
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: PALETTE.surface }}>Required Ingredients</h2>
              </div>
              <button 
                type="button" 
                onClick={addIngredientRow} 
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition hover:bg-white/5 active:scale-[0.98]"
                style={{ borderColor: "rgba(100,114,149,0.4)", background: "rgba(100,114,149,0.1)", color: PALETTE.surface }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Row
              </button>
            </div>

            <div className="space-y-3">
              {draft.ingredients.map((ing, index) => (
                <div key={index} className="flex gap-3 items-center group">
                  <div className="flex-1 grid grid-cols-12 gap-3">
                    <input
                      className="col-span-7 rounded-xl border bg-transparent px-4 py-2.5 text-sm font-medium focus:outline-none focus:bg-white/[0.01]"
                      style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                      placeholder="Ingredient name"
                      value={ing.item}
                      onChange={(e) => updateIngredient(index, { item: e.target.value })}
                    />
                    <input
                      className="col-span-5 rounded-xl border bg-transparent px-4 py-2.5 text-sm font-medium focus:outline-none text-right focus:bg-white/[0.01]"
                      style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                      placeholder="Amount / Volume"
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(index, { quantity: e.target.value })}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeIngredientRow(index)} 
                    className="p-2.5 rounded-xl border transition active:scale-[0.95] hover:bg-red-500/5 flex items-center justify-center self-stretch"
                    style={{ borderColor: "rgba(159,73,110,0.2)", color: PALETTE.secondary }}
                    title="Remove item row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card Module 4: Instructions Workflow Sequence */}
          <div className="rounded-2xl border p-6 space-y-4" style={{ borderColor: "rgba(242,235,229,0.08)", backgroundColor: "rgba(242,235,229,0.01)" }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(242,235,229,0.08)" }}>
              <div className="flex items-center gap-2 opacity-80">
                <ClipboardList className="w-4 h-4" style={{ color: PALETTE.primary }} />
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: PALETTE.surface }}>Preparation Steps</h2>
              </div>
              <button 
                type="button" 
                onClick={addInstructionRow} 
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition hover:bg-white/5 active:scale-[0.98]"
                style={{ borderColor: "rgba(100,114,149,0.4)", background: "rgba(100,114,149,0.1)", color: PALETTE.surface }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Step
              </button>
            </div>

            <div className="space-y-3">
              {draft.instructions.map((st, index) => (
                <div key={index} className="flex gap-3 items-start group">
                  <div className="w-14">
                    <input
                      type="number"
                      className="w-full rounded-xl border bg-transparent px-2 py-2.5 text-sm font-black focus:outline-none text-center"
                      style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.primary }}
                      value={st.stepnumber}
                      onChange={(e) => updateInstruction(index, { stepnumber: Number(e.target.value) })}
                    />
                  </div>
                  <textarea
                    className="flex-1 rounded-xl border bg-transparent px-4 py-2.5 text-sm font-medium focus:outline-none resize-none min-h-[44px] leading-relaxed focus:bg-white/[0.01]"
                    style={{ borderColor: "rgba(242,235,229,0.15)", color: PALETTE.surface }}
                    value={st.description}
                    onChange={(e) => updateInstruction(index, { description: e.target.value })}
                    placeholder="Describe this preparation metric step..."
                  />
                  <button 
                    type="button" 
                    onClick={() => removeInstructionRow(index)} 
                    className="p-2.5 rounded-xl border transition active:scale-[0.95] hover:bg-red-500/5 flex items-center justify-center mt-0.5"
                    style={{ borderColor: "rgba(159,73,110,0.2)", color: PALETTE.secondary }}
                    title="Remove execution step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Save/Cancel Triggers */}
          <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor: "rgba(242,235,229,0.08)" }}>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition shadow-lg active:scale-[0.98] disabled:opacity-50 text-white"
              style={{ background: PALETTE.primary }}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving changes...' : 'Save Changes'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => router.push(`/components/getOne/${id}`)}
              className="px-6 py-3.5 rounded-xl border font-bold text-sm transition hover:bg-white/5 active:scale-[0.98] disabled:opacity-60"
              style={{ borderColor: "rgba(242,235,229,0.15)", background: "transparent", color: "rgba(242,235,229,0.8)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}