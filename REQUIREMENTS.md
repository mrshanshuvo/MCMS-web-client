# Project Requirements - Frontend (Web Client)

## 1. Global UI & Design Rules
- **Color Palette**: Maximum 3 primary colors (+ optional neutral color).
- **Theme Support**: Light & Dark mode support with proper visual contrast.
- **Layout & Spacing**: Consistent layout, spacing, and alignment throughout the application.
- **Component Consistency**: All cards and components must maintain uniform sizing, border radius, and visual styling.
- **Form States**: Forms must include validation feedback, error messages, success states, and loaders.
- **Responsiveness**: Fully responsive across mobile, tablet, and desktop viewports.
- **Content Quality**: No placeholder or dummy content allowed.

## 2. Home / Landing Page
- **Navbar**:
  - Full-width background layout.
  - Minimum 4 routes when logged out (e.g., Home, Camps/Items, About, Login).
  - Minimum 6 routes when logged in (e.g., Home, Camps/Items, Dashboard, Blog, Profile, Logout).
  - Advanced menu (Profile dropdown with avatar).
  - Sticky or fixed positioning.
  - Fully responsive with mobile navigation menu.
- **Hero Section**:
  - Screen height limited to 60–70% of viewport.
  - Interactive elements (slider, animation, prominent Call-to-Action).
  - Clear visual flow guiding users to subsequent sections.
- **Landing Sections**:
  - Minimum 8 meaningful sections (e.g., Features, Services, Categories, Highlights, Statistics, Testimonials, Blogs, Newsletter, FAQ, Call to Action).
- **Footer**:
  - Fully functional footer with working links.
  - Contact information and social media links included.

## 3. Core Listing / Card Section
- **Card Structure**:
  - Image, Title, Short Description, Meta Info (Price/Fees, Date, Rating, Location, etc.), and "View Details" button.
- **Card Styling & Layout**:
  - Uniform height, width, border radius, and layout structure.
  - Grid layout: minimum of 3 cards per row on desktop view.
  - Skeleton loaders while fetching asynchronous data.

## 4. Details Page
- Publicly accessible page.
- Media showcase / multiple image gallery (if applicable).
- Structured content sections:
  - Description / Overview
  - Key information / Specifications
  - Reviews & Ratings
  - Related items / Recommended camps

## 5. Listing / Explore Page
- Search bar with real-time query support.
- Filtering using at least 2 fields (e.g., category, price/cost, rating, date, location).
- Sorting options (e.g., price low to high, date, popularity).
- Pagination or infinite scrolling.
- Fully functional filter reset and state synchronization.

## 6. Authentication System (UI & Client Logic)
- Login and Registration pages with clean UI.
- **Demo Login Button**: Auto-fill credentials for quick testing (User & Admin).
- **Social Login**: Google / Facebook authentication integration.
- Client-side token / session management and route protection.

## 7. Dashboard (Role-Based UI)
- **Role Support**: User / Admin / Manager interface views.
- **Sidebar Navigation**:
  - User: Minimum 4 menu items (e.g., Overview, Registered Camps, Profile, Settings).
  - Admin: Minimum 6 menu items (e.g., Overview, Manage Users, Manage Camps, Analytics, Categories, Settings).
- **Dashboard Navbar**: Profile icon with dropdown menu (Profile, Settings, Logout).
- **Dashboard Content**:
  - Overview stats cards.
  - Dynamic interactive charts (Bar, Line, Pie) rendering real backend data.
  - Interactive data tables with sorting, filtering, and pagination.
  - Editable user profile page.

## 8. Additional Pages
- At least 2–3 additional complete pages (e.g., About Us, Contact, Blog, Support, Privacy / Terms).

## 9. UX & Form Handling Rules
- Client-side form validation (required fields, email/password patterns, number bounds).
- Loading states (spinners or disabled submit buttons during requests).
- Accessible input elements with properly linked `<label>` tags and ARIA support.
- Proper error and success toast notifications or banner messages.
- Forms requiring complete handling:
  - Login Form
  - Registration Form
  - Contact Form
  - Create Item/Camp Form
  - Edit Item/Camp Form
  - Profile Update Form

## 10. Code Quality & Technical Rules
- Clean and organized component folder structure.
- Reusable UI components (Buttons, Inputs, Modals, Cards).
- Custom React hooks for API data fetching and state management.
- Environment variables (`.env`) for API endpoints and keys.
- No `console.log` statements in production code.
- Meaningful git commit messages.
