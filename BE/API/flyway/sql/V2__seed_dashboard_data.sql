WITH base AS (
  SELECT
    sequence_number,
    ((sequence_number - 1) % 5) AS region_index,
    ((sequence_number - 1) % 5) AS status_index,
    ((sequence_number - 1) % 4) AS priority_index,
    ((sequence_number - 1) % 3) AS shift_index,
    date '2026-01-01' + (sequence_number - 1) AS planned_start_date,
    date '2026-01-02' + (sequence_number - 1) AS planned_end_date,
    900 + (sequence_number * 4) AS planned_units,
    900 + (sequence_number * 4) - ((sequence_number - 1) % 18) AS produced_units,
    ((sequence_number - 1) % 6) AS scrap_units,
    ((sequence_number + 1) % 4) AS rework_units,
    12 + ((sequence_number - 1) % 35) AS downtime_minutes,
    360 + ((sequence_number - 1) % 140) AS runtime_minutes,
    round((91 + (((sequence_number - 1) % 9)::numeric * 0.6))::numeric, 2)::double precision AS availability_percent,
    round((89 + (((sequence_number - 1) % 8)::numeric * 0.7))::numeric, 2)::double precision AS performance_percent,
    round((94 + (((sequence_number - 1) % 5)::numeric * 0.5))::numeric, 2)::double precision AS quality_percent,
    round((3.5 + (((sequence_number - 1) % 7)::numeric * 0.18))::numeric, 2)::double precision AS cycle_time_seconds,
    round((3.2 + (((sequence_number - 1) % 5)::numeric * 0.16))::numeric, 2)::double precision AS target_cycle_time_seconds,
    round((19 + (((sequence_number - 1) % 10)::numeric * 0.8))::numeric, 2)::double precision AS temperature_celsius,
    round((42 + (((sequence_number - 1) % 12)::numeric * 1.4))::numeric, 2)::double precision AS humidity_percent,
    round((140 + (((sequence_number - 1) % 40)::numeric * 3.3))::numeric, 2)::double precision AS energy_consumption_kwh
  FROM generate_series(1, 500) AS sequence_number
)
INSERT INTO production_orders (
  id,
  plant_code,
  plant_name,
  site_region,
  country,
  production_line_id,
  production_line_code,
  production_line_name,
  machine_id,
  machine_code,
  machine_name,
  machine_type,
  work_order_id,
  work_order_number,
  batch_number,
  product_id,
  product_sku,
  product_name,
  product_category,
  unit_of_measure,
  shift_code,
  shift_name,
  operator_id,
  operator_name,
  supervisor_id,
  supervisor_name,
  status,
  priority,
  planned_start_time,
  planned_end_time,
  actual_start_time,
  actual_end_time,
  planned_units,
  produced_units,
  good_units,
  scrap_units,
  rework_units,
  downtime_minutes,
  runtime_minutes,
  availability_percent,
  performance_percent,
  quality_percent,
  oee_percent,
  cycle_time_seconds,
  target_cycle_time_seconds,
  temperature_celsius,
  humidity_percent,
  energy_consumption_kwh,
  last_maintenance_date,
  next_maintenance_date,
  maintenance_required,
  quality_check_passed,
  blocked_reason,
  comments,
  created_at,
  updated_at,
  new_array_value
)
SELECT
  stable_uuid('production-order-' || sequence_number),
  format('PLANT-%s', lpad((((sequence_number - 1) % 12) + 1)::text, 3, '0')),
  CASE region_index
    WHEN 0 THEN 'Cape Town Blend Works'
    WHEN 1 THEN 'Nairobi Pack House'
    WHEN 2 THEN 'Berlin Formulation Hub'
    WHEN 3 THEN 'Austin Operations Center'
    ELSE 'Pune Production Campus'
  END,
  CASE region_index
    WHEN 0 THEN 'MEA'
    WHEN 1 THEN 'MEA'
    WHEN 2 THEN 'Europe'
    WHEN 3 THEN 'North America'
    ELSE 'APAC'
  END,
  CASE region_index
    WHEN 0 THEN 'South Africa'
    WHEN 1 THEN 'Kenya'
    WHEN 2 THEN 'Germany'
    WHEN 3 THEN 'United States'
    ELSE 'India'
  END,
  stable_uuid('production-line-' || sequence_number),
  format('LINE-%s', lpad((((sequence_number - 1) % 18) + 1)::text, 2, '0')),
  format(
    '%s Line %s',
    CASE ((sequence_number - 1) % 3)
      WHEN 0 THEN 'Filling'
      WHEN 1 THEN 'Packaging'
      ELSE 'Inspection'
    END,
    lpad((((sequence_number - 1) % 18) + 1)::text, 2, '0')
  ),
  stable_uuid('machine-' || sequence_number),
  format('MCH-%s', lpad((((sequence_number - 1) % 42) + 1)::text, 3, '0')),
  format(
    '%s Station %s',
    CASE ((sequence_number - 1) % 4)
      WHEN 0 THEN 'Filler'
      WHEN 1 THEN 'Capper'
      WHEN 2 THEN 'Palletizer'
      ELSE 'Labeler'
    END,
    lpad((((sequence_number - 1) % 42) + 1)::text, 2, '0')
  ),
  CASE ((sequence_number - 1) % 4)
    WHEN 0 THEN 'Filler'
    WHEN 1 THEN 'Capper'
    WHEN 2 THEN 'Palletizer'
    ELSE 'Labeler'
  END,
  stable_uuid('work-order-' || sequence_number),
  format('WO-%s', lpad(sequence_number::text, 4, '0')),
  format('BATCH-%s', lpad(sequence_number::text, 5, '0')),
  stable_uuid('product-' || sequence_number),
  format('SKU-%s', lpad((((sequence_number - 1) % 150) + 1)::text, 4, '0')),
  format(
    '%s Blend %s',
    CASE ((sequence_number - 1) % 4)
      WHEN 0 THEN 'Citrus'
      WHEN 1 THEN 'Berry'
      WHEN 2 THEN 'Botanical'
      ELSE 'Classic'
    END,
    lpad((((sequence_number - 1) % 150) + 1)::text, 3, '0')
  ),
  CASE ((sequence_number - 1) % 4)
    WHEN 0 THEN 'Beverages'
    WHEN 1 THEN 'Snacks'
    WHEN 2 THEN 'Personal Care'
    ELSE 'Household'
  END,
  'cases',
  CASE shift_index
    WHEN 0 THEN 'SHIFT-A'
    WHEN 1 THEN 'SHIFT-B'
    ELSE 'SHIFT-C'
  END,
  CASE shift_index
    WHEN 0 THEN 'Day Shift'
    WHEN 1 THEN 'Evening Shift'
    ELSE 'Night Shift'
  END,
  stable_uuid('operator-' || sequence_number),
  format('Operator %s', lpad((((sequence_number - 1) % 80) + 1)::text, 3, '0')),
  stable_uuid('supervisor-' || sequence_number),
  format('Supervisor %s', lpad((((sequence_number - 1) % 20) + 1)::text, 3, '0')),
  CASE status_index
    WHEN 0 THEN 'Running'
    WHEN 1 THEN 'Blocked'
    WHEN 2 THEN 'Changeover'
    WHEN 3 THEN 'Completed'
    ELSE 'Maintenance'
  END,
  CASE priority_index
    WHEN 0 THEN 'Low'
    WHEN 1 THEN 'Medium'
    WHEN 2 THEN 'High'
    ELSE 'Critical'
  END,
  planned_start_date,
  planned_end_date,
  planned_start_date,
  CASE
    WHEN status_index IN (0, 1, 2) THEN NULL
    ELSE planned_end_date
  END,
  planned_units,
  produced_units,
  produced_units - scrap_units - rework_units,
  scrap_units,
  rework_units,
  downtime_minutes,
  runtime_minutes,
  availability_percent,
  performance_percent,
  quality_percent,
  round(((availability_percent * performance_percent * quality_percent) / 10000)::numeric, 2)::double precision,
  cycle_time_seconds,
  target_cycle_time_seconds,
  temperature_celsius,
  humidity_percent,
  energy_consumption_kwh,
  planned_start_date - ((((sequence_number - 1) % 45) + 15)),
  planned_end_date + ((((sequence_number - 1) % 20) + 7)),
  status_index = 4 OR (sequence_number % 7 = 0),
  status_index <> 1 AND (sequence_number % 6 <> 0),
  CASE status_index
    WHEN 1 THEN
      CASE ((sequence_number - 1) % 3)
        WHEN 0 THEN 'Material shortage'
        WHEN 1 THEN 'Awaiting QA clearance'
        ELSE 'Packaging queue backpressure'
      END
    ELSE NULL
  END,
  CASE status_index
    WHEN 1 THEN 'Deterministic blocked record for client demo.'
    WHEN 4 THEN 'Scheduled maintenance window in progress.'
    ELSE format('Deterministic demo record %s ready for review.', lpad(sequence_number::text, 4, '0'))
  END,
  planned_start_date - 10,
  planned_end_date + 1,
  ARRAY[
    'client-demo',
    format('record-%s', lpad(sequence_number::text, 4, '0')),
    CASE
      WHEN sequence_number % 2 = 0 THEN 'stable'
      ELSE 'chaos-candidate'
    END
  ]::text[]
