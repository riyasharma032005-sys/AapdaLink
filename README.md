# AapdaLink – Community Disaster Resource Coordination System

AapdaLink is a full-stack humanitarian crisis and disaster coordination web application connecting affected citizens with volunteer rescuers, registered relief NGOs, emergency shelters, and relief inventory in real time.

## 🚀 Key Features

- **4 Specialized Role Portals**:
  - **Citizen / Affected User**: Report emergency distress needs (Food, Water, Medicine, Shelter, Rescue) with GPS coordinates and photos. Track status live.
  - **Volunteer**: Live incident feed with filters, interactive geospatial map, single-click task acceptance, on-ground navigation, and completion status reporting.
  - **NGO**: Relief warehouse inventory tracking (supplies, medical kits, rations), emergency shelter capacity management, and distress request allocation.
  - **Admin**: Command center monitoring system metrics, verifying responder accounts, monitoring requests, and tracking capacity across regions.
- **Interactive Mapping**: Leaflet & OpenStreetMap integration plotting incidents and relief shelters.
- **Real-time WebSockets**: Instant emergency SOS notifications to on-duty responders and status updates to citizens.
- **Authentication**: JWT token-based auth with bcrypt encrypted passwords.
- **Production-Ready & Responsive**: Built with React 18, Tailwind CSS, Lucide icons, Express, and MongoDB.

---

## 🛠️ Technology Stack

- **Frontend**: React.js + Vite, Tailwind CSS, React Router DOM, Leaflet & React-Leaflet, Axios, Lucide React, Socket.IO Client.
- **Backend**: Node.js + Express.js, MongoDB + Mongoose, JWT + bcryptjs, Socket.IO, Multer.

---

## 💻 Quick Start & Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populates sample test data for all 4 roles
npm run dev      # Starts Express & Socket.io server on http://localhost:5000
```

### 2. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev      # Starts React Vite dev server on http://localhost:5173
```

---

## 🔑 Demo Test Accounts

You can log in with any of these pre-seeded demo accounts (or use the one-click buttons on the Login page):

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@aapdalink.org` | `password123` |
| **Citizen** | `aarav@gmail.com` | `password123` |
| **Volunteer** | `rohan@volunteer.org` | `password123` |
| **NGO** | `contact@sevarelief.org` | `password123` |

---

## 📡 API Endpoints Summary

- `POST /api/auth/register` - User registration with role selection
- `POST /api/auth/login` - User login & token generation
- `GET /api/requests` - Public / responder emergency request feed
- `POST /api/requests` - Submit new SOS with GPS & photo (Citizen)
- `GET /api/requests/my-requests` - Citizen's reported requests
- `PUT /api/requests/:id/accept` - Volunteer / NGO accepts SOS
- `PUT /api/requests/:id/status` - Status update (Pending -> In Progress -> Completed)
- `GET /api/resources` - NGO inventory list
- `POST /api/resources` - Add new supply stock
- `GET /api/shelters` - Active relief camps & capacity
- `POST /api/shelters` - Register new shelter
- `GET /api/admin/stats` - Platform health & analytics
