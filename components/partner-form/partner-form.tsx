"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { submitLead } from "@/app/actions/submit-lead";
import {
  OBJECTIVE_OPTIONS,
  SEGMENT_OPTIONS,
  START_INTENT_OPTIONS,
  type LeadInput,
} from "@/lib/leads/types";
import { EMPTY_LEAD, validateStep, type LeadErrors } from "@/lib/leads/validation";
import { Reveal } from "@/components/ui/reveal";
import { SuccessJourney } from "@/components/success/success-journey";
import {
  FieldError,
  FieldLabel,
  OptionGrid,
  TextArea,
  TextField,
} from "./fields";

const STEP_META = [
  { eyebrow: "Etapa 1 de 6", title: "Sobre você" },
  { eyebrow: "Etapa 2 de 6", title: "Sobre a empresa" },
  { eyebrow: "Etapa 3 de 6", title: "Seu negócio" },
  { eyebrow: "Etapa 4 de 6", title: "Sua operação" },
  { eyebrow: "Etapa 5 de 6", title: "O que você busca?" },
  { eyebrow: "Etapa 6 de 6", title: "Motivação" },
];

const TOTAL = STEP_META.length;

export function PartnerForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<LeadInput>(EMPTY_LEAD);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function goNext() {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (step < TOTAL - 1) {
      setDir(1);
      setStep((s) => s + 1);
    } else {
      void handleSubmit();
    }
  }

  function goBack() {
    setSubmitError(null);
    if (step > 0) {
      setDir(-1);
      setStep((s) => s - 1);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setSubmitError(null);
    try {
      const res = await submitLead(data);
      if (res.ok) {
        setDone(true);
      } else {
        setSubmitError(res.message);
      }
    } catch {
      setSubmitError("Não foi possível enviar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <section id="formulario" className="scroll-mt-20 border-t border-border bg-background">
        <SuccessJourney company={data.company} />
      </section>
    );
  }

  const progress = ((step + 1) / TOTAL) * 100;

  return (
    <section
      id="formulario"
      className="scroll-mt-20 border-t border-border bg-background"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-36">
        {/* Coluna editorial */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
              A parceria
            </p>
            <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:sticky lg:top-32">
              Talvez seja hora de combinar.
            </h2>
            <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-muted-foreground lg:sticky lg:top-56">
              Conte um pouco sobre o seu negócio. Vamos entender se existe uma
              boa combinação entre a sua operação e a i.sí.
            </p>
          </Reveal>
        </div>

        {/* Formulário */}
        <div className="lg:col-span-7">
          <div className="rounded-lg border border-border bg-card p-6 sm:p-10">
            {/* Progresso */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-sans text-[0.66rem] uppercase tracking-wide-editorial text-accent">
                  {STEP_META[step].eyebrow}
                </span>
                <span className="font-sans text-[0.66rem] tabular-nums text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-px w-full bg-border">
                <motion.div
                  className="h-px bg-accent"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <h3 className="mb-8 font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
              {STEP_META[step].title}
            </h3>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepFields step={step} data={data} errors={errors} set={set} />
                </motion.div>
              </AnimatePresence>
            </div>

            {submitError && (
              <p role="alert" className="mt-6 rounded-md bg-acai/10 px-4 py-3 font-sans text-sm text-acai">
                {submitError}
              </p>
            )}

            {/* Navegação */}
            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0 || loading}
                className="font-sans text-[0.7rem] uppercase tracking-wide-editorial text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
              >
                ← Voltar
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={loading}
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 font-sans text-[0.7rem] uppercase tracking-wide-editorial text-ink-foreground transition-colors hover:bg-foreground disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-[1.5px] border-ink-foreground/40 border-t-ink-foreground" />
                    Enviando
                  </>
                ) : step === TOTAL - 1 ? (
                  <>
                    Quero conhecer a parceria
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </>
                ) : (
                  <>
                    Continuar
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepFields({
  step,
  data,
  errors,
  set,
}: {
  step: number;
  data: LeadInput;
  errors: LeadErrors;
  set: <K extends keyof LeadInput>(key: K, value: LeadInput[K]) => void;
}) {
  switch (step) {
    case 0:
      return (
        <div className="space-y-6">
          <div>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <TextField
              id="name"
              value={data.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Seu nome completo"
              error={errors.name}
              autoComplete="name"
            />
            <FieldError message={errors.name} />
          </div>
          <div>
            <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
            <TextField
              id="whatsapp"
              value={data.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder="(00) 00000-0000"
              inputMode="tel"
              error={errors.whatsapp}
              autoComplete="tel"
            />
            <FieldError message={errors.whatsapp} />
          </div>
          <div>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <TextField
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="voce@empresa.com"
              error={errors.email}
              autoComplete="email"
            />
            <FieldError message={errors.email} />
          </div>
        </div>
      );
    case 1:
      return (
        <div className="space-y-6">
          <div>
            <FieldLabel htmlFor="company">Empresa</FieldLabel>
            <TextField
              id="company"
              value={data.company}
              onChange={(e) => set("company", e.target.value)}
              placeholder="Nome do seu negócio"
              error={errors.company}
              autoComplete="organization"
            />
            <FieldError message={errors.company} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="city">Cidade</FieldLabel>
              <TextField
                id="city"
                value={data.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Cidade"
                error={errors.city}
                autoComplete="address-level2"
              />
              <FieldError message={errors.city} />
            </div>
            <div>
              <FieldLabel htmlFor="state">Estado</FieldLabel>
              <TextField
                id="state"
                value={data.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="UF"
                error={errors.state}
                autoComplete="address-level1"
              />
              <FieldError message={errors.state} />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="instagram" optional>
              Instagram / site
            </FieldLabel>
            <TextField
              id="instagram"
              value={data.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              placeholder="@seunegocio ou www.seunegocio.com"
            />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="space-y-6">
          <div>
            <FieldLabel htmlFor="segment">Segmento</FieldLabel>
            <OptionGrid
              name="Segmento"
              value={data.segment}
              onChange={(v) => set("segment", v as LeadInput["segment"])}
              options={SEGMENT_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.segment} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="units">Número de unidades</FieldLabel>
              <TextField
                id="units"
                value={data.units}
                onChange={(e) => set("units", e.target.value)}
                placeholder="Ex.: 1, 2, 5+"
                inputMode="numeric"
                error={errors.units}
              />
              <FieldError message={errors.units} />
            </div>
            <div>
              <FieldLabel htmlFor="businessAge">Tempo de operação</FieldLabel>
              <TextField
                id="businessAge"
                value={data.businessAge}
                onChange={(e) => set("businessAge", e.target.value)}
                placeholder="Ex.: 2 anos"
                error={errors.businessAge}
              />
              <FieldError message={errors.businessAge} />
            </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="averageRevenue">Faturamento médio</FieldLabel>
              <TextField
                id="averageRevenue"
                value={data.averageRevenue}
                onChange={(e) => set("averageRevenue", e.target.value)}
                placeholder="Ex.: R$ 30 mil/mês"
                error={errors.averageRevenue}
              />
              <FieldError message={errors.averageRevenue} />
            </div>
            <div>
              <FieldLabel htmlFor="orderVolume">Volume de vendas/pedidos</FieldLabel>
              <TextField
                id="orderVolume"
                value={data.orderVolume}
                onChange={(e) => set("orderVolume", e.target.value)}
                placeholder="Ex.: 500 pedidos/mês"
                error={errors.orderVolume}
              />
              <FieldError message={errors.orderVolume} />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="currentSupplier" optional>
              Fornecedor atual
            </FieldLabel>
            <TextField
              id="currentSupplier"
              value={data.currentSupplier}
              onChange={(e) => set("currentSupplier", e.target.value)}
              placeholder="Se aplicável"
            />
          </div>
          <div>
            <FieldLabel htmlFor="purchaseVolume">
              Volume aproximado de compra
            </FieldLabel>
            <TextField
              id="purchaseVolume"
              value={data.purchaseVolume}
              onChange={(e) => set("purchaseVolume", e.target.value)}
              placeholder="Ex.: 40L a 80L por mês"
              error={errors.purchaseVolume}
            />
            <FieldError message={errors.purchaseVolume} />
          </div>
        </div>
      );
    case 4:
      return (
        <div className="space-y-8">
          <div className="space-y-3">
            <FieldLabel htmlFor="objective">O que você busca?</FieldLabel>
            <OptionGrid
              name="Objetivo"
              value={data.objective}
              onChange={(v) => set("objective", v as LeadInput["objective"])}
              options={OBJECTIVE_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.objective} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="startIntent">
              Quando pretende começar?
            </FieldLabel>
            <OptionGrid
              name="Intenção de início"
              value={data.startIntent}
              onChange={(v) => set("startIntent", v as LeadInput["startIntent"])}
              options={START_INTENT_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.startIntent} />
          </div>
        </div>
      );
    case 5:
      return (
        <div>
          <FieldLabel htmlFor="motivation">
            Por que você quer trabalhar com a i.sí?
          </FieldLabel>
          <TextArea
            id="motivation"
            value={data.motivation}
            onChange={(e) => set("motivation", e.target.value)}
            placeholder="Conte o que te motiva a buscar essa parceria..."
            error={errors.motivation}
          />
          <FieldError message={errors.motivation} />
        </div>
      );
    default:
      return null;
  }
}
