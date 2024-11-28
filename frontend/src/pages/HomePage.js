import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import animal_track from "../logo/animal_track.jpeg";
import wildLensLogo from "../logo/logo.png";

const HomePage = () => {
  return (
    <div className="homepage">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="text-center2">
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              Bienvenue chez WildLens
            </h1>
            <p style={{ fontSize: "1.2rem", color: "#555", lineHeight: "1.6" }}>
              Exploitez le pouvoir de l'intelligence artificielle pour la
              reconnaissance d'empreinte animale
            </p>
          </Col>
        </Row>
      </Container>

      <section id="learn-more" className="py-5">
        <Container>
          <Row>
            <Col md={6}>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
                À propos de WildLens
              </h2>
              <p
                style={{ fontSize: "1.1rem", color: "#666", lineHeight: "1.6" }}
              >
                WildLens est une société dédiée à la protection et à la
                préservation des animaux et de leur habitat naturel. Ils ont
                engagé notre équipe pour développer ce modèle dans le but de
                sensibiliser le public à la cause de la conservation de la
                faune. En collaborant avec WildLens, nous avons pour objectif de
                créer des outils et des expériences qui mettent en lumière
                l'importance de protéger les espèces animales et de prendre des
                mesures concrètes pour préserver leur environnement.
              </p>
              <p
                style={{ fontSize: "1.1rem", color: "#666", lineHeight: "1.6" }}
              >
                Notre objectif est de contribuer à la conservation de la faune
                en aidant les chercheurs, les conservateurs et les organisations
                de protection de la nature à surveiller et à protéger les
                espèces animales menacées.
              </p>
            </Col>
            <Col md={6}>
              <img
                src={wildLensLogo}
                alt="WildLens Logo"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row>
            <Col md={6}>
              <img
                src={animal_track}
                alt="Animal Tracking"
                className="img-fluid"
              />
            </Col>
            <Col md={6}>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
                Notre Technologie
              </h2>
              <p
                style={{ fontSize: "1.1rem", color: "#666", lineHeight: "1.6" }}
              >
                Nous utilisons des techniques d'apprentissage automatique et de
                vision par ordinateur pour entraîner des modèles d'intelligence
                artificielle capables de reconnaître et de suivre les empreintes
                des animaux à partir d'images.
              </p>

              <Button
                variant="custom"
                href="/prediction"
                style={{
                  backgroundColor: "#ffff",
                  borderColor: "#ff4500",
                  fontSize: "1.2rem",
                  marginTop: "1rem",
                  color: "black ",
                }}
              >
                Tester notre modèle
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="text-center2">
                <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  Animaux sur lesquels le modèle est entraîné
                </h2>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "#666",
                    lineHeight: "1.6",
                  }}
                >
                  Notre modèle d'intelligence artificielle est entraîné pour
                  reconnaître et suivre les empreintes de différentes espèces
                  animales telles que les chats, les chiens, etc.
                </p>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "#666",
                    lineHeight: "1.6",
                  }}
                >
                  Pour en savoir plus sur chaque espèce, cliquez sur le bouton
                  ci-dessous :
                </p>
                <Button
                  variant="custom"
                  href="/listanimal"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#ff4500",
                    fontSize: "1.2rem",
                    marginTop: "1.5rem",
                    color: "black ",
                  }}
                >
                  Voir tous les animaux
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
