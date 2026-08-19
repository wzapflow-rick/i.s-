"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { submitLead } from "@/app/actions/submit-lead";
import { SITE_IMAGES } from "@/lib/site-images";
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
  { title: "Vamos começar pelo básico." },
  { title: "Seu negócio." },
  { title: "Sua operação." },
  { title: "O que você procura." },
  { title: "Seu momento." },
  { title: "Vamos conversar." },
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
      className="relative scroll-mt-20 overflow-hidden bg-[#0b0a09] text-[#f4efe4]"
    >
      {/* Fotografia cinematográfica — sangra na borda direita (desktop).
          Funde-se ao preto pela esquerda, sem parecer um card. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
        <Image
          src={SITE_IMAGES.hero.src}
          alt={SITE_IMAGES.hero.alt}
          fill
          sizes="46vw"
          className="object-cover"
          style={{
            objectPosition: "center 45%",
            // Tratamento gastronômico premium: dessatura o excesso de quente,
            // esfria levemente os tons, aprofunda os pretos e reforça o
            // contraste — mantém real e apetitoso, sem filtro marrom.
            filter:
              "saturate(0.72) contrast(1.18) brightness(0.9) hue-rotate(-8deg)",
          }}
        />
        {/* fade horizontal forte — mantém a esquerda da faixa quase preta
            (para o formulário respirar) e revela a foto só no terço direito */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #0b0a09 0%, #0b0a09 52%, rgba(11,10,9,0.55) 74%, rgba(11,10,9,0) 100%)",
          }}
        />
        {/* vinheta vertical sutil — profundidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a09]/70 via-transparent to-[#0b0a09]/25" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid items-start gap-x-14 gap-y-12 lg:grid-cols-12">
          {/* ESQUERDA — editorial. A headline é o maior elemento. */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="mb-7 font-sans text-[0.68rem] uppercase tracking-eyebrow text-[color:var(--accent-soft)]">
                A parceria
              </p>
              <h2 className="max-w-[20ch] font-serif text-[2.1rem] leading-[1.08] tracking-tight text-pretty text-[#f7f2e8] sm:text-[2.35rem] lg:text-[2.5rem]">
                Vamos descobrir a combinação perfeita para o seu negócio?
              </h2>
              <p className="mt-8 max-w-sm font-sans text-base leading-relaxed text-[#f4efe4]/55">
                Conte um pouco sobre a sua operação. A gente quer entender onde a
                i.sí pode fazer sentido para você.
              </p>
            </Reveal>
          </div>

          {/* Fotografia no mobile — entre o texto e o formulário, com impacto. */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg lg:hidden">
            <Image
              src={SITE_IMAGES.hero.src}
              alt={SITE_IMAGES.hero.alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{
                objectPosition: "center 45%",
                filter:
                  "saturate(0.72) contrast(1.18) brightness(0.9) hue-rotate(-8deg)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a09]/55 via-transparent to-transparent" />
          </div>

          {/* CENTRO — formulário compacto, integrado (sem card). */}
          <div className="lg:col-span-4 lg:col-start-6">
            <Reveal delay={0.1}>
              {/* Progresso discreto: 01 / 06 + linha fina */}
              <div className="mb-6">
                <div className="mb-2 flex items-baseline gap-1.5 font-sans text-[0.7rem] tabular-nums tracking-wide-editorial">
                  <span className="text-[color:var(--accent-soft)]">
                    {String(step + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[#f4efe4]/30">/</span>
                  <span className="text-[#f4efe4]/40">
                    {String(TOTAL).padStart(2, "0")}
                  </span>
                </div>
                <div className="h-px w-full bg-[#f4efe4]/12">
                  <motion.div
                    className="h-px bg-[color:var(--accent-soft)]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <h3 className="mb-6 font-serif text-xl tracking-tight text-[#f7f2e8] sm:text-2xl">
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
                <p role="alert" className="mt-6 rounded-md bg-[#e2a5a0]/10 px-4 py-3 font-sans text-sm text-[#e2a5a0]">
                  {submitError}
                </p>
              )}

              {/* Navegação */}
              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0 || loading}
                  className="font-sans text-[0.7rem] uppercase tracking-wide-editorial text-[#f4efe4]/45 transition-colors hover:text-[#f4efe4] disabled:pointer-events-none disabled:opacity-0"
                >
                  ← Voltar
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={loading}
                  className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-[#f4efe4] px-7 py-3.5 font-sans text-[0.72rem] tracking-wide-editorial text-[#0b0a09] transition-colors hover:bg-white disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="size-3.5 animate-spin rounded-full border-[1.5px] border-[#0b0a09]/30 border-t-[#0b0a09]" />
                      Enviando
                    </>
                  ) : step === TOTAL - 1 ? (
                    <>
                      Quero conversar com a i.sí
                      <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </>
                  ) : (
                    <>
                      Vamos continuar
                      <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </>
                  )}
                </button>
              </div>

              {/* Microcopy discreta */}
              <p className="mt-5 font-sans text-[0.72rem] leading-relaxed text-[#f4efe4]/55">
                {step === TOTAL - 1
                  ? "Seus dados serão usados apenas para contato comercial."
                  : "Leva menos de 2 minutos."}
              </p>
            </Reveal>
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
