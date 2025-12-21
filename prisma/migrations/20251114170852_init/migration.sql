-- CreateTable
CREATE TABLE "equipment" (
    "id" SERIAL NOT NULL,
    "asset_number" VARCHAR(100) NOT NULL,
    "serial_number" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255),
    "location" VARCHAR(255),
    "type_id" INTEGER NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "department_id" INTEGER,
    "assigned_user_id" INTEGER,
    "specifications" JSONB,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_brands" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "equipment_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "equipment_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "equipment_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genders" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "department_id" INTEGER,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_priorities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "request_priorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "request_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "request_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "os_options" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "os_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "office_suites" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "office_suites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antivirus_solutions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "antivirus_solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "request_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "resolution_date" TIMESTAMPTZ(6),
    "comments_technician" TEXT,
    "requester_id" INTEGER NOT NULL,
    "beneficiary_id" INTEGER,
    "technician_id" INTEGER,
    "equipment_id" INTEGER,
    "type_equipment_id" INTEGER,
    "type_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "priority_id" INTEGER NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_history" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "change_type" VARCHAR(50) NOT NULL,
    "old_value" VARCHAR(255),
    "new_value" VARCHAR(255),
    "changed_by_id" INTEGER,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comments" TEXT,

    CONSTRAINT "request_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_technician_assignments" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "technician_id" INTEGER,
    "previous_technician_id" INTEGER,
    "assigned_by_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "request_technician_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_assignments" (
    "id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "previous_user_id" INTEGER,
    "location" VARCHAR(255),
    "previous_location" VARCHAR(255),
    "assigned_by_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "equipment_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_logins" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "login_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "failure_reason" TEXT,

    CONSTRAINT "user_logins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "change_type" VARCHAR(50) NOT NULL,
    "field_name" VARCHAR(100),
    "old_value" VARCHAR(500),
    "new_value" VARCHAR(500),
    "changed_by_id" INTEGER,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comments" TEXT,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "identity_card" INTEGER NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "role_id" INTEGER NOT NULL,
    "position_id" INTEGER,
    "gender_id" INTEGER,
    "department_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ(6),
    "last_login_backup" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipment_asset_number_key" ON "equipment"("asset_number");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_serial_number_key" ON "equipment"("serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_brands_name_key" ON "equipment_brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_statuses_name_key" ON "equipment_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_types_name_key" ON "equipment_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genders_name_key" ON "genders"("name");

-- CreateIndex
CREATE UNIQUE INDEX "request_priorities_name_key" ON "request_priorities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "request_statuses_name_key" ON "request_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "request_types_name_key" ON "request_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "os_options_name_key" ON "os_options"("name");

-- CreateIndex
CREATE UNIQUE INDEX "office_suites_name_key" ON "office_suites"("name");

-- CreateIndex
CREATE UNIQUE INDEX "antivirus_solutions_name_key" ON "antivirus_solutions"("name");

-- CreateIndex
CREATE INDEX "request_history_request_id_idx" ON "request_history"("request_id");

-- CreateIndex
CREATE INDEX "request_history_change_type_idx" ON "request_history"("change_type");

-- CreateIndex
CREATE INDEX "request_history_changed_at_idx" ON "request_history"("changed_at");

-- CreateIndex
CREATE INDEX "request_technician_assignments_request_id_idx" ON "request_technician_assignments"("request_id");

-- CreateIndex
CREATE INDEX "request_technician_assignments_technician_id_idx" ON "request_technician_assignments"("technician_id");

-- CreateIndex
CREATE INDEX "request_technician_assignments_assigned_at_idx" ON "request_technician_assignments"("assigned_at");

-- CreateIndex
CREATE INDEX "equipment_assignments_equipment_id_idx" ON "equipment_assignments"("equipment_id");

-- CreateIndex
CREATE INDEX "equipment_assignments_user_id_idx" ON "equipment_assignments"("user_id");

-- CreateIndex
CREATE INDEX "equipment_assignments_assigned_at_idx" ON "equipment_assignments"("assigned_at");

-- CreateIndex
CREATE INDEX "user_logins_user_id_idx" ON "user_logins"("user_id");

-- CreateIndex
CREATE INDEX "user_logins_login_at_idx" ON "user_logins"("login_at");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_idx" ON "audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_log_change_type_idx" ON "audit_log"("change_type");

-- CreateIndex
CREATE INDEX "audit_log_changed_at_idx" ON "audit_log"("changed_at");

-- CreateIndex
CREATE INDEX "audit_log_changed_by_id_idx" ON "audit_log"("changed_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_identity_card_key" ON "users"("identity_card");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "equipment_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "equipment_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "equipment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_type_equipment_id_fkey" FOREIGN KEY ("type_equipment_id") REFERENCES "equipment_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "request_priorities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "request_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "request_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_history" ADD CONSTRAINT "request_history_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_history" ADD CONSTRAINT "request_history_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_technician_assignments" ADD CONSTRAINT "request_technician_assignments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_technician_assignments" ADD CONSTRAINT "request_technician_assignments_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_technician_assignments" ADD CONSTRAINT "request_technician_assignments_previous_technician_id_fkey" FOREIGN KEY ("previous_technician_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_technician_assignments" ADD CONSTRAINT "request_technician_assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipment_assignments" ADD CONSTRAINT "equipment_assignments_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipment_assignments" ADD CONSTRAINT "equipment_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipment_assignments" ADD CONSTRAINT "equipment_assignments_previous_user_id_fkey" FOREIGN KEY ("previous_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "equipment_assignments" ADD CONSTRAINT "equipment_assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_logins" ADD CONSTRAINT "user_logins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "genders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
