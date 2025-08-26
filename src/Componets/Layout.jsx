import React from "react";
import { Box, Container } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SEO from "./SEO";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import { useSelector } from "react-redux";

function Layout({ children, seoProps }) {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");

  // Default SEO props untuk Dinkes
  const defaultSEO = {
    title: "Dinas Kesehatan - Sistem Informasi Perjalanan Dinas",
    description:
      "Sistem informasi perjalanan dinas dan pengelolaan aset Dinas Kesehatan",
    url: window.location.href,
    image: "/src/assets/dinkes.jpg",
    organization: {
      name: "Dinas Kesehatan",
      url: window.location.origin,
      logo: "/src/assets/Logo Pena.png",
      description: "Dinas Kesehatan - Melayani Masyarakat dengan Profesional",
      address: {
        streetAddress: "Jl. Contoh No. 123",
        addressLocality: "Kota",
        addressRegion: "Provinsi",
        postalCode: "12345",
      },
      contactPoint: {
        telephone: "+62-123-456789",
        contactType: "customer service",
      },
    },
  };

  // Gabungkan default SEO dengan props yang diberikan
  const finalSEO = { ...defaultSEO, ...seoProps };

  return (
    <Box>
      <SEO {...finalSEO} />
      <Box
        bgColor={"secondary"}
        minH={"75vh"}
        // ms={isAuthenticated ? "250px" : "0"}
        pt={isAuthenticated ? "80px" : "0"}
      >
        <Navbar />
        {children}
        <Footer />
      </Box>
    </Box>
  );
}

export default Layout;
