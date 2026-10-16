[README.md](https://github.com/user-attachments/files/33565091/README.md)
::: {align="center"}
# 🛍️ CampusMart AI

### Your Campus. Your Marketplace.

**An AI-powered student-to-student marketplace to buy, sell, exchange,
and rent campus essentials.**

[![Live
Demo](https://img.shields.io/badge/Live%20Demo-Visit%20CampusMart-06b6d4?style=for-the-badge&logo=render&logoColor=white)](https://campusmart-ai.onrender.com/)
[![Backend
API](https://img.shields.io/badge/Backend%20API-Render-7c3aed?style=for-the-badge&logo=render&logoColor=white)](https://campusmart-vv4s.onrender.com/)

*Connecting students with affordable campus essentials through a
smarter, community-focused marketplace.*
:::

------------------------------------------------------------------------

## ✨ About the Project

**CampusMart AI** is a student-focused e-commerce marketplace designed
to make campus life more affordable and convenient. Students can
discover products and explore buying, selling, exchanging, or renting
within their campus community.

The project combines a modern web application with AI-assisted shopping
features to help users discover relevant products, consider fair prices,
compare buying versus renting, and find possible exchange opportunities.

> **Note:** Feature availability depends on the latest code and
> production configuration. AI price and exchange scores are estimates,
> not guarantees.

## 🚀 Live Deployment

  --------------------------------------------------------------------------------
  Service                             Link
  ----------------------------------- --------------------------------------------
  🌐 Frontend                         <https://campusmart-ai.onrender.com/>

  ⚙️ Backend                          <https://campusmart-vv4s.onrender.com/>

  🔌 API base                         `https://campusmart-vv4s.onrender.com/api`
  --------------------------------------------------------------------------------

*Render services may take a little time to wake up after inactivity.*

## 🎯 Features

### 🛒 Marketplace

-   Browse the marketplace and view product details.
-   Student-to-student product listing and discovery.
-   Buy/sell, exchange, and rental listing types where supported.
-   Product images, condition and availability details.

### 👤 Accounts & Profiles

-   Student registration and login.
-   Profile viewing and editing.
-   Protected pages and account-based actions.
-   My Listings page.

### 🧺 Shopping

-   Cart and checkout pages.
-   Wishlist.
-   Order history and order details.
-   Seller order management.
-   Notifications and chat pages, subject to backend configuration.

### 🔄 Exchange

-   Exchange listings and offers.
-   My Exchange Offers page.
-   Accept, reject, counter, or cancel offers where supported by the
    current workflow.
-   **AI Exchange Matcher:** suggests possible exchange listings using
    product attributes. Scores are rule-based estimates.

### 🏠 Rentals

-   Rental-related pages.
-   My Rentals and Rental Requests pages, where enabled by the backend
    workflow.

### 🤖 AI-Assisted Features

-   **AI Smart Product Finder** --- helps narrow down relevant products.
-   **AI Fair Price Predictor** --- provides estimated price guidance.
-   **AI Buy-vs-Rent Advisor** --- helps compare buying and renting.
-   **AI Exchange Matcher** --- finds potentially suitable exchange
    candidates.

Potential future features---seller assistance, scam-risk analysis,
personalized recommendations, listing-quality checks, image/video
analysis, and demand prediction---should be considered roadmap items
unless implemented and enabled in the current deployment.

### 🛡️ Admin

-   Admin login and dashboard.
-   User, product and report management pages, subject to configured
    admin permissions.

## 🧰 Tech Stack

**Frontend:** React, Vite, React Router, Axios, Tailwind CSS, Lucide
React, Mapbox GL JS (where used).

**Backend:** Node.js, Express.js, MongoDB / MongoDB Atlas, JWT
authentication, Cloudinary uploads and email/OTP integration where
configured.

**Deployment:** Render frontend and backend; MongoDB Atlas database
configuration.

## 🗺️ Main Routes

  -----------------------------------------------------------------------
  Page                                Route
  ----------------------------------- -----------------------------------
  Home                                `/`

  Marketplace                         `/marketplace`

  Product details                     `/product/:id`

  Sell                                `/sell`

  Login / Register                    `/login`, `/register`

  Profile / Edit profile              `/profile`, `/profile/edit`

  Cart / Checkout                     `/cart`, `/checkout`

  Orders / Order details              `/orders`, `/orders/:id`

  Seller orders                       `/seller-orders`

  My listings                         `/my-listings`

  Wishlist                            `/wishlist`

  Notifications / Chat                `/notifications`, `/chat`

  My rentals / Rental requests        `/my-rentals`, `/rental-requests`

  My exchange offers                  `/my-exchange-offers`

  Exchange offers                     `/exchange-offers`

  AI Exchange Matcher                 `/ai-exchange-matcher`

  About / Our Team                    `/about`

  Forgot password                     `/forgot-password`

  Admin login                         `/admin/login`

  Admin dashboard                     `/admin/dashboard`

  Admin users / products / reports    `/admin/users`, `/admin/products`,
                                      `/admin/reports`
  -----------------------------------------------------------------------

Some routes require authentication, valid data or server configuration.
Keep this table aligned with the current application.

## ⚙️ Run Locally

### Prerequisites

-   Node.js and npm
-   Git
-   MongoDB or MongoDB Atlas access

### 1. Clone your repository

Replace the placeholder with your actual GitHub repository URL:

``` bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY.git
cd CampusMart
```

### 2. Install and run the backend

``` bash
cd backend
npm install
```

Create `backend/.env` using the exact variable names expected by your
backend source code. Typical examples may include:

``` env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Additional variables may be needed for Cloudinary, email, AI services or
other integrations. Check your source code for the exact names. Then run
the backend script defined in `backend/package.json`, commonly:

``` bash
npm run dev
```

### 3. Install and run the frontend

Open a second terminal:

``` bash
cd frontend
npm install
```

Create `frontend/.env`:

``` env
VITE_API_URL=http://localhost:5000/api
```

Start Vite:

``` bash
npm run dev
```

Open the local URL printed in the terminal, usually
`http://localhost:5173`.

### 🔐 Environment-variable safety

-   Never commit `.env` files, database credentials, JWT secrets, or
    private API keys.
-   Set production environment variables in Render.
-   Only variables prefixed with `VITE_` are exposed to frontend/browser
    code.
-   Restart Vite after changing frontend environment variables.

## 📁 Project Structure

``` text
CampusMart/
├── frontend/
│   ├── public/
│   │   └── images/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server entry file
└── README.md
```

Adjust the tree if your actual repository structure differs.

## 🔌 API Configuration

The frontend uses `VITE_API_URL` when configured. Example production API
base:

``` env
VITE_API_URL=https://campusmart-vv4s.onrender.com/api
```

Local development:

``` env
VITE_API_URL=http://localhost:5000/api
```

## ✅ Release Checklist

-   [ ] Home and Marketplace load.
-   [ ] Product details and images display correctly.
-   [ ] Registration and login work.
-   [ ] Listing creation and upload work.
-   [ ] Cart, checkout and order flows work end-to-end.
-   [ ] Exchange offer actions work.
-   [ ] AI endpoints handle invalid input and missing configuration.
-   [ ] About page and team links work on desktop and mobile.
-   [ ] Production frontend can reach the production API.
-   [ ] No secrets or `.env` files are committed.

## 🛣️ Roadmap

-   [x] Core marketplace and product pages
-   [x] Student account and listing pages
-   [x] Cart, wishlist and order-related pages
-   [x] Exchange-related pages and AI exchange matching implementation
-   [x] About Us / Our Team page
-   [ ] Improve AI recommendations with real usage data
-   [ ] Add stronger listing-quality and scam-risk checks
-   [ ] Expand automated testing and monitoring
-   [ ] Continue improving mobile accessibility and performance

Update these checkboxes to reflect the actual implementation and
deployment status.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a branch: `git checkout -b feature/your-feature`
3.  Commit your changes: `git commit -m "Add your feature"`
4.  Push the branch: `git push origin feature/your-feature`
5.  Open a Pull Request.

## 👥 Our Team

CampusMart AI is built by a team of four students. Replace the sample
entries with your teammates' real names, responsibilities and profile
links.

-   **Jeet Mondal** --- Team Leader / Full Stack Development ---
    [GitHub](https://github.com/JEETJM)
-   **Team Member 2** --- Add role and profile link
-   **Team Member 3** --- Add role and profile link
-   **Team Member 4** --- Add role and profile link

## 📄 License

No license has been specified here. Add a `LICENSE` file if you intend
to publish the project under an open-source license.

------------------------------------------------------------------------

::: {align="center"}
### Made for students, built for campus life.

**CampusMart AI · Your Campus. Your Marketplace.**

[🚀 Open the Live App](https://campusmart-ai.onrender.com/)
:::
