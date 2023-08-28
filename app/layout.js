import Providers from "@/context/Providers";
import Footer from "./Footer";
import "./globals.css";
import Header from "./Header";

export const metadata = {
  title: "Transparent Open Collaborative E-Leanrning Platform - TOCEP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="border-b border-gray-300">
            <Header />
          </div>
          <div className="fit text-gray-900">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
