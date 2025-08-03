# API Documentation: Hospital Management System

## Overview

This document provides comprehensive documentation for the REST API of the Hospital Management System. The system covers a wide range of functionalities including patient management, admission processes, drug management, clinic assignments, staff assignments, surgery scheduling, medical reporting, authentication, and more. The API uses a RESTful architecture and JSON for data exchange. It employs JWT (JSON Web Tokens) for authentication and role-based permissions for authorization, ensuring secure access to different functionalities based on user roles like DOCTOR, NURSE, PHARMACIST, PATIENT, and ADMIN.

## Core Functionalities

*   **Patient Management:** Create, retrieve, update, and delete patient records.
*   **Admission Management:** Handle admission books and sheets, manage ward details, and bed status.
*   **Drug Management:** Manage drug inventory, allocate drugs to wards, and track drug usage.
*   **Clinic Assignment:** Assign patients to clinics, manage clinic schedules, and retrieve patient details by clinic.
*   **Staff Management:** Assign staff to wards and retrieve staff assignments.
*   **Surgery Scheduling:** Schedule surgeries, update schedules, and manage doctor assignments.
*   **Medical Reports:** Create, retrieve, and manage medical reports.
*   **Authentication and Authorization:** Secure access to the API using JWT tokens and role-based permissions.

## Authentication & Authorization

Most endpoints require authentication via a JWT token provided in the `Authorization` header as `Bearer <token>`. Authorization is handled through role-based permission checks using the `permissionMiddleware`. Each role (DOCTOR, NURSE, PHARMACIST, PATIENT, ADMIN) has a defined set of permissions for accessing specific API endpoints.

## Endpoints

### **Admission Book Routes** `/admissionbook`

*   **GET /admissionbook/noofadmissionbookstoday**
    *   **Summary:** Retrieves the number of admission books created today.
    *   **Response:**
        *   200 OK: Returns the count of admission books created today.
        *   400 Bad Request: If there is an error in the request.
    *   **Authentication:** No token required.
    *   **Authorization:** N/A
    *   **Related functions:** `getNumberOfAdmissionBooksToday` (admissionBookController.ts)
    *   **Example**
        ```bash
        curl -X GET http://localhost:8000/admissionbook/noofadmissionbookstoday
        ```

*   **GET /admissionbook/getdischargecounts**
    *   **Summary:** Retrieves the discharge counts for today.
    *   **Response:**
        *   200 OK: Returns discharge counts.
        *   400 Bad Request: If there is an error in the request.
    *   **Authentication:** No token required.
    *   **Authorization:** N/A
    *   **Related functions:** `getDischargeCounts` (admissionBookController.ts)
    *   **Example**
        ```bash
        curl -X GET http://localhost:8000/admissionbook/getdischargecounts
        ```
*   **GET /admissionbook/bht?bht={bht}**
    *   **Summary:** Retrieves admission book by BHT number.
    *   **Request Parameters:**
        *   Query: `bht` (number, required)
    *   **Response:**
        *   200 OK: Admission book object
        *   500 Internal Server Error: Error retrieving admission book
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getrelatedAdmissionBookbyBHT` permission required
    *   **Related functions:** `getrelatedAdmissionBookbyBHT` (admissionBookController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/admissionbook/bht?bht=123
        ```
*   **GET /admissionbook**
    *   **Summary:** Retrieves all admission books.
    *   **Response:**
        *   200 OK: Array of admission book objects
        *   500 Internal Server Error: Error retrieving admission books
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getAdmissionBooks` permission required
    *   **Related functions:** `getAdmissionBooks` (admissionBookController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/admissionbook
        ```
