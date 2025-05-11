-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DOCTOR', 'NURSE', 'PHARMACIST', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'NURSE',
    "nic" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "department" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "nic" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "livingStatus" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "reason" TEXT,
    "city" TEXT NOT NULL,
    "stateProvince" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("nic")
);

-- CreateTable
CREATE TABLE "DiseasePrediction" (
    "id" SERIAL NOT NULL,
    "nic" TEXT NOT NULL,
    "disease" TEXT NOT NULL,
    "prediction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiseasePrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmissionSheet" (
    "id" SERIAL NOT NULL,
    "bht" INTEGER NOT NULL,
    "nic" TEXT NOT NULL,
    "livingStatus" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "stateProvince" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "wardNo" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "pressure" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "diagnose" TEXT,
    "dischargeDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdmissionSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admissionbook" (
    "id" SERIAL NOT NULL,
    "bht" INTEGER NOT NULL,
    "nic" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "livingStatus" TEXT NOT NULL,
    "dailyno" INTEGER,
    "yearlyno" INTEGER,
    "city" TEXT NOT NULL,
    "stateProvince" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "admittedDate" TIMESTAMP(3),
    "reason" TEXT NOT NULL,
    "allergies" TEXT[],
    "transferCategory" TEXT NOT NULL,
    "wardNo" TEXT NOT NULL,
    "dischargeDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admissionbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Labtest" (
    "id" SERIAL NOT NULL,
    "nic" TEXT NOT NULL,
    "bht" INTEGER NOT NULL,
    "testno" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "test" TEXT NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "Labtest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugChart" (
    "id" SERIAL NOT NULL,
    "bht" INTEGER NOT NULL,
    "nic" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrugChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ward" (
    "wardId" SERIAL NOT NULL,
    "wardNo" TEXT NOT NULL,
    "wardName" TEXT NOT NULL,
    "noOfBeds" INTEGER NOT NULL,
    "noOfUsedBeds" INTEGER NOT NULL,
    "noOfFreeBeds" INTEGER NOT NULL,
    "noOfPatients" INTEGER NOT NULL,
    "telephone" TEXT NOT NULL,
    "noffdoctors" INTEGER NOT NULL,
    "nofNurses" INTEGER NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("wardId")
);

-- CreateTable
CREATE TABLE "Drugs" (
    "drugId" SERIAL NOT NULL,
    "drugName" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    "usedQuantity" INTEGER,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drugs_pkey" PRIMARY KEY ("drugId")
);

-- CreateTable
CREATE TABLE "OutPatientFrom" (
    "id" SERIAL NOT NULL,
    "nic" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT,
    "gender" TEXT,
    "livingStatus" TEXT,
    "phone" TEXT,
    "description" TEXT,
    "reason" TEXT,
    "city" TEXT,
    "stateProvince" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "streetAddress" TEXT,
    "prescriptions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutPatientFrom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugAllocation" (
    "id" SERIAL NOT NULL,
    "drugId" INTEGER NOT NULL,
    "drugName" TEXT NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    "wardName" TEXT NOT NULL,
    "unit" TEXT,
    "usedQuantity" INTEGER DEFAULT 0,
    "dateGiven" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrugAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "sheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinicAssignment" (
    "id" SERIAL NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "nic" TEXT NOT NULL,
    "clinicName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinicAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileclinicAssignment" (
    "id" SERIAL NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "nic" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "clinicName" TEXT NOT NULL,
    "sheduledAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobileclinicAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WardAssignment" (
    "id" SERIAL NOT NULL,
    "registrationId" INTEGER,
    "nic" INTEGER,
    "ward" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WardAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surgery" (
    "id" SERIAL NOT NULL,
    "patientName" TEXT NOT NULL,
    "PatientNic" TEXT NOT NULL,
    "AssignedDoctor" TEXT NOT NULL,
    "ScheduledDate" TIMESTAMP(3) NOT NULL,
    "PatientPhonenUmber" TEXT NOT NULL,
    "surgeryName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surgery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicalreport" (
    "id" SERIAL NOT NULL,
    "PatientNic" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicalreport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WardDrugs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_nic_key" ON "User"("nic");

-- CreateIndex
CREATE UNIQUE INDEX "User_registrationNumber_key" ON "User"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerificationToken_key" ON "User"("emailVerificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_nic_key" ON "Patient"("nic");

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionSheet_bht_key" ON "AdmissionSheet"("bht");

-- CreateIndex
CREATE UNIQUE INDEX "Admissionbook_bht_key" ON "Admissionbook"("bht");

-- CreateIndex
CREATE UNIQUE INDEX "Labtest_nic_key" ON "Labtest"("nic");

-- CreateIndex
CREATE UNIQUE INDEX "Labtest_bht_key" ON "Labtest"("bht");

-- CreateIndex
CREATE UNIQUE INDEX "DrugChart_bht_key" ON "DrugChart"("bht");

-- CreateIndex
CREATE UNIQUE INDEX "DrugChart_nic_key" ON "DrugChart"("nic");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_wardNo_key" ON "Ward"("wardNo");

-- CreateIndex
CREATE UNIQUE INDEX "DrugAllocation_drugId_key" ON "DrugAllocation"("drugId");

-- CreateIndex
CREATE UNIQUE INDEX "WardAssignment_nic_key" ON "WardAssignment"("nic");

-- CreateIndex
CREATE UNIQUE INDEX "_WardDrugs_AB_unique" ON "_WardDrugs"("A", "B");

-- CreateIndex
CREATE INDEX "_WardDrugs_B_index" ON "_WardDrugs"("B");

-- AddForeignKey
ALTER TABLE "DiseasePrediction" ADD CONSTRAINT "DiseasePrediction_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Patient"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionSheet" ADD CONSTRAINT "AdmissionSheet_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Patient"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admissionbook" ADD CONSTRAINT "Admissionbook_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Patient"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Labtest" ADD CONSTRAINT "Labtest_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Patient"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrugChart" ADD CONSTRAINT "DrugChart_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Patient"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutPatientFrom" ADD CONSTRAINT "OutPatientFrom_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Patient"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinicAssignment" ADD CONSTRAINT "clinicAssignment_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Patient"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileclinicAssignment" ADD CONSTRAINT "MobileclinicAssignment_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Patient"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicalreport" ADD CONSTRAINT "medicalreport_PatientNic_fkey" FOREIGN KEY ("PatientNic") REFERENCES "Patient"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WardDrugs" ADD CONSTRAINT "_WardDrugs_A_fkey" FOREIGN KEY ("A") REFERENCES "Drugs"("drugId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WardDrugs" ADD CONSTRAINT "_WardDrugs_B_fkey" FOREIGN KEY ("B") REFERENCES "Ward"("wardId") ON DELETE CASCADE ON UPDATE CASCADE;
