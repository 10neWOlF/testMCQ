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

## Mock Implementation

The current version uses mock data instead of real AI processing. In a production environment, you would integrate with an AI service to analyze documents and generate questions.

## Future Enhancements

1. Integration with AI services for document analysis
2. User authentication and saved quizzes
3. Sharing capabilities
4. More question types and customization options
