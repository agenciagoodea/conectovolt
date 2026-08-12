-- AlterTable
ALTER TABLE `companies` MODIFY `commission_percent` DECIMAL(5, 2) NOT NULL DEFAULT 5.00;

-- AlterTable
ALTER TABLE `tariffs` MODIFY `price_per_kwh` DECIMAL(10, 4) NOT NULL;

-- AlterTable
ALTER TABLE `charging_sessions` MODIFY `amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `payments` MODIFY `amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `commissions` MODIFY `percentage` DECIMAL(5, 2) NOT NULL DEFAULT 5.00,
                          MODIFY `platform_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                          MODIFY `operator_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `wallets` MODIFY `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `transactions` MODIFY `amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `plans` MODIFY `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `platform_usage` MODIFY `revenue` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                             MODIFY `commission` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `maintenance_records` MODIFY `cost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;