*   **POST /admissionbook**
    *   **Summary:** Creates a new admission book.
    *   **Request Body:** (Example)
        ```json
        {
            "nic": "123456789V",
            "bht": 123,
            "name": "John Doe",
            "dailyno": "1",
            "yearlyno": "2024",
            "city": "Colombo",
            "stateProvince": "Western",
            "postalCode": "00100",
            "country": "Sri Lanka",
            "streetAddress": "Main Street",
            "age": 30,
            "admittedDate": "2024-01-01T00:00:00.000Z",
            "reason": "Fever",
            "allergies": "None",
            "transferCategory": "Normal",
            "phone": "0771234567",
            "wardNo": "1",
            "livingStatus": "Active",
            "dischargeDate": "2024-01-05T00:00:00.000Z"
        }
        ```
    *   **Response:**
        *   201 Created: New admission book object
        *   500 Internal Server Error: Error creating admission book
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `createAdmissionBook` permission required
    *   **Related functions:** `createAdmissionBook` (admissionBookController.ts)
    *   **Example:**
        ```bash
        curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/admissionbook
        ```
*   **GET /admissionbook/:nic**
    *   **Summary:** Retrieves all admission books for a specific NIC.
    *   **Path Parameters:**
        *   `nic` (string, required)
    *   **Response:**
        *   200 OK: Array of admission book objects
        *   500 Internal Server Error: Error retrieving admission books
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getAllAdmissionBooksforNic` permission required
    *   **Related functions:** `getAllAdmissionBooksforNic` (admissionBookController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/admissionbook/123456789V
        ```
*   **PUT /admissionbook/:nic/:bht**
    *   **Summary:** Updates an existing admission book.
    *   **Path Parameters:**
        *   `nic` (string, required)
        *   `bht` (number, required)
    *   **Request Body:** (Partial Example)
        ```json
        {
            "name": "Updated Name",
            "reason": "Updated Reason"
        }
        ```
    *   **Response:**
        *   200 OK: Updated admission book object
        *   500 Internal Server Error: Error updating admission book
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `updateAdmissionBook` permission required
    *   **Related functions:** `updateAdmissionBook` (admissionBookController.ts)
    *   **Example:**
        ```bash
        curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/admissionbook/123456789V/123
        ```
*   **DELETE /admissionbook/:nic/:bht**
    *   **Summary:** Deletes an admission book.
    *   **Path Parameters:**
        *   `nic` (string, required)
        *   `bht` (number, required)
    *   **Response:**
        *   200 OK: Deleted admission book object
        *   500 Internal Server Error: Error deleting admission book
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `deleteAdmissionBook` permission required
    *   **Related functions:** `deleteAdmissionBook` (admissionBookController.ts)
    *   **Example:**
        ```bash
        curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:8000/admissionbook/123456789V/123
        ```

### **Admission Sheet Routes** `/admissionsheet`

*   **GET /admissionsheet/noOfAdmissionSheetsperyear**
    *   **Summary:** Retrieves the number of admission sheets per year.
    *   **Response:**
        *   200 OK: Count of admission sheets per year.
        *   500 Internal Server Error: Error retrieving the count.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getNumberOfAdmissionSheetsperYear` permission required
    *   **Related functions:** `getNumberOfAdmissionSheetsperYear` (admissionSheetController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/admissionsheet/noOfAdmissionSheetsperyear
        ```
*   **GET /admissionsheet/noOfAdmissionSheetsperday**
    *   **Summary:** Retrieves the number of admission sheets per day.
    *   **Response:**
        *   200 OK: Count of admission sheets per day.
        *   500 Internal Server Error: Error retrieving the count.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getNumberOfAdmissionSheetsperDay` permission required
    *   **Related functions:** `getNumberOfAdmissionSheetsperDay` (admissionSheetController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/admissionsheet/noOfAdmissionSheetsperday
        ```
*   **GET /admissionsheet/bht?bht={bht}**
    *   **Summary:** Retrieves admission sheet by BHT number.
    *   **Request Parameters:**
        *   Query: `bht` (number, required)
    *   **Response:**
        *   200 OK: Admission sheet object
        *   404 Not Found: No admission sheet found for the given BHT
        *   500 Internal Server Error: Error retrieving admission sheet
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getrelatedAdmissionSheetByBht` permission required
    *   **Related functions:** `getrelatedAdmissionSheetByBht` (admissionSheetController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/admissionsheet/bht?bht=123
        ```
