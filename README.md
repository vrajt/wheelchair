# Wheelchair Rental Hub - Admin Dashboard

This is the admin dashboard for the Wheelchair Rental Hub, a comprehensive platform for managing wheelchair rentals, users, transactions, and more. It is built with Next.js, TypeScript, and Tailwind CSS, providing a modern and efficient interface for administrators.

## Core Features

-   **Dashboard Overview**: At-a-glance view of key metrics, including total users, active rentals, and service cities, presented with interactive charts.
-   **User Management**: View, deactivate, and manage user profiles. Includes KYC document verification and data export to Excel.
-   **Wheelchair Management**: Full CRUD (Create, Read, Update, Delete) functionality for wheelchairs, including status tracking and review management.
-   **Rental Management**: Track and manage all wheelchair rentals with detailed information and data export capabilities.
-   **Transaction Management**: Monitor all financial transactions, view details, and export data. Includes an AI-powered anomaly detection feature to flag suspicious activity.
-   **Category & City Management**: Easily add, edit, and manage wheelchair categories and the cities where services are available.
-   **Notifications**: Integrated system notifications to keep admins informed of important events.
-   **System Settings**: Configure general site settings, maintenance mode, and localization preferences.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (React)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
-   **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) for the transaction anomaly detection feature.
-   **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm, yarn, or pnpm

### Environment Variables

Before running the application, you need to set up your environment variables. Create a file named `.env` in the root of the project and add the following, replacing the value with your actual backend API URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

### Login Credentials

The application uses a mock authentication system for demonstration purposes. Use the following credentials to log in:

-   **Username**: `admin`
-   **Password**: `admin123`

## Folder Structure

Here is a high-level overview of the project's folder structure:

```
/
├── src/
│   ├── app/                    # Next.js App Router: pages and layouts
│   │   ├── (admin)/            # Admin-only routes with a shared layout
│   │   ├── login/              # Login page
│   │   └── ...
│   ├── components/             # Reusable React components (UI, custom)
│   ├── config/                 # Application configuration (e.g., navigation)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and libraries
│   ├── patches/                # Patches for node modules (e.g., react-quill)
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets (images, fonts)
└── ...
```
