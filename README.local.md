# AI Quiz Generator - Local Setup Guide

## Overview
This application allows users to upload documents and generate quizzes using AI. The current implementation uses mock data for demonstration purposes.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation Steps

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**
   ```
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```
   npm run dev
   # or
   yarn dev
   ```

4. **Open the application**
   Open your browser and navigate to: `http://localhost:5173`

## Application Structure

- `/src/components` - UI components
- `/src/pages` - Main application pages
- `/src/services` - Service layer for document processing

## Features

1. **Document Upload**
   - Supports PDF, DOCX, JPG, PNG files
   - Drag & drop interface

2. **Profile Information**
   - Optional user details to tailor questions

3. **Question Types**
   - Multiple Choice Questions
   - Fill in the Blanks
   - True/False
   - Short Answer

4. **Results Display**
   - Score calculation
   - Answer review

## AI Implementation

The application can use either:

1. **Mock Data** (default if no API key is provided)
   - Pre-defined questions for demonstration purposes

2. **OpenRouter with Google's Gemini 2.0 Flash model**
   - Real AI-powered question generation
   - Requires an OpenRouter API key

### Setting up OpenRouter

1. Sign up for an account at [OpenRouter](https://openrouter.ai/)
2. Create an API key
3. Create a `.env` file in the project root (copy from `.env.example`)
4. Add your OpenRouter API key: `VITE_OPENROUTER_API_KEY=your_key_here`

## Future Enhancements

1. Integration with AI services for document analysis
2. User authentication and saved quizzes
3. Sharing capabilities
4. More question types and customization options