FROM base;

INSERT INTO inventory_allocations (
  id,
  production_order_id,
  material_id,
  material_code,
  material_name,
  lot_number,
  warehouse_code,
  bin_location,
  quantity_allocated,
  unit_cost,
  total_cost,
  expiry_date
)
SELECT
  stable_uuid(format('inventory-%s-%s', order_number, allocation_number)),
  stable_uuid('production-order-' || order_number),
  stable_uuid(format('material-%s-%s', order_number, allocation_number)),
  format('MAT-%s', lpad((((order_number + allocation_number) % 240) + 1)::text, 4, '0')),
  format('Material %s', lpad((((order_number + allocation_number) % 160) + 1)::text, 3, '0')),
  format('LOT-%s-%s', lpad(order_number::text, 4, '0'), allocation_number),
  format('WH-%s', chr(64 + (((order_number + allocation_number) % 4) + 1))),
  format('%s-%s', chr(65 + ((allocation_number - 1) % 4)), lpad((((order_number - 1) % 24) + 1)::text, 2, '0')),
  quantity_allocated,
  unit_cost,
  round((quantity_allocated * unit_cost)::numeric, 2)::double precision,
  date '2026-06-01' + order_number + allocation_number
FROM (
  SELECT
    order_number,
    allocation_number,
    round((40 + (((order_number + allocation_number) % 35)::numeric * 1.5))::numeric, 2)::double precision AS quantity_allocated,
    round((9 + (allocation_number::numeric * 1.35) + (((order_number - 1) % 9)::numeric * 0.75))::numeric, 2)::double precision AS unit_cost
  FROM generate_series(1, 500) AS order_number
  CROSS JOIN LATERAL generate_series(1, 1 + (order_number % 3)) AS allocation_number
) AS allocation_seed;

