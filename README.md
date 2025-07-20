# SkillBridge - AI-Powered Job Matching Platform

A modern job portal that uses artificial intelligence to analyze resumes and intelligently match candidates with job opportunities. Built with Next.js and featuring ML-powered resume analysis.

## 🚀 Features

### For Recruiters
- **Job Management**: Create, edit, and delete job postings
- **AI-Powered Analysis**: Get instant resume summaries and match scores
- **Application Tracking**: View and manage all applications
- **Professional Dashboard**: Clean interface with dropdown menus and real-time updates

### For Candidates
- **Easy Applications**: Simple resume upload and application process
- **Job Discovery**: Browse available positions with detailed information
- **Application Status**: Track your application progress
- **Resume Storage**: Secure cloud storage for your documents

### AI/ML Features
- **Resume Summarization**: AI extracts key information from resumes
- **Match Scoring**: ML algorithm calculates candidate-job compatibility
- **Cached Results**: Avoid repeated analysis with intelligent caching
- **Real-time Processing**: Instant analysis and scoring

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js (Credentials, Google, GitHub)
- **File Storage**: Supabase Storage
- **UI Components**: shadcn/ui, Lucide React Icons
- **ML Integration**: Custom Python ML model
- **Styling**: Tailwind CSS with dark mode support

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Python 3.8+ (for ML model)
- Supabase account

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd next_app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file with:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/skillbridge"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# OAuth Providers (Optional)
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── jobs/          # Job management
│   │   ├── applications/  # Application handling
│   │   └── ml/            # ML integration
│   ├── auth/              # Auth pages
│   ├── dashboard/         # Dashboard pages
│   └── onboard/           # User onboarding
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.js              # Custom components
├── lib/                   # Utilities and configs
└── prisma/               # Database schema and migrations
```

## 🔧 ML Integration

The platform integrates with a Python ML model for resume analysis:

1. **Resume Upload**: Candidates upload PDF resumes to Supabase Storage
2. **Analysis Request**: Frontend requests analysis via `/api/ml/summarize`
3. **PDF Processing**: Backend downloads PDF and sends to ML model
4. **Result Caching**: Results are stored to avoid repeated analysis
5. **UI Display**: Summary and match score displayed in recruiter dashboard

### ML Model Requirements
- Endpoint: `http://localhost:8000/match`
- Method: POST with multipart/form-data
- Input: PDF file and job description
- Output: JSON with `summary` and `match_score`

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Professional Layout**: Clean, modern interface
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant components

## 🔐 Authentication

- **Multiple Providers**: Email/password, Google, GitHub
- **Role-Based Access**: Separate flows for recruiters and candidates
- **Session Management**: Secure session handling with NextAuth
- **Protected Routes**: Automatic redirects for unauthenticated users

## 📊 Database Schema

### Core Models
- **User**: Authentication and profile data
- **Recruiter**: Recruiter-specific information
- **Candidate**: Candidate-specific information
- **Job**: Job postings and requirements
- **Application**: Job applications with resume URLs
- **ApplicationMLResult**: Cached ML analysis results

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Railway**: Easy PostgreSQL and deployment
- **Netlify**: Static hosting with serverless functions
- **AWS**: Full cloud deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Prisma](https://www.prisma.io/) for database management
- [Supabase](https://supabase.com/) for file storage and backend services

## 📞 Support

For support, email support@skillbridge.com or create an issue in this repository.

---

**Built with ❤️ using Next.js and AI**