*   **POST /admissionsheet**
    *   **Summary:** Creates a new admission sheet.
    *   **Request Body:** (Example)
        ```json
        {
            "nic": "123456789V",
            "name": "John Doe",
            "age": 30,
            "gender": "Male",
            "phone": "0771234567",
            "wardNo": "1",
            "reason": "Fever",
            "pressure": "120/80",
            "weight": "70",
            "bht": 123,
             "streetAddress": "Main Street",
            "city": "Colombo",
            "stateProvince": "Western",
            "postalCode": "00100",
            "country": "Sri Lanka",
            "livingStatus": "Active"
        }
        ```
    *   **Response:**
        *   201 Created: New admission sheet object
        *   500 Internal Server Error: Error creating admission sheet
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `createAdmissionSheet` permission required
    *   **Related functions:** `createAdmissionSheet` (admissionSheetController.ts)
    *   **Example:**
        ```bash
        curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/admissionsheet
        ```
*   **DELETE /admissionsheet/:nic/:bht**
    *   **Summary:** Deletes an admission sheet.
    *   **Path Parameters:**
        *   `nic` (string, required)
        *   `bht` (number, required)
    *   **Response:**
        *   200 OK: Deleted admission sheet object
        *   500 Internal Server Error: Error deleting admission sheet
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `deleteAdmissionSheet` permission required
    *   **Related functions:** `deleteAdmissionSheet` (admissionSheetController.ts)
    *   **Example:**
        ```bash
        curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:8000/admissionsheet/123456789V/123
        ```
*   **GET /admissionsheet/:nic**
    *   **Summary:** Retrieves all admission sheets for a specific NIC.
    *   **Path Parameters:**
        *   `nic` (string, required)
    *   **Response:**
        *   200 OK: Array of admission sheet objects
        *   500 Internal Server Error: Error retrieving admission sheets
    *   **Authentication:** No token required.
    *   **Authorization:** N/A
    *   **Related functions:** `getAllAdmissionSheetByNic` (admissionSheetController.ts)
    *   **Example:**
        ```bash
        curl -X GET http://localhost:8000/admissionsheet/123456789V
        ```
*   **PUT /admissionsheet/:nic/:bht**
    *   **Summary:** Updates an existing admission sheet.
    *   **Path Parameters:**
        *   `nic` (string, required)
        *   `bht` (number, required)
    *   **Request Body:** (Partial Example)
        ```json
        {
            "name": "Updated Name",
            "reason": "Updated Reason"
        }
        ```
    *   **Response:**
        *   200 OK: Updated admission sheet object
        *   500 Internal Server Error: Error updating admission sheet
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `updateAdmissionSheet` permission required
    *   **Related functions:** `updateAdmissionSheet` (admissionSheetController.ts)
    *   **Example:**
        ```bash
        curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/admissionsheet/123456789V/123
        ```
*   **GET /admissionsheet**
    *   **Summary:** Retrieves all admission sheets.
    *   **Response:**
        *   200 OK: Array of admission sheet objects
        *   500 Internal Server Error: Error retrieving admission sheets
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getAdmissionSheets` permission required
    *   **Related functions:** `getAdmissionSheets` (admissionSheetController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/admissionsheet
        ```

### **Drug Chart Routes** `/drugChart`

*   **GET /drugChart**
    *   **Summary:** Retrieves all drug charts.
    *   **Response:**
        *   200 OK: Array of drug chart objects
        *   500 Internal Server Error: Error retrieving drug charts
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getDrugCharts` permission required
    *   **Related functions:** `getDrugCharts` (drugChartController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/drugChart
        ```
