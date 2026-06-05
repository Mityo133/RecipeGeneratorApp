'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, EyeOff } from "lucide-react";
import { supabase, GetRecipeById, DeleteRecipe } from "@/app/interfaces/utilities/fetching";
import { FullRecipe } from "@/app/interfaces/obj";
import type { User } from "@supabase/supabase-js";
import Card from "./card";

const PALETTE = {
  bg: "#2B262D", // Charcoal Dark
  surface: "#F2EBE5", // Warm Alabaster
  primary: "#647295", // Slate Blue
  secondary: "#9F496E", // Muted Berry
};

export default function Details({ id }: { id: string }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchRecipeAndUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

        const result: FullRecipe = await GetRecipeById(id);
        setRecipe(result);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeAndUser();
  }, [id]);

  const ownerMatch =
    !!user?.id &&
    !!recipe?.recipe?.id &&
    // IMPORTANT: preserve exact backend casing formatting
    (recipe.recipe as any)?.user_id === user.id;

  if (loading) {
    return (
      /* Removed the inline background constraint entirely from wrapper */
      <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-xl border"
          style={{
            borderColor: "rgba(242,235,229,0.12)",
            background: "transparent", /* Changed to flat transparent */
          }}
        >
          <div className="p-8 md:p-10 space-y-5 flex flex-col items-center">
            <div className="relative">
              <Loader2 className="w-10 h-10" style={{ color: PALETTE.primary }} />
              <div
                className="absolute inset-0 -m-2 rounded-full animate-[pulse_1.8s_ease-in-out_infinite]"
                style={{
                  background: `radial-gradient(circle, ${PALETTE.primary}33 0%, transparent 60%)`,
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(242,235,229,0.6)" }}>
                Loading Recipe
              </p>
              <p className="mt-2 text-sm font-medium" style={{ color: "rgba(242,235,229,0.92)" }}>
                Preparing your culinary blueprint…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      /* Removed inline background constraint from wrapper */
      <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-xl border"
          style={{
            borderColor: "rgba(242,235,229,0.12)",
            background: "transparent", /* Changed to flat transparent */
          }}
        >
          <div className="p-8 md:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(159,73,110,0.08)",
                  border: "1px solid rgba(159,73,110,0.2)",
                }}
              >
                <EyeOff className="w-6 h-6" style={{ color: PALETTE.secondary }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: PALETTE.surface }}>
                  Recipe not found
                </h2>
                <p className="text-sm" style={{ color: "rgba(242,235,229,0.65)" }}>
                  This blueprint may have been removed or no longer exists.
                </p>
              </div>
            </div>

            <Link
              href="/components/getAll"
              className="inline-flex items-center justify-center gap-2 w-full rounded-lg border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98]"
              style={{
                borderColor: "rgba(242,235,229,0.18)",
                background: "rgba(242,235,229,0.02)",
                color: PALETTE.surface,
              }}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: PALETTE.primary }} />
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    /* Removed the wrapper's absolute background styling to allow true minimalism */
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between gap-3">
        <Link
          href="/components/getAll"
          className="inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition active:scale-[0.98]"
          style={{
            borderColor: "rgba(242,235,229,0.15)",
            background: "transparent",
            color: "rgba(242,235,229,0.92)",
          }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: PALETTE.primary }} />
          Browse Feed
        </Link>

        {ownerMatch ? (
          <div className="flex items-center gap-2">
            <Link
              href={`/components/editRecipe/${recipe.recipe?.id}`}
              className="px-3 py-2 rounded-lg border text-sm font-semibold transition active:scale-[0.98]"
              style={{
                borderColor: "rgba(100,114,149,0.45)",
                background: "rgba(100,114,149,0.15)",
                color: PALETTE.surface,
              }}
            >
              Edit
            </Link>

            <button
              className="px-3 py-2 rounded-lg border text-sm font-semibold transition active:scale-[0.98]"
              style={{
                borderColor: "rgba(159,73,110,0.25)",
                background: "transparent",
                color: "rgba(242,235,229,0.85)",
              }}
              onClick={async () => {
                if (recipe.recipe?.user_id && user?.id) {
                  await DeleteRecipe(recipe.recipe.id, user.id);
                }
                router.push("/components/getAll");
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>

      <Card data={recipe} />
    </div>
  );
}