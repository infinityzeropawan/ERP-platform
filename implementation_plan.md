# Face Recognition Attendance + Bus GPS Tracking — Premium Features

## Overview

This plan adds two **premium, superadmin-controlled** features to the Buildroonix ERP:

1. **Face Recognition Attendance** — Staff/teachers register their face, then mark attendance by looking at the camera + geo-location verification (no fake check-ins allowed).
2. **Bus Driver GPS Live Tracking** — Bus drivers share live GPS location; institution admin watches them on a real-time map.

Both features are premium modules: Superadmin can enable/disable them **per institution** via the existing Module Catalog system.

---

## Architecture Overview

```
Face Attendance Flow:
  Teacher → Opens Camera → face-api.js detects face → matches registered descriptor
          → Browser Geolocation API → validates within institution radius
          → POST /api/v1/teacher/face-attendance → saved to DB

Bus Tracking Flow:
  Driver → Opens Tracking Page → shares GPS every 15 seconds → POST /api/v1/driver/location
  Admin  → Opens Live Map (Leaflet.js) → polls GET /api/v1/admin/bus-locations → pins on map
```

> [!IMPORTANT]
> Face recognition uses **face-api.js** (runs entirely in the browser via TensorFlow.js). No server-side face processing. Face descriptors (128-float vectors) are stored in the database — NOT raw images.

> [!NOTE]
> GPS tracking uses **browser Geolocation API** + **Leaflet.js** (open-source, no API key needed). The driver's position is polled and stored. Admin map auto-refreshes every 15 seconds.

---

## Open Questions

> [!IMPORTANT]
> **Geofencing radius**: How many meters from the institution's registered address should be considered "valid"  let the admin will decide for attendance? (Default plan: 500 meters). If the institution has no lat/lng stored, geofence check is skipped.

> [!IMPORTANT]
> **Who marks face attendance**: This plan implements it for **staff/teachers** (self-service). Should students also use face recognition, or only teachers/staff?

> [!NOTE]
> **Bus tracking privacy**: Driver location data is only stored for the last 24 hours (rolling window). Is that acceptable?

---

## Proposed Changes

### 1. Database Schema (Prisma)

#### [MODIFY] [schema.prisma](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/prisma/schema.prisma)

Add 3 new models:

- **`FaceDescriptor`** — stores the 128-float face vector per user
- **`FaceAttendanceLog`** — attendance log with geo-coordinates, face match confidence
- **`BusLocation`** — live GPS coordinates per driver/bus with timestamp

Also add fields to `SupportStaff`/`User` for bus driver association.

---

### 2. Backend API Routes

#### [NEW] [face-attendance.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/routes/face-attendance.ts)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/v1/face/register` | Save face descriptor for user |
| `GET` | `/api/v1/face/descriptor` | Get own face descriptor |
| `POST` | `/api/v1/face/attend` | Submit face+geo attendance |
| `GET` | `/api/v1/face/logs` | Admin: get face attendance logs |

#### [NEW] [bus-tracking.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/routes/bus-tracking.ts)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/v1/bus/location` | Driver posts current GPS position |
| `GET` | `/api/v1/bus/locations` | Admin gets all active driver locations |
| `GET` | `/api/v1/bus/history/:driverId` | Admin gets 24h location history |

#### [MODIFY] [index.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/index.ts)
Register the 2 new route files.

---

### 3. Module System — Add New Premium Module Keys

#### [MODIFY] [modules.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/lib/modules.ts)

Add 2 new `ModuleKey` entries:
- `'mod_face_attendance'` — Face Recognition Attendance (premium)
- `'mod_bus_tracking'` — Live Bus GPS Tracking (premium)

Add their definitions to `MODULE_CATALOG` with `isPremium: true`.

---

### 4. Frontend Pages

#### [NEW] Face Registration Page — Teacher
**Path**: `frontend/app/(dashboard)/teacher/face-register/page.tsx`

- Loads `face-api.js` models from CDN
- Shows live camera feed
- Detects face, extracts 128-float descriptor
- POST to `/api/v1/face/register`
- Shows success confirmation with face thumbnail

#### [NEW] Face Attendance Page — Teacher (Self-Service)
**Path**: `frontend/app/(dashboard)/teacher/face-attendance/page.tsx`

- Camera opens automatically
- Loads own stored descriptor via GET
- Matches live face vs stored descriptor (threshold: 0.5 Euclidean distance)
- Simultaneously grabs `navigator.geolocation` coordinates
- If match passes → POST attendance with lat/lng
- Shows clear success/failure UI

#### [NEW] Face Attendance Logs — Admin
**Path**: `frontend/app/(dashboard)/admin/face-attendance/page.tsx`

- Table of all face-verified attendance records
- Shows: Staff name, time, confidence %, location verified badge, GPS coords
- Filter by date/staff

#### [NEW] Bus Driver Live Tracking — Driver Portal
**Path**: `frontend/app/(dashboard)/teacher/bus-tracking/page.tsx`

- Button: "Start Sharing Location" / "Stop"
- When active: calls `navigator.geolocation.watchPosition` every 15s → POST to API
- Shows own current coordinates + accuracy

#### [NEW] Bus Live Map — Admin
**Path**: `frontend/app/(dashboard)/admin/bus-tracking/page.tsx`

- Uses **Leaflet.js** (loaded via CDN script tag, no npm package needed)
- Polls `/api/v1/bus/locations` every 15 seconds
- Shows each active driver as a bus icon pin on the map
- Click pin → shows driver name, bus number, last updated time, speed

#### [MODIFY] Superadmin Modules Page
**Path**: `frontend/app/(dashboard)/superadmin/modules/page.tsx`

The 2 new modules automatically appear in the catalog since they're added to `MODULE_CATALOG`. The superadmin can toggle them on/off per institution. **No code change needed** — the catalog is dynamic.

---

### 5. Sidebar Navigation

#### [MODIFY] Sidebar/layout files
Add navigation links for new pages under teacher and admin panels, **guarded by `hasModule()`** checks.

---

## Verification Plan

### Automated
- `npm run build` in frontend — TypeScript must compile cleanly
- Backend: `npx prisma validate` — schema must be valid

### Manual Verification
1. **Superadmin**: Go to Modules page → verify `Face Recognition Attendance` and `Bus GPS Tracking` appear as Premium modules, can be toggled per institution
2. **Teacher (Face Register)**: Open face registration page → allow camera → register face → confirm success
3. **Teacher (Face Attend)**: Open face attendance → camera activates → face is matched → attendance logged with GPS
4. **Driver**: Open bus tracking → start sharing → GPS coords appear
5. **Admin (Bus Map)**: Open map → driver pin appears, updates every 15s
6. **Admin (Face Logs)**: Face attendance logs show with confidence score

### Module Gating
- When `mod_face_attendance` is disabled for an institution → Face attendance pages show "Module not enabled" message
- When `mod_bus_tracking` is disabled → Bus tracking pages show upgrade prompt