*   **GET /drugChart/:nic**
    *   **Summary:** Retrieves all drug charts for a specific NIC.
    *   **Path Parameters:**
        *   `nic` (string, required)
    *   **Response:**
        *   200 OK: Array of drug chart objects
        *   500 Internal Server Error: Error retrieving drug charts
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getAllDrugChartByNic` permission required
    *   **Related functions:** `getAllDrugChartByNic` (drugChartController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/drugChart/123456789V
        ```
*   **GET /drugChart/:nic/:bht**
    *   **Summary:** Retrieves a drug chart for a specific NIC and BHT.
    *   **Path Parameters:**
        *   `nic` (string, required)
        *   `bht` (number, required)
    *   **Response:**
        *   200 OK: Drug chart object
        *   500 Internal Server Error: Error retrieving drug chart
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getrelatedDrugChart` permission required
    *   **Related functions:** `getrelatedDrugChart` (drugChartController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/drugChart/123456789V/123
        ```
*   **POST /drugChart**
    *   **Summary:** Creates a new drug chart.
    *   **Request Body:** (Example)
        ```json
        {
            "name": "Drug Name",
            "nic": "123456789V",
            "bht": 123,
            "dose": "10mg",
            "frequency": "Daily",
            "date": "2024-01-01"
        }
        ```
    *   **Response:**
        *   201 Created: New drug chart object
        *   500 Internal Server Error: Error creating drug chart
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `createDrugChart` permission required
    *   **Related functions:** `createDrugChart` (drugChartController.ts)
    *   **Example:**
        ```bash
        curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/drugChart
        ```
*   **DELETE /drugChart/:nic**
    *   **Summary:** Deletes a drug chart.
    *   **Path Parameters:**
        *   `nic` (string, required)
    *   **Response:**
        *   200 OK: Drug chart object
        *   500 Internal Server Error: Error deleting drug chart
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `deleteDrugChart` permission required
    *   **Related functions:** `deleteDrugChart` (drugChartController.ts)
    *   **Example:**
        ```bash
        curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:8000/drugChart/123456789V
        ```
*   **PUT /drugChart/:nic**
    *   **Summary:** Updates an existing drug chart.
    *   **Path Parameters:**
        *   `nic` (string, required)
    *   **Request Body:** (Partial Example)
        ```json
        {
            "dose": "20mg",
            "frequency": "Twice Daily",
            "date": "2024-01-02"
        }
        ```
    *   **Response:**
        *   200 OK: Updated drug chart object
        *   500 Internal Server Error: Error updating drug chart
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `updateDrugChart` permission required
    *   **Related functions:** `updateDrugChart` (drugChartController.ts)
    *   **Example:**
        ```bash
        curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/drugChart/123456789V
        ```

### **Patient Routes** `/patient`

*   **GET /patient**
    *   **Summary:** Retrieves all patients.
    *   **Response:**
        *   200 OK: Array of patient objects
        *   500 Internal Server Error: Error retrieving patients
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getAllPatients` permission required
    *   **Related functions:** `getAllPatients` (patientController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/patient
        ```
*   **GET /patient/:nic**
    *   **Summary:** Retrieves a patient by NIC.
    *   **Path Parameters:**
        *   `nic` (string, required)
    *   **Response:**
        *   200 OK: Patient object
        *   404 Not Found: Patient not found
        *   500 Internal Server Error: Error retrieving patient
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getPatientByNic` permission required
    *   **Related functions:** `getPatientByNic` (patientController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/patient/123456789V
        ```
*   **POST /patient**
    *   **Summary:** Creates a new patient.
    *   **Request Body:** (Example)
        ```json
        {
            "nic": "123456789V",
            "age": 30,
            "name": "John Doe",
            "gender": "Male",
            "phone": "0771234567",
              "streetAddress": "Main Street",
            "city": "Colombo",
            "stateProvince": "Western",
            "postalCode": "00100",
            "country": "Sri Lanka",
            "livingStatus": "Active"
        }
        ```
    *   **Response:**
        *   200 OK: New patient object
        *   500 Internal Server Error: Error creating patient
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `createPatient` permission required
    *   **Related functions:** `createPatient` (patientController.ts)
    *   **Example:**
        ```bash
        curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/patient
        ```
