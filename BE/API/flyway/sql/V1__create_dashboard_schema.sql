CREATE OR REPLACE FUNCTION stable_uuid(seed text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (
    substr(md5(seed), 1, 8) || '-' ||
    substr(md5(seed), 9, 4) || '-' ||
    substr(md5(seed), 13, 4) || '-' ||
    substr(md5(seed), 17, 4) || '-' ||
    substr(md5(seed), 21, 12)
  )::uuid;
$$;

CREATE TABLE production_orders (
  id uuid PRIMARY KEY,
  plant_code text NOT NULL,
  plant_name text NOT NULL,
  site_region text NOT NULL,
  country text NOT NULL,
  production_line_id uuid NOT NULL,
  production_line_code text NOT NULL,
  production_line_name text NOT NULL,
  machine_id uuid NOT NULL,
  machine_code text NOT NULL,
  machine_name text NOT NULL,
  machine_type text NOT NULL,
  work_order_id uuid NOT NULL,
  work_order_number text NOT NULL,
  batch_number text NOT NULL,
  product_id uuid NOT NULL,
  product_sku text NOT NULL,
  product_name text NOT NULL,
  product_category text NOT NULL,
  unit_of_measure text NOT NULL,
  shift_code text NOT NULL,
  shift_name text NOT NULL,
  operator_id uuid NOT NULL,
  operator_name text NOT NULL,
  supervisor_id uuid NOT NULL,
  supervisor_name text NOT NULL,
  status text NOT NULL,
  priority text NOT NULL,
  planned_start_time date NOT NULL,
  planned_end_time date NOT NULL,
  actual_start_time date,
  actual_end_time date,
  planned_units integer NOT NULL,
  produced_units integer NOT NULL,
  good_units integer NOT NULL,
  scrap_units integer NOT NULL,
  rework_units integer NOT NULL,
  downtime_minutes integer NOT NULL,
  runtime_minutes integer NOT NULL,
  availability_percent double precision NOT NULL,
  performance_percent double precision NOT NULL,
  quality_percent double precision NOT NULL,
  oee_percent double precision NOT NULL,
  cycle_time_seconds double precision NOT NULL,
  target_cycle_time_seconds double precision NOT NULL,
  temperature_celsius double precision NOT NULL,
  humidity_percent double precision NOT NULL,
  energy_consumption_kwh double precision NOT NULL,
  last_maintenance_date date,
  next_maintenance_date date,
  maintenance_required boolean NOT NULL DEFAULT false,
  quality_check_passed boolean NOT NULL DEFAULT false,
  blocked_reason text,
  comments text,
  created_at date NOT NULL,
  updated_at date NOT NULL,
  new_array_value text[] NOT NULL DEFAULT '{}'::text[]
);

CREATE INDEX idx_production_orders_updated_at
  ON production_orders (updated_at DESC, created_at DESC, id DESC);

CREATE TABLE inventory_allocations (
  id uuid PRIMARY KEY,
  production_order_id uuid NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  material_id uuid NOT NULL,
  material_code text NOT NULL,
  material_name text NOT NULL,
  lot_number text NOT NULL,
  warehouse_code text NOT NULL,
  bin_location text NOT NULL,
  quantity_allocated double precision NOT NULL,
  unit_cost double precision NOT NULL,
  total_cost double precision NOT NULL,
  expiry_date date NOT NULL
);

CREATE INDEX idx_inventory_allocations_order_id
  ON inventory_allocations (production_order_id, material_code, id);

CREATE TABLE quality_checks (
  id uuid PRIMARY KEY,
  production_order_id uuid NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  check_type text NOT NULL,
  inspector_id uuid NOT NULL,
  inspector_name text NOT NULL,
  result text NOT NULL,
  defect_code text NOT NULL,
  defect_description text NOT NULL,
  sample_size integer NOT NULL,
  defect_count integer NOT NULL,
  checked_at date NOT NULL
);

CREATE INDEX idx_quality_checks_order_id
  ON quality_checks (production_order_id, checked_at DESC, id);

CREATE TABLE downtime_events (
  id uuid PRIMARY KEY,
  production_order_id uuid NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  reason_code text NOT NULL,
  reason_description text NOT NULL,
  start_time date NOT NULL,
  end_time date NOT NULL,
  duration_minutes integer NOT NULL,
  severity text NOT NULL,
  resolved_by text NOT NULL
);

CREATE INDEX idx_downtime_events_order_id
  ON downtime_events (production_order_id, start_time DESC, id);

CREATE TABLE production_steps (
  id uuid PRIMARY KEY,
  production_order_id uuid NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  step_name text NOT NULL,
  work_center_code text NOT NULL,
  status text NOT NULL,
  planned_duration_minutes integer NOT NULL,
  actual_duration_minutes integer NOT NULL,
  assigned_operator text NOT NULL,
  started_at date NOT NULL,
  completed_at date NOT NULL
);

CREATE INDEX idx_production_steps_order_id
  ON production_steps (production_order_id, step_number, id);

CREATE TABLE shipments (
  id uuid PRIMARY KEY,
  production_order_id uuid NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  shipment_number text NOT NULL,
  customer_id uuid NOT NULL,
  customer_name text NOT NULL,
  dispatch_date date NOT NULL,
  delivery_date date NOT NULL,
  carrier_name text NOT NULL,
  tracking_number text NOT NULL,
  quantity_shipped integer NOT NULL,
  shipping_status text NOT NULL
);

CREATE INDEX idx_shipments_order_id
  ON shipments (production_order_id, dispatch_date DESC, id);
