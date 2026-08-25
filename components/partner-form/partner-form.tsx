"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { submitLead } from "@/app/actions/submit-lead";
import { SITE_IMAGES } from "@/lib/site-images";
import {
  SERVICE_TYPE_OPTIONS,
  OPERATION_MODEL_OPTIONS,
  POSITIONING_OPTIONS,
  AUDIENCE_OPTIONS,
  SUPPLIER_VALUE_OPTIONS,
  MONTHLY_VOLUME_OPTIONS,
  RESTOCK_OPTIONS,
  PREMIUM_SPACE_OPTIONS,
  PURCHASE_EXPECTATION_OPTIONS,
  FIRST_PURCHASE_OPTIONS,
  BRAND_STRATEGY_OPTIONS,
  PAYMENT_OPTIONS,
  INNOVATION_OPTIONS,
  YES_NO_OPTIONS,
  type LeadInput,
} from "@/lib/leads/types";
import { EMPTY_LEAD, validateStep, type LeadErrors } from "@/lib/leads/validation";
import { Reveal } from "@/components/ui/reveal";
import { NeonPill } from "@/components/ui/neon-pill";
import { SuccessJourney } from "@/components/success/success-journey";
import {
  FieldError,
  FieldLabel,
  OptionGrid,
  TextArea,
  TextField,
} from "./fields";