*   **DELETE /patient/:nic**
    *   **Summary:** Deletes a patient.
    *   **Path Parameters:**
        *   `nic` (string, required)
    *   **Response:**
        *   200 OK: Patient deleted successfully
        *   500 Internal Server Error: Error deleting patient
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `deletePatient` permission required
    *   **Related functions:** `deletePatient` (patientController.ts)
    *   **Example:**
        ```bash
        curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:8000/patient/123456789V
        ```
*   **PUT /patient/:nic**
    *   **Summary:** Updates an existing patient.
    *   **Path Parameters:**
        *   `nic` (string, required)
    *   **Request Body:** (Partial Example)
        ```json
        {
            "name": "Updated Name",
            "phone": "0777654321"
        }
        ```
    *   **Response:**
        *   200 OK: Patient updated successfully
        *   500 Internal Server Error: Error updating patient
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `updatePatient` permission required
    *   **Related functions:** `updatePatient` (patientController.ts)
    *   **Example:**
        ```bash
        curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/patient/123456789V
        ```

*   **GET /patient/isPatientexist/:nic**
    *   **Summary:** Checks if a patient exists based on NIC.
    *   **Path Parameters:**
        *   `nic` (string, required)
    *   **Response:**
        *   200 OK: JSON response indicating whether the patient exists.
        *   500 Internal Server Error: Error checking patient existence.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `isPatientExist` permission required
    *   **Related functions:** `isPatientExist` (patientController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/patient/isPatientexist/123456789V
        ```

### **Ward Details Routes** `/warddetails`

*   **GET /warddetails**
    *   **Summary:** Retrieves the current ward status.
    *   **Response:**
        *   200 OK: JSON response containing ward data, total beds, and total free beds.
        *   500 Internal Server Error: Error getting current ward status.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getCurrentWardStatus` permission required
    *   **Related functions:** `getCurrentWardStatus` (currentWardStatus.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/warddetails
        ```

*   **GET /warddetails/wardnames**
    *   **Summary:** Retrieves the ward names.
    *   **Response:**
        *   200 OK: JSON response containing ward names.
        *   500 Internal Server Error: Error getting ward names.
    *   **Authentication:** No token required.
    *   **Authorization:** N/A
    *   **Related functions:** `getWardNames` (currentWardStatus.ts)
    *   **Example:**
        ```bash
        curl -X GET http://localhost:8000/warddetails/wardnames
        ```

### **Ward Beds Controller Routes** `/wardbedscontroller`

*   **PUT /wardbedscontroller/:wardNo**
    *   **Summary:** Changes the bed status for a specific ward in the inpatient table.
    *   **Path Parameters:**
        *   `wardNo` (string, required): The ward number for which to change the bed status.
    *   **Response:**
        *   200 OK: JSON response with a success message.
        *   404 Not Found: Ward not found.
        *   500 Internal Server Error: Error changing bed status.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `changeBedStatusForInpatientTable` permission required
    *   **Related functions:** `changeBedStatusForInpatientTable` (wardBedsController.ts)
    *   **Example:**
        ```bash
        curl -X PUT -H "Authorization: Bearer <token>" http://localhost:8000/wardbedscontroller/1
        ```

### **OutPatient Routes** `/outPatient`

*   **GET /outPatient/getstaff**
    *   **Summary:** Retrieves staff members assigned to the outpatient ward.
    *   **Response:**
        *   200 OK: JSON response containing staff details.
        *   404 Not Found: Staff members not found.
        *   500 Internal Server Error: Error getting outpatient staff.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getStaffMemebers` permission required
    *   **Related functions:** `getStaffMemebers` (OutpatientController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/outPatient/getstaff
        ```

*   **POST /outPatient**
    *   **Summary:** Creates a new outpatient record.
    *   **Request Body:** (Example)
        ```json
        {
            "nic": "123456789V",
            "name": "Jane Doe",
            "age": 25,
            "gender": "Female",
            "phone": "0779876543",
              "streetAddress": "Park Avenue",
            "city": "Kandy",
            "stateProvince": "Central",
            "postalCode": "00200",
            "country": "Sri Lanka",
            "livingStatus": "active",
            "description": "General checkup",
            "reason": "Follow-up",
            "prescriptions": "Paracetamol"
        }
        ```
    *   **Response:**
        *   201 Created: New outpatient record object.
        *   400 Bad Request: If the patient does not exist or NIC is missing.
        *   500 Internal Server Error: Error creating outpatient record.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `createOutPatient` permission required
    *   **Related functions:** `createOutPatient` (OutpatientController.ts)
    *   **Example:**
        ```bash
        curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/outPatient
        ```
*   **GET /outPatient**
    *   **Summary:** Retrieves all outpatient records for today.
    *   **Response:**
        *   200 OK: Array of outpatient record objects.
        *   404 Not Found: No outpatient records found.
        *   500 Internal Server Error: Error getting outpatient records.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getAllOutPatientsToday` permission required
    *   **Related functions:** `getAllOutPatientsToday` (OutpatientController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/outPatient
        ```

   *   **GET /outPatient/outpatientscount**
        *   **Summary:** Retrieves the number of outpatients records for today.
        *   **Response:**
            *   200 OK: Count of outpatient record objects.
            *   404 Not Found: No outpatient records found.
            *   500 Internal Server Error: Error getting outpatient records.
        *   **Authentication:** Not Required.
        *   **Authorization:** N/A
        *   **Related functions:** `getNumberOfOutPatientsToday` (OutpatientController.ts)
        *   **Example:**
        ```bash
        curl -X GET  http://localhost:8000/outPatient/outpatientscount
        ```

*   **GET /outPatient/:nic**
    *   **Summary:** Retrieves all outpatient records for a specific NIC.
    *   **Path Parameters:**
        *   `nic` (string, required): The patient's NIC.
    *   **Response:**
        *   200 OK: Array of outpatient record objects.
        *   404 Not Found: Outpatient not found.
        *   500 Internal Server Error: Error getting outpatient records.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getOutPatientByNic` permission required
    *   **Related functions:** `getOutPatientByNic` (OutpatientController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/outPatient/123456789V
        ```

### **Drug Routes** `/drugs`

*   **PUT /drugs/:drugId**
    *   **Summary:** Updates an existing drug.
    *   **Path Parameters:**
        *   `drugId` (number, required): The ID of the drug to update.
    *   **Request Body:** (Partial Example)
        ```json
        {
            "drugName": "Updated Drug Name",
            "unit": "mg"
        }
        ```
    *   **Response:**
        *   200 OK: JSON response with a success message and the updated drug.
        *   400 Bad Request: Drug ID is required or Drug not found.
        *   500 Internal Server Error: Error updating drug.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `updateDrug` permission required
    *   **Related functions:** `updateDrug` (drugController.ts)
    *   **Example:**
        ```bash
        curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{...}' http://localhost:8000/drugs/1
        ```

*   **GET /drugs**
    *   **Summary:** Retrieves all drugs.
    *   **Response:**
        *   200 OK: JSON response containing the list of drugs.
        *   500 Internal Server Error: Error retrieving drugs.
    *   **Authentication:** JWT Token Required
    *   **Authorization:** `getAllDrugs` permission required
    *   **Related functions:** `getAllDrugs` (drugController.ts)
    *   **Example:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:8000/drugs
        ```

*   **POST /drugs**
    *   **Summary:** Adds