import React, { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { AiOutlineUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Shop } from "../Shop";
import LoadingBox from "../component/Loading";
import MessageBox from "../component/MessageError";
import castorImage from "../images/castor.jpg";
import chatImage from "../images/chat.jpg";
import chienImage from "../images/chien.jpg";
import coyoteImage from "../images/coyote.jpg";
import ecureuilImage from "../images/ecureuil.jpg";
import lapinImage from "../images/lapin.jpg";
import loupImage from "../images/loup.jpg";
import lynxImage from "../images/lynx.jpg";
import oursImage from "../images/ours.jpg";
import pumaImage from "../images/puma.jpg";
import ratImage from "../images/rat.jpg";
import ratonLaveurImage from "../images/raton_laveur.jpg";
import renardImage from "../images/renard.jpg";

const speciesImages = {
  Écureuil: ecureuilImage,
  Castor: castorImage,
  Chat: chatImage,
  Chien: chienImage,
  Coyote: coyoteImage,
  Lapin: lapinImage,
  Loup: loupImage,
  Ours: oursImage,
  Puma: pumaImage,
  Rat: ratImage,
  "Raton laveur": ratonLaveurImage,
  Renard: renardImage,
  Lynx: lynxImage,
};

const PredictionPage = () => {
  const { etat } = useContext(Shop);
  const navigate = useNavigate();
  const { userInfo } = etat;
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [especeData, setEspeceData] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Veuillez choisir une image à téléverser.");
      return;
    }
    if (!userInfo) {
      toast.error("Veuillez vous connecter pour téléverser une image.", {
        autoClose: 3000,
        onClose: () => {
          navigate("/login");
        },
      });
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }

      const resultData = await response.json();
      setResult(resultData);

      if (resultData.class) {
        const especeResponse = await fetch(
          `/upload/getByEspece/${resultData.class}`
        );

        if (especeResponse.ok) {
          const especeData = await especeResponse.json();
          setEspeceData(especeData);
        } else {
          throw new Error(`Erreur HTTP ! Statut : ${especeResponse.status}`);
        }
      }
    } catch (error) {
      console.error("Erreur lors du téléversement de l'image :", error);
      setError(
        "Une erreur est survenue lors du traitement de l'image. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="card p-4">
        <Helmet>
          <title>Téléversement d'image</title>
        </Helmet>
        <h1 className="mb-4 text-center2">Téléversement d'image</h1>
        <Form onSubmit={handleUpload} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="image" className="form-label">
              Choisissez une image :
            </Form.Label>
            <Form.Control
              type="file"
              className="form-control"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            <AiOutlineUpload /> Téléverser
          </Button>
        </Form>

        {loading ? (
          <LoadingBox className="mt-3" />
        ) : error ? (
          <MessageBox variant="danger" className="mt-3">
            {error}
          </MessageBox>
        ) : (
          result && (
            <div className="mt-4">
              <Row>
                <Col>
                  <h2>Résultat de la prédiction :</h2>
                  <p>
                    Classe : <strong>{result.class}</strong>
                  </p>
                  <p>
                    Score : <strong>{result.score}</strong>
                  </p>
                </Col>
              </Row>

              {especeData && (
                <Row className="mt-4">
                  <Col>
                    <h2>Résultats détaillés :</h2>
                    {especeData.map((animal, index) => (
                      <div key={index} className="mb-3">
                        {animal.Espèce && speciesImages[animal.Espèce] && (
                          <img
                            src={speciesImages[animal.Espèce]}
                            alt={animal.Espèce}
                            className="img-fluid rounded"
                            style={{ width: "250px", height: "200px" }}
                          />
                        )}
                        <p>
                          Espèce : <strong>{animal.Espèce}</strong>
                        </p>
                        <p>
                          Description : <strong>{animal.Description}</strong>
                        </p>
                        <p>
                          Nom latin : <strong>{animal["Nom latin"]}</strong>
                        </p>
                        <p>
                          Famille : <strong>{animal.Famille}</strong>
                        </p>
                        <p>
                          Taille : <strong>{animal.Taille}</strong>
                        </p>
                        <p>
                          Région : <strong>{animal.Région}</strong>
                        </p>
                        {animal.Habitat && (
                          <p>
                            Habitat : <strong>{animal.Habitat}</strong>
                          </p>
                        )}
                        <p>
                          Fun fact : <strong>{animal["Fun fact"]}</strong>
                        </p>
                      </div>
                    ))}
                  </Col>
                </Row>
              )}
            </div>
          )
        )}
      </div>
    </Container>
  );
};

export default PredictionPage;
