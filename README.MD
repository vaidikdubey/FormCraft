# FormCraft – No-Code Custom Form Builder

FormCraft is a no-code custom form builder that allows users to create, publish, and collect responses through dynamic forms without writing any code. It is designed for non-technical users who need a simple yet flexible way to collect structured data.

The platform supports drag-and-drop form creation, basic conditional logic, public form sharing, anonymous submissions, and a response dashboard, with an optional paid upgrade to unlock higher response limits.

---

## 🚀 Features

### Form Creation

* Drag-and-drop interface to add and reorder form fields
* Supported field types:

  * Text
  * Email
  * Dropdown
  * Checkbox
  * Date
* Field-level configuration:

  * Custom labels
  * Required / optional toggle

### Conditional Logic

* Basic conditional rules
* Show or hide fields based on user input
* Logic applied dynamically during form rendering

### Publishing & Sharing

* One-click form publishing
* Unique public shareable URL for each form
* Public, read-only form view for responders

### Response Collection

* Anonymous form submissions (no login required)
* Secure storage of responses
* Submission timestamp tracking

### Response Dashboard

* View all form submissions in a list view
* Total response count per form
* View individual responses

### User & Access Control

* User authentication for form creators
* Role-based limits (Free vs Paid users)
* Response limits enforced per user

### Payments (MVP)

* One-time payment integration using Razorpay (test mode)
* Upgrade users to Paid status
* Increased response limits after successful payment

---

## 🧑‍💻 User Roles

### Form Creator

* Sign up and log in
* Create, edit, publish, and manage forms
* View responses in the dashboard

### Form Responder

* Access forms via public links
* Submit responses without authentication

### Paid User

* All Form Creator capabilities
* Higher response limits unlocked via payment

---

## 🏗️ Tech Stack

### Frontend

* React
* React Router
* Drag-and-drop library
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JWT-based authentication
* Secure password hashing

### Payments

* Razorpay (test mode)

---

## 🗄️ Database Design Overview

* **User** – Stores user details, roles, and response limits
* **Form** – Stores form metadata, embedded fields, and conditional logic
* **Response** – Stores submitted form responses (scalable design)
* **Payment** – Tracks user upgrades and payment status

MongoDB is used due to its flexibility in handling dynamic and nested data structures required for custom forms.

---

## 🔁 Application Flow

1. User signs up or logs in
2. User creates a new form
3. Fields are added using drag-and-drop
4. Optional conditional logic is configured
5. Form is published and shared via a public link
6. Responders submit the form
7. Creator views responses in the dashboard
8. User upgrades plan if response limit is reached

---

## 🔮 Future Enhancements

* Advanced conditional logic
* Form analytics and charts
* CSV / Excel export of responses
* Custom branding and white-labeling
* Subscription-based billing
* Third-party integrations (Zapier, CRM tools)
* Webhooks and automation workflows

---

## 📌 Why This Project?

This project demonstrates:

* Real-world MERN stack architecture
* Dynamic schema handling
* Scalable database design
* Role-based access control
* Payment integration
* Clean separation of concerns