INSERT INTO quality_checks (
  id,
  production_order_id,
  check_type,
  inspector_id,
  inspector_name,
  result,
  defect_code,
  defect_description,
  sample_size,
  defect_count,
  checked_at
)
SELECT
  stable_uuid(format('quality-check-%s-%s', order_number, check_number)),
  stable_uuid('production-order-' || order_number),
  CASE ((check_number - 1) % 3)
    WHEN 0 THEN 'Visual'
    WHEN 1 THEN 'Dimensional'
    ELSE 'Weight'
  END,
  stable_uuid(format('inspector-%s-%s', order_number, check_number)),
  format('Inspector %s', lpad((((order_number + check_number) % 40) + 1)::text, 3, '0')),
  CASE
    WHEN (order_number % 5 = 1) AND check_number = 1 THEN 'Failed'
    ELSE 'Passed'
  END,
  format('DEF-%s', lpad((((order_number + check_number) % 90) + 1)::text, 3, '0')),
  CASE
    WHEN (order_number % 5 = 1) AND check_number = 1 THEN 'Label alignment outside tolerance'
    WHEN (order_number % 6 = 0) AND check_number = 2 THEN 'Seal integrity variation detected'
    ELSE 'No notable defects'
  END,
  24 + ((order_number + check_number) % 12),
  CASE
    WHEN (order_number % 5 = 1) AND check_number = 1 THEN 2
    WHEN (order_number % 6 = 0) AND check_number = 2 THEN 1
    ELSE 0
  END,
  date '2026-01-01' + (order_number - 1) + check_number
FROM generate_series(1, 500) AS order_number
CROSS JOIN LATERAL generate_series(1, 1 + (order_number % 4)) AS check_number;