const STEP_META = [
  { title: "Sobre a empresa." },
  { title: "Posicionamento da loja." },
  { title: "Perfil de consumo." },
  { title: "Estrutura e operação." },
  { title: "Compra e potencial comercial." },
  { title: "Perfil financeiro e comercial." },
  { title: "Identificação do perfil i.sí." },
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
                  className="group relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-[#f4efe4] px-7 py-3.5 font-sans text-[0.72rem] tracking-wide-editorial text-[#0b0a09] transition-colors hover:bg-white disabled:opacity-70"
                >
                  <NeonPill />
                  {loading ? (
                    <span className="relative z-10 inline-flex items-center gap-2.5">
                      <span className="size-3.5 animate-spin rounded-full border-[1.5px] border-[#0b0a09]/30 border-t-[#0b0a09]" />
                      Enviando
                    </span>
                  ) : step === TOTAL - 1 ? (
                    <span className="relative z-10 inline-flex items-center gap-2.5">
                      Quero conversar com a i.sí
                      <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </span>
                  ) : (
                    <span className="relative z-10 inline-flex items-center gap-2.5">
                      Vamos continuar
                      <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Microcopy discreta */}
              <p className="mt-5 font-sans text-[0.72rem] leading-relaxed text-[#f4efe4]/55">
                {step === TOTAL - 1
                  ? "Seus dados serão usados apenas para contato comercial."
                  : "Suas respostas ajudam a i.sí a entender sua operação."}
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
    // 1 — SOBRE A EMPRESA
    case 0:
      return (
        <div className="space-y-6">
          <div>
            <FieldLabel htmlFor="company">Nome da empresa</FieldLabel>
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
          <div>
            <FieldLabel htmlFor="responsibleName">Nome do responsável</FieldLabel>
            <TextField
              id="responsibleName"
              value={data.responsibleName}
              onChange={(e) => set("responsibleName", e.target.value)}
              placeholder="Quem responde pela operação"
              error={errors.responsibleName}
              autoComplete="name"
            />
            <FieldError message={errors.responsibleName} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="whatsapp">Telefone / WhatsApp</FieldLabel>
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
              <FieldLabel htmlFor="cityState">Cidade / Estado</FieldLabel>
              <TextField
                id="cityState"
                value={data.cityState}
                onChange={(e) => set("cityState", e.target.value)}
                placeholder="Ex.: São Paulo / SP"
                error={errors.cityState}
              />
              <FieldError message={errors.cityState} />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="instagram" optional>
              Instagram da empresa
            </FieldLabel>
            <TextField
              id="instagram"
              value={data.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              placeholder="@seunegocio"
            />
          </div>
          <div>
            <FieldLabel htmlFor="operationModel">Modelo da operação</FieldLabel>
            <OptionGrid
              name="Modelo da operação"
              value={data.operationModel}
              onChange={(v) => set("operationModel", v)}
              options={OPERATION_MODEL_OPTIONS}
              columns={3}
            />
            <FieldError message={errors.operationModel} />
          </div>
          <div>
            <FieldLabel htmlFor="serviceType">Tipo de operação da loja</FieldLabel>
            <OptionGrid
              name="Tipo de operação"
              value={data.serviceType}
              onChange={(v) => set("serviceType", v)}
              options={SERVICE_TYPE_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.serviceType} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="businessAge">Tempo de funcionamento</FieldLabel>
              <TextField
                id="businessAge"
                value={data.businessAge}
                onChange={(e) => set("businessAge", e.target.value)}
                placeholder="Ex.: 2 anos"
                error={errors.businessAge}
              />
              <FieldError message={errors.businessAge} />
            </div>
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
          </div>
        </div>
      );

    // 2 — POSICIONAMENTO DA LOJA
    case 1:
      return (
        <div className="space-y-8">
          <div className="space-y-3">
            <FieldLabel htmlFor="positioning">
              Como você definiria o posicionamento da sua loja?
            </FieldLabel>
            <OptionGrid
              name="Posicionamento"
              value={data.positioning}
              onChange={(v) => set("positioning", v)}
              options={POSITIONING_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.positioning} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="mainAudience">
              Qual é o principal público da sua loja?
            </FieldLabel>
            <OptionGrid
              name="Público principal"
              value={data.mainAudience}
              onChange={(v) => set("mainAudience", v)}
              options={AUDIENCE_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.mainAudience} />
          </div>
          <div>
            <FieldLabel htmlFor="averageTicket">
              Ticket médio aproximado dos clientes
            </FieldLabel>
            <TextField
              id="averageTicket"
              value={data.averageTicket}
              onChange={(e) => set("averageTicket", e.target.value)}
              placeholder="Ex.: R$ 25"
              error={errors.averageTicket}
            />
            <FieldError message={errors.averageTicket} />
          </div>
          <div>
            <FieldLabel htmlFor="currentBrands">
              Quais marcas de sorvete/gelato você trabalha atualmente?
            </FieldLabel>
            <TextField
              id="currentBrands"
              value={data.currentBrands}
              onChange={(e) => set("currentBrands", e.target.value)}
              placeholder="Cite as principais"
              error={errors.currentBrands}
            />
            <FieldError message={errors.currentBrands} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="supplierValue">
              O que você mais valoriza ao escolher um fornecedor?
            </FieldLabel>
            <OptionGrid
              name="Valor no fornecedor"
              value={data.supplierValue}
              onChange={(v) => set("supplierValue", v)}
              options={SUPPLIER_VALUE_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.supplierValue} />
          </div>
        </div>
      );

    // 3 — PERFIL DE CONSUMO
    case 2:
      return (
        <div className="space-y-8">
          <div>
            <FieldLabel htmlFor="mainProduct">
              Qual é o principal produto vendido pela sua loja atualmente?
            </FieldLabel>
            <TextField
              id="mainProduct"
              value={data.mainProduct}
              onChange={(e) => set("mainProduct", e.target.value)}
              placeholder="Ex.: açaí, sorvete, gelato..."
              error={errors.mainProduct}
            />
            <FieldError message={errors.mainProduct} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="monthlyVolume">
              Volume aproximado de sorvete/gelato vendido por mês
            </FieldLabel>
            <OptionGrid
              name="Volume mensal"
              value={data.monthlyVolume}
              onChange={(v) => set("monthlyVolume", v)}
              options={MONTHLY_VOLUME_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.monthlyVolume} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="simultaneousFlavors">
                Sabores trabalhados simultaneamente
              </FieldLabel>
              <TextField
                id="simultaneousFlavors"
                value={data.simultaneousFlavors}
                onChange={(e) => set("simultaneousFlavors", e.target.value)}
                placeholder="Ex.: 12"
                inputMode="numeric"
                error={errors.simultaneousFlavors}
              />
              <FieldError message={errors.simultaneousFlavors} />
            </div>
            <div>
              <FieldLabel htmlFor="averagePortionPrice">
                Preço médio de uma porção
              </FieldLabel>
              <TextField
                id="averagePortionPrice"
                value={data.averagePortionPrice}
                onChange={(e) => set("averagePortionPrice", e.target.value)}
                placeholder="Ex.: R$ 18"
                error={errors.averagePortionPrice}
              />
              <FieldError message={errors.averagePortionPrice} />
            </div>
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="higherValueProducts">
              Você trabalha com produtos de maior valor agregado?
            </FieldLabel>
            <OptionGrid
              name="Produtos de maior valor"
              value={data.higherValueProducts}
              onChange={(v) => set("higherValueProducts", v)}
              options={YES_NO_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.higherValueProducts} />
          </div>
        </div>
      );

    // 4 — ESTRUTURA E OPERAÇÃO
    case 3:
      return (
        <div className="space-y-8">
          <div>
            <FieldLabel htmlFor="freezers">
              Quantos freezers/expositores possui atualmente?
            </FieldLabel>
            <TextField
              id="freezers"
              value={data.freezers}
              onChange={(e) => set("freezers", e.target.value)}
              placeholder="Ex.: 3"
              inputMode="numeric"
              error={errors.freezers}
            />
            <FieldError message={errors.freezers} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="restockFrequency">
              Como funciona sua reposição de estoque?
            </FieldLabel>
            <OptionGrid
              name="Reposição de estoque"
              value={data.restockFrequency}
              onChange={(v) => set("restockFrequency", v)}
              options={RESTOCK_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.restockFrequency} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="salesTeam">
              Possui equipe responsável pela apresentação e venda dos produtos?
            </FieldLabel>
            <OptionGrid
              name="Equipe de vendas"
              value={data.salesTeam}
              onChange={(v) => set("salesTeam", v)}
              options={YES_NO_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.salesTeam} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="premiumSpace">
              A loja possui espaço adequado para exposição de uma linha premium?
            </FieldLabel>
            <OptionGrid
              name="Espaço para linha premium"
              value={data.premiumSpace}
              onChange={(v) => set("premiumSpace", v)}
              options={PREMIUM_SPACE_OPTIONS}
              columns={3}
            />
            <FieldError message={errors.premiumSpace} />
          </div>
          <div>
            <FieldLabel htmlFor="displayDetails">
              Detalhes da exposição dos produtos e atendimento na sua loja
            </FieldLabel>
            <TextArea
              id="displayDetails"
              value={data.displayDetails}
              onChange={(e) => set("displayDetails", e.target.value)}
              placeholder="Como os produtos são expostos e como é o atendimento..."
              error={errors.displayDetails}
            />
            <FieldError message={errors.displayDetails} />
          </div>
          <div>
            <FieldLabel htmlFor="staffInfo">
              Quantidade de funcionários e cargos
            </FieldLabel>
            <TextField
              id="staffInfo"
              value={data.staffInfo}
              onChange={(e) => set("staffInfo", e.target.value)}
              placeholder="Ex.: 5 funcionários (2 atendentes, 1 gerente...)"
              error={errors.staffInfo}
            />
            <FieldError message={errors.staffInfo} />
          </div>
        </div>
      );

    // 5 — COMPRA E POTENCIAL COMERCIAL
    case 4:
      return (
        <div className="space-y-8">
          <div className="space-y-3">
            <FieldLabel htmlFor="purchaseExpectation">
              Expectativa inicial de compra da i.sí (baldes por mês)
            </FieldLabel>
            <OptionGrid
              name="Expectativa de compra"
              value={data.purchaseExpectation}
              onChange={(v) => set("purchaseExpectation", v)}
              options={PURCHASE_EXPECTATION_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.purchaseExpectation} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="firstPurchaseTime">
              Caso aprovado, em quanto tempo pretende realizar a primeira compra?
            </FieldLabel>
            <OptionGrid
              name="Prazo da primeira compra"
              value={data.firstPurchaseTime}
              onChange={(v) => set("firstPurchaseTime", v)}
              options={FIRST_PURCHASE_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.firstPurchaseTime} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="exclusiveFlavors">
              Interesse em desenvolver sabores/produtos exclusivos com a i.sí?
            </FieldLabel>
            <OptionGrid
              name="Sabores exclusivos"
              value={data.exclusiveFlavors}
              onChange={(v) => set("exclusiveFlavors", v)}
              options={YES_NO_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.exclusiveFlavors} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="brandStrategy">
              Como pretende trabalhar a marca i.sí?
            </FieldLabel>
            <OptionGrid
              name="Estratégia da marca"
              value={data.brandStrategy}
              onChange={(v) => set("brandStrategy", v)}
              options={BRAND_STRATEGY_OPTIONS}
              columns={3}
            />
            <FieldError message={errors.brandStrategy} />
          </div>
        </div>
      );

    // 6 — PERFIL FINANCEIRO E COMERCIAL
    case 5:
      return (
        <div className="space-y-8">
          <div>
            <FieldLabel htmlFor="supplierFrequency">
              Frequência média de compra dos seus fornecedores
            </FieldLabel>
            <TextField
              id="supplierFrequency"
              value={data.supplierFrequency}
              onChange={(e) => set("supplierFrequency", e.target.value)}
              placeholder="Ex.: semanal, quinzenal..."
              error={errors.supplierFrequency}
            />
            <FieldError message={errors.supplierFrequency} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="paymentMethod">
              Como normalmente realiza seus pagamentos?
            </FieldLabel>
            <OptionGrid
              name="Forma de pagamento"
              value={data.paymentMethod}
              onChange={(v) => set("paymentMethod", v)}
              options={PAYMENT_OPTIONS}
              columns={3}
            />
            <FieldError message={errors.paymentMethod} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="dependsOnTerm">
              Depende de prazo para compra?
            </FieldLabel>
            <OptionGrid
              name="Depende de prazo"
              value={data.dependsOnTerm}
              onChange={(v) => set("dependsOnTerm", v)}
              options={YES_NO_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.dependsOnTerm} />
          </div>
        </div>
      );

    // 7 — IDENTIFICAÇÃO DO PERFIL i.sí
    case 6:
      return (
        <div className="space-y-8">
          <div>
            <FieldLabel htmlFor="expectation">
              O que você espera encontrar em um produto como a i.sí?
            </FieldLabel>
            <TextArea
              id="expectation"
              value={data.expectation}
              onChange={(e) => set("expectation", e.target.value)}
              placeholder="Conte o que é essencial para você..."
              error={errors.expectation}
            />
            <FieldError message={errors.expectation} />
          </div>
          <div>
            <FieldLabel htmlFor="premiumMeaning">
              O que significa &quot;produto premium&quot; para você?
            </FieldLabel>
            <TextField
              id="premiumMeaning"
              value={data.premiumMeaning}
              onChange={(e) => set("premiumMeaning", e.target.value)}
              placeholder="Em poucas palavras"
              error={errors.premiumMeaning}
            />
            <FieldError message={errors.premiumMeaning} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="innovationImportance">
              Importância da inovação de sabores para sua loja
            </FieldLabel>
            <OptionGrid
              name="Importância da inovação"
              value={data.innovationImportance}
              onChange={(v) => set("innovationImportance", v)}
              options={INNOVATION_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.innovationImportance} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="willingHigherPrice">
              Trabalharia produtos com preço superior, havendo percepção real de
              valor pelo consumidor?
            </FieldLabel>
            <OptionGrid
              name="Disposição a preço superior"
              value={data.willingHigherPrice}
              onChange={(v) => set("willingHigherPrice", v)}
              options={YES_NO_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.willingHigherPrice} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="interestLaunches">
              Tem interesse em participar de lançamentos e testes de novos sabores?
            </FieldLabel>
            <OptionGrid
              name="Interesse em lançamentos"
              value={data.interestLaunches}
              onChange={(v) => set("interestLaunches", v)}
              options={YES_NO_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.interestLaunches} />
          </div>
          <div className="space-y-3">
            <FieldLabel htmlFor="followBrandGuidelines">
              Apresentaria a i.sí conforme as orientações de exposição e
              posicionamento da marca?
            </FieldLabel>
            <OptionGrid
              name="Seguir orientações da marca"
              value={data.followBrandGuidelines}
              onChange={(v) => set("followBrandGuidelines", v)}
              options={YES_NO_OPTIONS}
              columns={2}
            />
            <FieldError message={errors.followBrandGuidelines} />
          </div>
          <div>
            <FieldLabel htmlFor="whyMatch">
              Por que você acredita que a i.sí combina com a sua loja?
            </FieldLabel>
            <TextArea
              id="whyMatch"
              value={data.whyMatch}
              onChange={(e) => set("whyMatch", e.target.value)}
              placeholder="Conte o que te motiva a buscar essa parceria..."
              error={errors.whyMatch}
            />
            <FieldError message={errors.whyMatch} />
          </div>
        </div>
      );

    default:
      return null;
  }
}
