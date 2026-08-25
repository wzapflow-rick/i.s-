-- ============================================================
-- i.sí — Tabela de leads (cadastro de interesse comercial)
-- Rode este script no Query Tool do pgAdmin, no banco desejado.
-- Idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
  id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- 1 — Sobre a empresa
  company                   TEXT NOT NULL DEFAULT '',
  responsible_name          TEXT NOT NULL DEFAULT '',
  whatsapp                  TEXT NOT NULL DEFAULT '',
  instagram                 TEXT,
  city_state                TEXT NOT NULL DEFAULT '',
  business_age              TEXT NOT NULL DEFAULT '',
  operation_model           TEXT NOT NULL DEFAULT '',
  service_type              TEXT NOT NULL DEFAULT '',
  units                     TEXT NOT NULL DEFAULT '',

  -- 2 — Posicionamento da loja
  positioning               TEXT NOT NULL DEFAULT '',
  main_audience             TEXT NOT NULL DEFAULT '',
  average_ticket            TEXT NOT NULL DEFAULT '',
  current_brands            TEXT NOT NULL DEFAULT '',
  supplier_value            TEXT NOT NULL DEFAULT '',

  -- 3 — Perfil de consumo
  main_product              TEXT NOT NULL DEFAULT '',
  monthly_volume            TEXT NOT NULL DEFAULT '',
  simultaneous_flavors      TEXT NOT NULL DEFAULT '',
  higher_value_products     TEXT NOT NULL DEFAULT '',
  average_portion_price     TEXT NOT NULL DEFAULT '',

  -- 4 — Estrutura e operação
  freezers                  TEXT NOT NULL DEFAULT '',
  restock_frequency         TEXT NOT NULL DEFAULT '',
  sales_team                TEXT NOT NULL DEFAULT '',
  premium_space             TEXT NOT NULL DEFAULT '',
  display_details           TEXT NOT NULL DEFAULT '',
  staff_info                TEXT NOT NULL DEFAULT '',

  -- 5 — Compra e potencial comercial
  purchase_expectation      TEXT NOT NULL DEFAULT '',
  first_purchase_time       TEXT NOT NULL DEFAULT '',
  exclusive_flavors         TEXT NOT NULL DEFAULT '',
  brand_strategy            TEXT NOT NULL DEFAULT '',

  -- 6 — Perfil financeiro e comercial
  supplier_frequency        TEXT NOT NULL DEFAULT '',
  payment_method            TEXT NOT NULL DEFAULT '',
  depends_on_term           TEXT NOT NULL DEFAULT '',

  -- 7 — Identificação do perfil i.sí
  expectation               TEXT NOT NULL DEFAULT '',
  premium_meaning           TEXT NOT NULL DEFAULT '',
  innovation_importance     TEXT NOT NULL DEFAULT '',
  willing_higher_price      TEXT NOT NULL DEFAULT '',
  interest_launches         TEXT NOT NULL DEFAULT '',
  follow_brand_guidelines   TEXT NOT NULL DEFAULT '',
  why_match                 TEXT NOT NULL DEFAULT '',

  -- Sistema
  score                     INTEGER NOT NULL DEFAULT 0,
  status                    TEXT NOT NULL DEFAULT 'new',
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_score      ON leads (score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status     ON leads (status);

-- Verificação
SELECT COUNT(*) AS total_leads FROM leads;
