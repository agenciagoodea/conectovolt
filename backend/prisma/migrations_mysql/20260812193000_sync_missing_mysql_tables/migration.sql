-- CreateTable
CREATE TABLE `telemetry_events` (
    `id` VARCHAR(191) NOT NULL,
    `charger_id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `measurand` VARCHAR(191) NULL,
    `value` DOUBLE NOT NULL DEFAULT 0,
    `unit` VARCHAR(191) NULL,
    `severity` VARCHAR(191) NULL,
    `raw_payload` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `telemetry_events_charger_id_idx`(`charger_id`),
    INDEX `telemetry_events_session_id_idx`(`session_id`),
    INDEX `telemetry_events_type_idx`(`type`),
    INDEX `telemetry_events_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerts` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NULL,
    `charger_id` VARCHAR(191) NULL,
    `station_id` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `severity` VARCHAR(191) NOT NULL DEFAULT 'INFO',
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `resolved_at` BOOLEAN NOT NULL DEFAULT false,
    `resolved_at_time` DATETIME(3) NULL,
    `resolved_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `alerts_company_id_idx`(`company_id`),
    INDEX `alerts_charger_id_idx`(`charger_id`),
    INDEX `alerts_station_id_idx`(`station_id`),
    INDEX `alerts_severity_idx`(`severity`),
    INDEX `alerts_resolved_at_idx`(`resolved_at`),
    INDEX `alerts_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance_records` (
    `id` VARCHAR(191) NOT NULL,
    `charger_id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'CORRECTIVE',
    `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
    `priority` VARCHAR(191) NOT NULL DEFAULT 'MEDIUM',
    `scheduled_at` DATETIME(3) NULL,
    `completed_at` DATETIME(3) NULL,
    `assigned_to` VARCHAR(191) NULL,
    `cost` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `maintenance_records_charger_id_idx`(`charger_id`),
    INDEX `maintenance_records_company_id_idx`(`company_id`),
    INDEX `maintenance_records_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `station_images` (
    `id` VARCHAR(191) NOT NULL,
    `station_id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `station_images_station_id_idx`(`station_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webhook_events` (
    `id` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL DEFAULT 'MERCADO_PAGO',
    `external_event_id` VARCHAR(191) NOT NULL,
    `event_type` VARCHAR(191) NOT NULL,
    `resource_id` VARCHAR(191) NULL,
    `payload` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'RECEIVED',
    `error_message` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processed_at` DATETIME(3) NULL,

    INDEX `webhook_events_provider_idx`(`provider`),
    INDEX `webhook_events_external_event_id_idx`(`external_event_id`),
    INDEX `webhook_events_resource_id_idx`(`resource_id`),
    INDEX `webhook_events_status_idx`(`status`),
    INDEX `webhook_events_created_at_idx`(`created_at`),
    UNIQUE INDEX `webhook_events_provider_external_event_id_key`(`provider`, `external_event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `telemetry_events` ADD CONSTRAINT `telemetry_events_charger_id_fkey` FOREIGN KEY (`charger_id`) REFERENCES `chargers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `telemetry_events` ADD CONSTRAINT `telemetry_events_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `charging_sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_charger_id_fkey` FOREIGN KEY (`charger_id`) REFERENCES `chargers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_station_id_fkey` FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_charger_id_fkey` FOREIGN KEY (`charger_id`) REFERENCES `chargers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `station_images` ADD CONSTRAINT `station_images_station_id_fkey` FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
