import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Shop } from "../Shop";
import { getError } from "../Utils";
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

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        animals: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function AnimalListScreen() {
  const [{ loading, error, animals }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    animals: [],
  });

  const { etat } = useContext(Shop);
  const { userInfo } = etat;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/upload/allanimals");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };

    fetchData();
  }, [userInfo]);

  const speciesImages = {
    Ecureuil: ecureuilImage,
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

  return (
    <div>
      <Helmet>
        <title>Liste des Animaux</title>
      </Helmet>
      <h1>Liste des Animaux</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>IMAGE</th> {/* Nouvelle colonne pour l'image */}
                <th>ESPÈCE</th>
                <th>DESCRIPTION</th>
                <th>NOM LATIN</th>
                <th>FAMILLE</th>
                <th>TAILLE</th>
                <th>RÉGION</th>
                <th>HABITAT</th>
                <th>FUN FACT</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal._id}>
                  <td>
                    {" "}
                    {/* Nouvelle colonne pour l'image */}
                    {animal.Espèce && speciesImages[animal.Espèce] && (
                      <img
                        src={speciesImages[animal.Espèce]}
                        alt={animal.Espèce}
                        className="img-fluid rounded"
                        style={{ width: "50px", height: "50px" }}
                      />
                    )}
                  </td>
                  <td>{animal.Espèce}</td>
                  <td>{animal.Description}</td>
                  <td>{animal["Nom latin"]}</td>
                  <td>{animal.Famille}</td>
                  <td>{animal.Taille}</td>
                  <td>{animal.Région}</td>
                  <td>{animal.Habitat}</td>
                  <td>{animal["Fun fact"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
