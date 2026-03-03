"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Persona } from "@/lib/types";

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("personas")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (!error && data) setPersonas(data as Persona[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  const createPersona = async (
    persona: Omit<Persona, "id" | "created_at" | "updated_at">
  ) => {
    const { data, error } = await supabase
      .from("personas")
      .insert(persona)
      .select()
      .single();
    if (error) throw error;
    setPersonas((prev) => [...prev, data as Persona]);
    return data as Persona;
  };

  const updatePersona = async (id: string, updates: Partial<Persona>) => {
    const { data, error } = await supabase
      .from("personas")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    setPersonas((prev) => prev.map((p) => (p.id === id ? (data as Persona) : p)));
    return data as Persona;
  };

  const deletePersona = async (id: string) => {
    const { error } = await supabase.from("personas").delete().eq("id", id);
    if (error) throw error;
    setPersonas((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    personas,
    loading,
    fetchPersonas,
    createPersona,
    updatePersona,
    deletePersona,
  };
}
