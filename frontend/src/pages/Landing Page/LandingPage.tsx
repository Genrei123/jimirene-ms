import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Link,
  Tabs,
  Tab,
} from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axiosInstance from "../../config/axiosConfig";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
import { useNavigate } from "react-router-dom";

const InfoBox: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <Box
    sx={{
      backgroundColor: "#102A43",
      color: "#FFFFFF",
      p: 4,
      borderRadius: 2,
      textAlign: "center",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
      '&:hover': {
        transform: "translateY(-5px)",
        boxShadow: 3
      }
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
      {title}
    </Typography>
    <Typography>{content}</Typography>
  </Box>
);

const BranchCard: React.FC<{
  name: string;
  address: string;
  contact: string;
  mapLink: string;
}> = ({ name, address, contact, mapLink }) => (
  <Card sx={{
    backgroundColor: "#102A43",
    color: "#FFFFFF",
    p: 4,
    borderRadius: 2,
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    '&:hover': {
      transform: "translateY(-5px)",
      boxShadow: 3
    }
  }}>
    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
        {address}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href={`tel:${contact}`}
          sx={{ color: "#2196F3", '&:hover': { textDecoration: "underline" } }}
        >
          {contact}
        </Link>
        <Button
          variant="outlined"
          size="small"
          sx={{
            color: "#FFFFFF",
            borderColor: "#FFFFFF",
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
          }}
          href={mapLink}
          target="_blank"
        >
          Get Location
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [branches, setBranches] = useState<{ name: string; address: string; contact: string; mapLink: string }[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        const branchData = response.data.map((branch: any) => ({
          name: branch.branch_name,
          address: branch.branch_address,
          contact: branch.branch_contact,
          mapLink: `https://www.google.com/maps?q=${branch.branch_address}`
        }));
        setBranches(branchData);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const carouselImages = [
    image1,
    image2,
    image3
  ];

  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true as const,
  };

  const infoBoxes = [
    { title: "Quality Care", content: "We provide the best care for our patients." },
    { title: "Experienced Staff", content: "Our staff is highly trained and experienced." },
    { title: "Modern Facilities", content: "Our facilities are equipped with the latest technology." },
    { title: "Patient Satisfaction", content: "We prioritize our patients' satisfaction." }
  ];

  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "#0A1929", color: "#FFFFFF", minHeight: "100vh" }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#0A1929", boxShadow: 3 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
            JIMIRENE Maternity and Diagnostic Clinic
          </Typography>
          <Box>
            <Button
              variant="outlined"
              sx={{
                color: "#FFFFFF",
                borderColor: "#FFFFFF",
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                textTransform: 'none',
              }}
              onClick={() => (navigate("/login"))}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section with Carousel */}
      <Box sx={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <Slider {...sliderSettings}>
          {carouselImages.map((imgSrc, index) => (
            <Box
              key={index}
              sx={{
                backgroundImage: `url(${imgSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
                width: "100%"
              }}
            >
              {/* Overlay for better text visibility */}
              <Box sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)"
              }} />

              {/* Hero Content */}
              <Container sx={{ 
                textAlign: "center", 
                height: "100%", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center",
                position: "relative",
                zIndex: 1
              }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: "#FFFFFF" }}>
                  Welcome to <Box component="span" sx={{ color: "#2196F3" }}>JIMIRENE Maternity Clinic</Box>
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, maxWidth: "800px", mx: "auto", color: "#FFFFFF" }}>
                  Providing cutting-edge healthcare solutions tailored to your needs.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#2196F3",
                    color: "#FFFFFF",
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    '&:hover': { backgroundColor: '#1976D2' },
                    textTransform: 'none',
                    alignSelf: "center"
                  }}
                  href="https://web.facebook.com/profile.php?id=100083275475984"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us on Facebook
                </Button>
              </Container>
            </Box>
          ))}
        </Slider>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {infoBoxes.map((box, index) => (
            <Grid item xs={12} md={6} key={index}>
              <InfoBox title={box.title} content={box.content} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 4, color: "#FFFFFF" }}>
          Our Branches
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          centered
          sx={{
            mb: 4,
            '& .MuiTab-root': {
              color: '#FFFFFF',
              '&.Mui-selected': {
                color: '#2196F3',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2196F3',
            },
          }}
        >
          {branches.map((branch, index) => (
            <Tab key={index} label={branch.name} />
          ))}
        </Tabs>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            {branches.length > 0 && <BranchCard {...branches[activeTab]} />}
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ backgroundColor: "#102A43", py: 3, textAlign: "center" }}>
        <Typography variant="body2">2024 &copy; JIMIRENE Diagnostic and Midwifery Clinic. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;