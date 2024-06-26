import React, { useEffect, useState } from "react";
import { useLocation, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { useAuth } from "context/auth.js";
import AuthNavbar from "components/dashboard/Navbars/AuthNavbar.js";
import AuthFooter from "components/dashboard/Footers/AuthFooter";

import routesAuth from "routers/routesAuth";

const AuthLayout = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { getUserByAccessToken } = useAuth();

  const [isAuthenticatedChecked, setIsAuthenticatedChecked] = useState(false);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const user = await getUserByAccessToken();
  //     if (user) {
  //       if (user.role.name !== "ADMIN") {
  //         navigate("/admin/dashboard");
  //       } else {
  //         // console.log("User:", user);
  //       }
  //     } else {
  //       console.log("User is null");
  //       navigate("/auth/login");
  //     }
  //     setIsAuthenticatedChecked(true);
  //   };
  
  //   if (!isAuthenticatedChecked) {
  //     checkAuth();
  //   }
  // }, [isAuthenticatedChecked, navigate, getUserByAccessToken]);

  React.useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routesAuth) => {
    return routesAuth.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className="main-content" ref={mainContent}>
        <AuthNavbar />
        <div className="header bg-gradient-info py-7 py-lg-8">
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <h1 className="text-white">Welcome!</h1>
                  <p className="text-lead text-light">
                    Nice to meet you!
                  </p>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
        {/* Page content */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Routes>
              {getRoutes(routesAuth)}
              <Route path="*" element={<Navigate to="/auth/dashboard" replace />} />
            </Routes>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  );
};

export default AuthLayout;
