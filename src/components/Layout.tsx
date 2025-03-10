import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl font-bold">
              AI Quiz Generator
            </a>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a
                    href="/"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/quiz"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Create Quiz
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t mt-12">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Quiz Generator. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
