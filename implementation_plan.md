# PathshalaPro — Next.js SaaS Frontend

> Production-grade, multi-tenant School Management System with 5 role-based panels

---

## Backend Analysis Summary

After analyzing the complete Java/Spring Boot backend, here's what I found:

### API Architecture
- **Base URL**: `http://localhost:8080/api/v1` (dev) / `https://pathshala-pro-backend.onrender.com/api/v1` (prod)
- **Context path**: `/api/v1` (set via `server.servlet.context-path`)
- **Auth**: JWT (HMAC-SHA256), access token (24h), refresh token (7d)
- **CORS**: Fully open (`*` origin patterns, credentials allowed)
- **Response wrapper**: All responses follow `ApiResponse<T>` = `{ success, message, data, timestamp }`
- **Pagination**: Spring Data `Page<T>` with `page`, `size`, `sortBy` params

### Database Schema (15 tables)
| Table | Key Fields |
|-------|-----------|
| `users` | id, firstName, lastName, email, phone, role, schoolId, classRoomId, parentId |
| `schools` | id, name, code, address, city, state, subscriptionStatus |
| `class_rooms` | id, name, section, grade, academicYear, schoolId, classTeacherId |
| `subjects` | id, name, code, grade, schoolId |
| `timetables` | id, dayOfWeek, startTime, endTime, periodNumber, classRoomId, subjectId, teacherId |
| `exams` | id, name, examType, examDate, totalMarks, passingMarks, classRoomId, subjectId |
| `marks` | id, marksObtained, grade, remarks, examId, studentId |
| `attendances` | id, date, status, studentId, classRoomId |
| `fee_structures` | id, name, feeType, amount, frequency, grade, academicYear |
| `fee_invoices` | id, invoiceNumber, totalAmount, paymentStatus, studentId |
| `payments` | id, amount, razorpayOrderId, razorpayPaymentId, feeInvoiceId |
| `notes` | id, title, contentUrl, contentType, subjectId |
| `online_classes` | id, title, meetingLink, platform, scheduledAt, teacherId |
| `notifications` | id, title, message, notificationType, recipientId |
| `announcements` | id, title, content, targetAudience, isPinned |

### Seeded Data
- **PROJECT_ADMIN**: `admin@pathshalapro.com` / `Admin@123`
- **Demo School**: `DEMO001` - "Delhi Public School - Demo"
- **Subscription Plans**: STARTER (₹999/mo), PRO (₹2499/mo), ENTERPRISE (₹5999/mo)

### Roles & Permissions (from `@PreAuthorize`)

