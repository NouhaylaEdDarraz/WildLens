import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { FaChartBar, FaUsersCog } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shop } from "./Shop";
import AdminRoute from "./component/AdminRoute";
import ProtectedRoute from "./component/ProtectedRoute";
import logo from "./logo/logo.png";
import AnimalListScreen from "./pages/AnimalListScreen";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import DashboardScreen from "./pages/DashboardPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import HomePage from "./pages/HomePage";
import ImageDataListScreen from "./pages/ImageDataListScreen";
import LoginPage from "./pages/LoginPage";
import PredictionPage from "./pages/PredictionPage";
import ProfileScreen from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import UserEditScreen from "./pages/UserEditPage";
import UserListScreen from "./pages/UserListPage";
function App() {
  const { etat, dispatch: ctxDispatch } = useContext(Shop);
  const { fullBox, userInfo } = etat;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const customNavbarStyle = {
    backgroundColor: "#31c48d",
  };
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/login";
  };
  const [sidebarIsOpen] = useState(false);

  const {
    etat: { mode },
    dispatch,
  } = useContext(Shop);

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", mode);
  }, [mode]);

  const switchModeHandler = () => {
    dispatch({ type: "SWITCH_MODE" });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? "site-container active-cont d-flex flex-column full-box"
              : "site-container active-cont d-flex flex-column"
            : fullBox
            ? "site-container d-flex flex-column full-box"
            : "site-container d-flex flex-column"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Link to="/"></Link>
          <Navbar style={customNavbarStyle} expand="lg">
            {" "}
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <img
                    src={logo}
                    alt="Logo"
                    height="80"
                    width="300"
                    className="d-inline-block align-top"
                  />
                </Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto w-100 justify-content-end">
                  <Link className="nav-link" to="/prediction">
                    Prediction
                  </Link>
                  <Button variant={mode} onClick={switchModeHandler}>
                    <i
                      className={mode === "light" ? "fa fa-sun" : "fa fa-moon"}
                    ></i>
                  </Button>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/login">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Utilisateurs</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/images">
                        <NavDropdown.Item>images</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen && userInfo && userInfo.isAdmin && windowWidth > 768
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column d-none"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item className="mt-auto">
              <div className="text-center">
                <strong>ADMIN MENU</strong>
              </div>
              <LinkContainer to="/admin/dashboard">
                <Nav.Link className="mb-3">
                  <FaChartBar className="mr-2" /> Dashboard
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/admin/users">
                <Nav.Link className="mb-3">
                  <FaUsersCog className="mr-2" /> Utilisateurs
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
        </div>

        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prediction" element={<PredictionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forget-password" element={<ForgetPasswordPage />} />
              <Route path="/listanimal" element={<AnimalListScreen />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />

              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/images"
                element={
                  <AdminRoute>
                    <ImageDataListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/confirm-email/:userId"
                element={<ConfirmEmailPage />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </main>
        <footer className="mt-auto" style={customNavbarStyle}>
          <div className="text-center2">all right reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
export default App;
