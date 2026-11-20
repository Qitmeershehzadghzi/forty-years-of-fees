# Database Architecture & Schemas — Forty Years of Fees

## Greenwich University, Karachi (Journey 40)

The persistent store is built on **MongoDB** with strict Mongoose validation, indexes, and referential integrity.

---

## 1. Collections & Models

### `User`
```javascript
{
  name: String,            // Required, trimmed
  email: String,           // Unique, lowercase
  passwordHash: String,    // Bcrypt salted hash
  role: 'SUPER_ADMIN' | 'ADMIN' | 'RESEARCHER' | 'VIEWER',
  isActive: Boolean,       // Soft deactivation
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### `Site`
```javascript
{
  name: String,            // Unique, e.g. "Clifton Block 1"
  address: String,         // DK-10, 38th Street, Darakshan, Phase VI, DHA
  description: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### `Programme`
```javascript
{
  name: String,            // e.g. "Bachelor of Business Administration"
  code: String,            // Unique, uppercase, e.g. "BBA"
  degreeLevel: 'Undergraduate' | 'Graduate' | 'Postgraduate',
  description: String,
  firstOfferedYear: Number,// Default 1987
  lastOfferedYear: Number, // Default 2026
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### `FeeRecord`
```javascript
{
  programmeId: ObjectId,   // Ref: Programme
  siteId: ObjectId,        // Ref: Site
  year: Number,            // 1987–2027
  feeType: 'Admission Fee' | 'Tuition Fee' | 'Examination Fee' | 'Registration Fee' | 'Other Charges' | 'Total Annual Fee',
  amount: Number,          // In PKR
  currency: "PKR",
  dataType: "SIMULATED" | "VERIFIED",
  verificationStatus: "SIMULATED" | "UNVERIFIED" | "PENDING_REVIEW" | "VERIFIED" | "REJECTED",
  sourceId: ObjectId,      // Ref: Source
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```
**Compound Unique Index:** `programmeId + siteId + year + feeType` (prevents duplicate entries for the same fee component in the same academic cycle).

### `InflationIndex`
```javascript
{
  year: Number,            // 1987–2027
  cpiValue: Number,        // Strictly positive decimal
  seriesId: String,        // e.g. "PBS-CPI-2015-16"
  baseYear: Number,        // e.g. 2016
  dataType: "SIMULATED" | "VERIFIED",
  sourceId: ObjectId,      // Ref: Source
  verificationStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```
**Compound Unique Index:** `year + seriesId`.

### `Source`
```javascript
{
  title: String,
  institution: String,
  publicationYear: Number,
  documentType: String,
  documentUrl: String,
  pageNumber: Number,
  description: String,
  verificationStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

### `ResearchNote`
```javascript
{
  title: String,
  summary: String,
  content: String,
  category: 'Zakat' | 'Waqf' | 'Church Education Trusts' | 'Temple Education Trusts' | 'Institutional Policy' | 'Economic Impact',
  sourceIds: [ObjectId],
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED',
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### `AuditLog`
```javascript
{
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'REJECT' | 'IMPORT',
  entity: String,
  entityId: ObjectId,
  previousValues: Mixed,
  newValues: Mixed,
  performedBy: ObjectId,
  ipAddress: String,
  createdAt: Date
}
```
*(Immutable collection with `updatedAt: false`)*