| Endpoint | PROJECT_ADMIN | SCHOOL_ADMIN | TEACHER | STUDENT | PARENT |
|----------|:---:|:---:|:---:|:---:|:---:|
| POST /schools | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /schools | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /schools/{id} | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST fees/structures | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST fees/invoices | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET fees/invoices/student/{id} | ✅ | ✅ | ❌ | ✅ | ✅ |
| POST fees/payment/* | ✅ | ✅ | ❌ | ✅ | ✅ |
| POST /exams | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /exams/{id}/marks | ✅ | ✅ | ✅ | ❌ | ❌ |
| PATCH /exams/{id}/publish | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /exams/student/{id}/results | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /attendance | ✅ | ✅ | ✅ | ❌ | ❌ |
| GET /attendance/student/{id}/stats | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /timetable | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /timetable/* | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /notes | ✅ | ✅ | ✅ | ❌ | ❌ |
| GET /notes/* | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /online-classes | ✅ | ✅ | ✅ | ❌ | ❌ |
| POST /communication/announcements | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /communication/notifications | ✅ | ✅ | ✅ | ❌ | ❌ |
| GET /communication/notifications/my | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /reports/* | ✅ | ✅ | ✅* | ✅* | ✅* |

### Complete Endpoint Inventory (40+ endpoints)

**Auth (4)**: POST login, POST register, POST refresh, POST change-password  
**Schools (4)**: POST create, GET all, GET byId, PUT update, DELETE  
**Fees (7)**: POST structure, GET structures, POST invoice, GET invoices, GET invoices/student, POST create-order, POST verify  
**Timetable (4)**: POST create, PUT update, GET byClass, GET byTeacher, DELETE  
**Exams (5)**: POST create, GET all, POST marks, PATCH publish, GET student/results, GET statistics  
**Attendance (4)**: POST mark(bulk), GET class, GET student, GET student/stats  
**Notes (4)**: POST create, GET all, GET bySubject, PUT update, DELETE  
**Online Classes (4)**: POST schedule, GET all, GET upcoming, PATCH status, DELETE  
**Communication (6)**: POST notification, GET my, GET unread-count, PATCH markRead, PATCH markAllRead, POST announcement, GET announcements  
**Reports (3)**: GET student/performance, GET fees, GET attendance/class  

---

## Proposed Architecture

### Project Location
`d:\codes\progremmo\pathshalapro-web\`

### Folder Structure

```
pathshalapro-web/
├── .env.local                     # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_RAZORPAY_KEY_ID
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json                # ShadCN UI config
│
├── public/
│   └── logo.svg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (providers, Inter font, metadata)
│   │   ├── page.tsx               # Landing → auto redirect to dashboard
│   │   ├── globals.css            # Tailwind + design tokens + glassmorphism
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx     # Login form
│   │   │   └── layout.tsx         # Auth layout (centered card)
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx         # Sidebar + Topbar shell
│   │   │   │
│   │   │   ├── admin/             # PROJECT_ADMIN
│   │   │   │   ├── page.tsx       # Dashboard
│   │   │   │   ├── schools/page.tsx
│   │   │   │   └── schools/create/page.tsx
│   │   │   │
│   │   │   ├── school/            # SCHOOL_ADMIN
│   │   │   │   ├── page.tsx       # Dashboard
│   │   │   │   ├── teachers/page.tsx
│   │   │   │   ├── students/page.tsx
│   │   │   │   ├── fees/
│   │   │   │   │   ├── page.tsx           # Fee structures list
│   │   │   │   │   ├── invoices/page.tsx  # Invoices list
│   │   │   │   │   └── reports/page.tsx   # Fee reports
│   │   │   │   ├── exams/page.tsx
│   │   │   │   ├── attendance/page.tsx
│   │   │   │   ├── timetable/page.tsx
│   │   │   │   ├── notes/page.tsx
│   │   │   │   ├── online-classes/page.tsx
│   │   │   │   └── announcements/page.tsx
│   │   │   │
│   │   │   ├── teacher/           # TEACHER
│   │   │   │   ├── page.tsx       # Dashboard
│   │   │   │   ├── timetable/page.tsx
│   │   │   │   ├── notes/page.tsx
│   │   │   │   ├── attendance/page.tsx
│   │   │   │   ├── exams/page.tsx
│   │   │   │   └── online-classes/page.tsx
│   │   │   │
│   │   │   ├── student/           # STUDENT
│   │   │   │   ├── page.tsx       # Dashboard
│   │   │   │   ├── timetable/page.tsx
│   │   │   │   ├── notes/page.tsx
│   │   │   │   ├── results/page.tsx
│   │   │   │   ├── fees/page.tsx
│   │   │   │   └── attendance/page.tsx
│   │   │   │
│   │   │   └── parent/            # PARENT
│   │   │       ├── page.tsx       # Dashboard
│   │   │       ├── performance/page.tsx
│   │   │       ├── fees/page.tsx
│   │   │       └── attendance/page.tsx
│   │   │
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                    # ShadCN primitives (button, card, input, dialog, etc.)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── breadcrumbs.tsx
│   │   │   └── mobile-nav.tsx
│   │   └── shared/
│   │       ├── data-table.tsx
│   │       ├── stat-card.tsx
│   │       ├── chart-card.tsx
│   │       ├── loading-skeleton.tsx
│   │       ├── error-boundary.tsx
│   │       ├── empty-state.tsx
│   │       └── page-header.tsx
│   │
│   ├── components/providers/
│   │   ├── query-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── auth-provider.tsx
│   │
│   ├── lib/
│   │   ├── axios.ts               # Axios instance + interceptors + token refresh
│   │   ├── utils.ts               # cn() + helpers
│   │   ├── constants.ts
│   │   └── razorpay.ts
│   │
│   ├── services/                  # API call layer (1:1 with backend controllers)
│   │   ├── auth.service.ts
│   │   ├── school.service.ts
│   │   ├── fee.service.ts
│   │   ├── timetable.service.ts
│   │   ├── exam.service.ts
│   │   ├── attendance.service.ts
│   │   ├── notes.service.ts
│   │   ├── online-class.service.ts
│   │   ├── communication.service.ts
│   │   └── report.service.ts
│   │
│   ├── hooks/                     # React Query hooks wrapping services
│   │   ├── use-auth.ts
│   │   ├── use-schools.ts
│   │   ├── use-fees.ts
│   │   ├── use-timetable.ts
│   │   ├── use-exams.ts
│   │   ├── use-attendance.ts
│   │   ├── use-notes.ts
│   │   ├── use-online-classes.ts
│   │   ├── use-communication.ts
│   │   └── use-reports.ts
│   │
│   ├── store/                     # Zustand stores
│   │   ├── auth-store.ts          # User, tokens, role, schoolId
│   │   ├── ui-store.ts            # Sidebar collapsed, active modal
│   │   └── school-store.ts        # Active school context (for admin)
│   │
│   ├── types/                     # 1:1 with backend DTOs + entities
│   │   ├── api.types.ts           # ApiResponse<T>, PaginatedResponse<T>
│   │   ├── auth.types.ts          # LoginRequest, AuthResponse, RegisterUserRequest
│   │   ├── user.types.ts          # UserResponse, RoleName
│   │   ├── school.types.ts        # SchoolRequest, SchoolResponse
│   │   ├── fee.types.ts           # FeeStructure, FeeInvoice, Payment, etc.
│   │   ├── exam.types.ts          # Exam, ExamRequest, MarksEntryRequest, Marks
│   │   ├── attendance.types.ts    # AttendanceRequest, Attendance, AttendanceStatus
│   │   ├── timetable.types.ts     # TimetableRequest, Timetable, DayOfWeek
│   │   ├── notes.types.ts         # NotesRequest, Notes
│   │   ├── online-class.types.ts  # OnlineClassRequest, OnlineClass
│   │   └── communication.types.ts # AnnouncementRequest, NotificationRequest, etc.
│   │
│   ├── utils/
│   │   ├── format.ts              # Currency (₹), dates, percentages
│   │   ├── validation.ts          # Zod schemas matching backend @Valid constraints
│   │   └── role-config.ts         # Role → sidebar items, routes, permissions
│   │
│   └── middleware.ts              # Next.js middleware for route guards
```

---

## Implementation Plan

### Phase 1: Scaffold + Core Infrastructure
1. Create Next.js 14 project with TypeScript + Tailwind
2. Install all dependencies (ShadCN, TanStack Query, Axios, Zustand, React Hook Form, Zod, Recharts, Sonner, Lucide, next-themes, date-fns)
3. Configure ShadCN UI with all needed components
4. Set up globals.css with design tokens (deep indigo/violet palette, glassmorphism)
5. Create `.env.local` with both dev/prod API URLs

### Phase 2: Type System
- Create all TypeScript types matching the 15 database tables + DTOs exactly
- Include all enums: RoleName, ExamType, AttendanceStatus, PaymentStatus, NotificationType, SubscriptionStatus, DayOfWeek

### Phase 3: Axios + Services + Hooks
- Axios instance with Bearer token interceptor + 401 auto-refresh
- 10 service files mapping all 40+ endpoints
- 10 React Query hook files

### Phase 4: Auth + State + Middleware
- Zustand auth store (tokens, user, role)
- Login page with form validation
- Next.js middleware for route protection
- Role-based redirect logic

### Phase 5: Layout (Sidebar + Topbar)
- Collapsible sidebar with role-specific nav
- Topbar with search, notifications, user avatar, theme toggle
- Mobile responsive navigation
- Dark mode support

### Phase 6: Reusable Components
- DataTable with pagination, sorting, search
- StatCard, ChartCard for dashboards
- Loading skeletons, error boundary, empty state
- Page header with breadcrumbs

### Phase 7: All 5 Dashboards
- PROJECT_ADMIN: School count, user stats, revenue
- SCHOOL_ADMIN: Student/teacher counts, fee collection, attendance
- TEACHER: Today's timetable, pending attendance, upcoming classes
- STUDENT: Attendance gauge, upcoming exams, fee dues
- PARENT: Child overview, attendance, fee status

### Phase 8: Fee Management Module (Fully Implemented)
- Fee structures CRUD
- Invoice generation + listing
- Razorpay payment flow (student/parent)
- Fee reports with charts

### Phase 9: All Remaining Module Pages
- Exams, Attendance, Timetable, Notes, Online Classes, Communication, Reports

### Phase 10: Polish
- Error boundaries, toast notifications (Sonner)
- Loading skeletons everywhere
- 404/500 pages

---

## Verification Plan

### Build Verification
```bash
npm run build   # Must pass with zero errors
npx tsc --noEmit  # Strict type checking
npm run lint    # ESLint clean
```

### Browser Verification
- Login with `admin@pathshalapro.com` / `Admin@123`
- Verify redirect to `/admin` dashboard
- Navigate all sidebar items
- Test dark mode toggle
- Test mobile responsive layout
- Test fee payment flow

---

## Key Design Decisions

1. **Token Storage**: Using `localStorage` + Zustand persist (the backend CORS allows credentials, and this is a SaaS admin panel, not a public site)
2. **API Prefix**: All API calls go through `/api/v1/` prefix (already set in backend's context-path)
3. **Parent Panel**: Uses same endpoints as student (student results, attendance stats, fee invoices) — filtered by `parentId` linking to student
4. **No BFF Layer**: Direct client→backend calls since CORS is fully open and this is a SPA
5. **ShadCN Components**: Using `npx shadcn@latest add` for all UI primitives to save time while maintaining full customization
