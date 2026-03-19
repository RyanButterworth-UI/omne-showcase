import { DataAccessError } from "../errors.js";
const productionOrderSelect = `
  select
    id::text as id,
    plant_code as "plantCode",
    plant_name as "plantName",
    site_region as "siteRegion",
    country,
    production_line_id::text as "productionLineId",
    production_line_code as "productionLineCode",
    production_line_name as "productionLineName",
    machine_id::text as "machineId",
    machine_code as "machineCode",
    machine_name as "machineName",
    machine_type as "machineType",
    work_order_id::text as "workOrderId",
    work_order_number as "workOrderNumber",
    batch_number as "batchNumber",
    product_id::text as "productId",
    product_sku as "productSku",
    product_name as "productName",
    product_category as "productCategory",
    unit_of_measure as "unitOfMeasure",
    shift_code as "shiftCode",
    shift_name as "shiftName",
    operator_id::text as "operatorId",
    operator_name as "operatorName",
    supervisor_id::text as "supervisorId",
    supervisor_name as "supervisorName",
    status,
    priority,
    planned_start_time::text as "plannedStartTime",
    planned_end_time::text as "plannedEndTime",
    actual_start_time::text as "actualStartTime",
    actual_end_time::text as "actualEndTime",
    planned_units as "plannedUnits",
    produced_units as "producedUnits",
    good_units as "goodUnits",
    scrap_units as "scrapUnits",
    rework_units as "reworkUnits",
    downtime_minutes as "downtimeMinutes",
    runtime_minutes as "runtimeMinutes",
    availability_percent as "availabilityPercent",
    performance_percent as "performancePercent",
    quality_percent as "qualityPercent",
    oee_percent as "oeePercent",
    cycle_time_seconds as "cycleTimeSeconds",
    target_cycle_time_seconds as "targetCycleTimeSeconds",
    temperature_celsius as "temperatureCelsius",
    humidity_percent as "humidityPercent",
    energy_consumption_kwh as "energyConsumptionKwh",
    last_maintenance_date::text as "lastMaintenanceDate",
    next_maintenance_date::text as "nextMaintenanceDate",
    maintenance_required as "maintenanceRequired",
    quality_check_passed as "qualityCheckPassed",
    blocked_reason as "blockedReason",
    comments,
    created_at::text as "createdAt",
    updated_at::text as "updatedAt",
    new_array_value as "newArrayValue"
  from production_orders
`;
function wrapError(error, message) {
    if (error instanceof DataAccessError) {
        return error;
    }
    const cause = error instanceof Error ? error : undefined;
    return new DataAccessError(message, { cause });
}
export function createDashboardRepository(pool) {
    return {
        async getLatestProductionOrder() {
            try {
                const result = await pool.query(`
          ${productionOrderSelect}
          order by updated_at desc, created_at desc, id desc
          limit 1
        `);
                return result.rows[0] ?? null;
            }
            catch (error) {
                throw wrapError(error, "Failed to fetch the latest production order.");
            }
        },
        async getProductionOrderById(id) {
            try {
                const result = await pool.query(`
            ${productionOrderSelect}
            where id = $1::uuid
            limit 1
          `, [id]);
                return result.rows[0] ?? null;
            }
            catch (error) {
                throw wrapError(error, "Failed to fetch the requested production order.");
            }
        },
        async getChildCollections(productionOrderId) {
            try {
                const [inventoryAllocationsResult, qualityChecksResult, downtimeEventsResult, productionStepsResult, shipmentsResult,] = await Promise.all([
                    pool.query(`
              select
                id::text as id,
                material_id::text as "materialId",
                material_code as "materialCode",
                material_name as "materialName",
                lot_number as "lotNumber",
                warehouse_code as "warehouseCode",
                bin_location as "binLocation",
                quantity_allocated as "quantityAllocated",
                unit_cost as "unitCost",
                total_cost as "totalCost",
                expiry_date::text as "expiryDate"
              from inventory_allocations
              where production_order_id = $1::uuid
              order by material_code asc, id asc
            `, [productionOrderId]),
                    pool.query(`
              select
                id::text as id,
                check_type as "checkType",
                inspector_id::text as "inspectorId",
                inspector_name as "inspectorName",
                result,
                defect_code as "defectCode",
                defect_description as "defectDescription",
                sample_size as "sampleSize",
                defect_count as "defectCount",
                checked_at::text as "checkedAt"
              from quality_checks
              where production_order_id = $1::uuid
              order by checked_at desc, id asc
            `, [productionOrderId]),
                    pool.query(`
              select
                id::text as id,
                reason_code as "reasonCode",
                reason_description as "reasonDescription",
                start_time::text as "startTime",
                end_time::text as "endTime",
                duration_minutes as "durationMinutes",
                severity,
                resolved_by as "resolvedBy"
              from downtime_events
              where production_order_id = $1::uuid
              order by start_time desc, id asc
            `, [productionOrderId]),
                    pool.query(`
              select
                id::text as id,
                step_number as "stepNumber",
                step_name as "stepName",
                work_center_code as "workCenterCode",
                status,
                planned_duration_minutes as "plannedDurationMinutes",
                actual_duration_minutes as "actualDurationMinutes",
                assigned_operator as "assignedOperator",
                started_at::text as "startedAt",
                completed_at::text as "completedAt"
              from production_steps
              where production_order_id = $1::uuid
              order by step_number asc, id asc
            `, [productionOrderId]),
                    pool.query(`
              select
                id::text as id,
                shipment_number as "shipmentNumber",
                customer_id::text as "customerId",
                customer_name as "customerName",
                dispatch_date::text as "dispatchDate",
                delivery_date::text as "deliveryDate",
                carrier_name as "carrierName",
                tracking_number as "trackingNumber",
                quantity_shipped as "quantityShipped",
                shipping_status as "shippingStatus"
              from shipments
              where production_order_id = $1::uuid
              order by dispatch_date desc, id asc
            `, [productionOrderId]),
                ]);
                return {
                    inventoryAllocations: inventoryAllocationsResult.rows,
                    qualityChecks: qualityChecksResult.rows,
                    downtimeEvents: downtimeEventsResult.rows,
                    productionSteps: productionStepsResult.rows,
                    shipments: shipmentsResult.rows,
                };
            }
            catch (error) {
                throw wrapError(error, "Failed to fetch related dashboard collections.");
            }
        },
        async listProductionOrders({ page, pageSize }) {
            try {
                const offset = (page - 1) * pageSize;
                const [itemsResult, totalResult] = await Promise.all([
                    pool.query(`
              select
                id::text as id,
                plant_name as "plantName",
                country,
                production_line_name as "productionLineName",
                machine_name as "machineName",
                work_order_number as "workOrderNumber",
                product_name as "productName",
                status,
                priority,
                updated_at::text as "updatedAt",
                oee_percent as "oeePercent",
                quality_check_passed as "qualityCheckPassed",
                maintenance_required as "maintenanceRequired"
              from production_orders
              order by updated_at desc, created_at desc, id desc
              offset $1
              limit $2
            `, [offset, pageSize]),
                    pool.query(`
              select count(*)::text as count
              from production_orders
            `),
                ]);
                return {
                    items: itemsResult.rows,
                    total: Number(totalResult.rows[0]?.count ?? 0),
                };
            }
            catch (error) {
                throw wrapError(error, "Failed to list production orders.");
            }
        },
        async ping() {
            try {
                await pool.query("select 1");
            }
            catch (error) {
                throw wrapError(error, "Database connectivity check failed.");
            }
        },
        async countProductionOrders() {
            try {
                const result = await pool.query(`
            select count(*)::text as count
            from production_orders
          `);
                return Number(result.rows[0]?.count ?? 0);
            }
            catch (error) {
                throw wrapError(error, "Failed to count seeded production orders.");
            }
        },
    };
}