INSERT INTO downtime_events (
  id,
  production_order_id,
  reason_code,
  reason_description,
  start_time,
  end_time,
  duration_minutes,
  severity,
  resolved_by
)
SELECT
  stable_uuid(format('downtime-%s-%s', order_number, event_number)),
  stable_uuid('production-order-' || order_number),
  format('DT-%s', lpad((((order_number + event_number) % 60) + 1)::text, 2, '0')),
  CASE ((event_number - 1) % 3)
    WHEN 0 THEN 'Label reel swap'
    WHEN 1 THEN 'Change parts verification'
    ELSE 'Minor maintenance adjustment'
  END,
  date '2026-01-01' + (order_number - 1),
  date '2026-01-01' + (order_number - 1),
  10 + ((order_number + event_number) % 28),
  CASE ((order_number + event_number) % 3)
    WHEN 0 THEN 'Low'
    WHEN 1 THEN 'Medium'
    ELSE 'High'
  END,
  format('Shift Lead %s', lpad((((order_number + event_number) % 12) + 1)::text, 2, '0'))
FROM generate_series(1, 500) AS order_number
CROSS JOIN LATERAL generate_series(1, 1 + (order_number % 2)) AS event_number;

INSERT INTO production_steps (
  id,
  production_order_id,
  step_number,
  step_name,
  work_center_code,
  status,
  planned_duration_minutes,
  actual_duration_minutes,
  assigned_operator,
  started_at,
  completed_at
)
SELECT
  stable_uuid(format('production-step-%s-%s', order_number, step_number)),
  stable_uuid('production-order-' || order_number),
  step_number,
  CASE ((step_number - 1) % 4)
    WHEN 0 THEN 'Material Prep'
    WHEN 1 THEN 'Mixing'
    WHEN 2 THEN 'Filling'
    ELSE 'Final Inspection'
  END,
  format('WC-%s', lpad((((order_number + step_number) % 18) + 1)::text, 2, '0')),
  CASE
    WHEN step_number < total_steps THEN 'Completed'
    WHEN order_number % 5 = 1 THEN 'Blocked'
    WHEN order_number % 5 = 4 THEN 'Maintenance'
    WHEN order_number % 5 = 0 THEN 'In Progress'
    ELSE 'Completed'
  END,
  25 + (step_number * 8),
  24 + (step_number * 7) + ((order_number - 1) % 6),
  format('Operator %s', lpad((((order_number + step_number) % 80) + 1)::text, 3, '0')),
  date '2026-01-01' + (order_number - 1) + (step_number - 1),
  date '2026-01-01' + (order_number - 1) + step_number
FROM (
  SELECT
    order_number,
    step_number,
    3 + (order_number % 4) AS total_steps
  FROM generate_series(1, 500) AS order_number
  CROSS JOIN LATERAL generate_series(1, 3 + (order_number % 4)) AS step_number
) AS step_seed;

INSERT INTO shipments (
  id,
  production_order_id,
  shipment_number,
  customer_id,
  customer_name,
  dispatch_date,
  delivery_date,
  carrier_name,
  tracking_number,
  quantity_shipped,
  shipping_status
)
SELECT
  stable_uuid(format('shipment-%s-%s', order_number, shipment_number)),
  stable_uuid('production-order-' || order_number),
  format('SHIP-%s-%s', lpad(order_number::text, 4, '0'), shipment_number),
  stable_uuid(format('customer-%s-%s', order_number, shipment_number)),
  format('Customer %s', lpad((((order_number + shipment_number) % 120) + 1)::text, 3, '0')),
  dispatch_date,
  dispatch_date + (2 + (shipment_number % 3)),
  CASE ((shipment_number - 1) % 3)
    WHEN 0 THEN 'CargoLine'
    WHEN 1 THEN 'FreightFlex'
    ELSE 'TransitNorth'
  END,
  format('TRK-%s-%s', lpad(order_number::text, 4, '0'), shipment_number),
  120 + ((order_number + shipment_number) % 180),
  CASE ((order_number + shipment_number) % 4)
    WHEN 0 THEN 'Queued'
    WHEN 1 THEN 'Dispatched'
    WHEN 2 THEN 'In Transit'
    ELSE 'Delivered'
  END
FROM (
  SELECT
    order_number,
    shipment_number,
    date '2026-01-05' + order_number + shipment_number AS dispatch_date
  FROM generate_series(1, 500) AS order_number
  CROSS JOIN LATERAL generate_series(1, 1 + (order_number % 3)) AS shipment_number
) AS shipment_seed;
