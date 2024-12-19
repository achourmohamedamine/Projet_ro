import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col
} from "reactstrap"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./Ville.module.css";
import DistanceMatrix from '../Matrix/DistanceMatrix '
import axios from 'axios';


function Ville() {
  const [cities, setCities] = useState([]);
  const [nbreville, setNbreville] = useState(1);
  const [forms, setForms] = useState([]);
  const [data, setData] = useState({
    villes: [],
    distances: {},
    centres_regions: [],
    rentabilite_usine: {},
    rentabilite_entrepot: {},
    couts_usine: {},
    couts_entrepot: {},
    budget_total: "",
    diametre_region: "",
    max_entrepots: "",
    priorites: {}
    
  });

  const handleChange = (event) => {
    setNbreville(event.target.value);
  };

  const handleClick = () => {
    const newForms = [];
    for (let i = 0; i < nbreville; i++) {
      newForms.push(i + 1);
    }
    setForms(newForms);
    setCities([]);
    setData((prev) => ({
      ...prev,
      villes: Array(nbreville).fill(""),
    }));
  };

  const handleInputChange = (key, field, index, value) => {
    setData((prev) => {
      const newData = { ...prev };
  
      if (field === "villes") {
        newData.villes[index] = value;
      } else if (field === "centres_regions") {
        if (value) {
          newData.centres_regions = [...new Set([...newData.centres_regions, key])];
        } else {
          newData.centres_regions = newData.centres_regions.filter((v) => v !== key);
        }
      } else if (field === "priorites") {
        newData.priorites[key] = value ? 1 : 0;  // This will ensure 0 when unchecked
      } else {
        newData[field][key] = value;
      }
  
      return newData;
    });
  };
  
  const handleDistancesSubmit = (submittedDistances) => {
    setData((prev) => ({
      ...prev,
      distances: submittedDistances
    }));
  };
  
  const handleSubmit = () => {
    const API_URL = "http://127.0.0.1:5000/optimiser";
  
    const formattedData = {
      villes: data.villes.filter(Boolean), // Filter out any empty cities
      distances: data.distances,
      rentabilite_usine: data.rentabilite_usine,
      rentabilite_entrepot: data.rentabilite_entrepot,
      couts_usine: data.couts_usine,
      couts_entrepot: data.couts_entrepot,
      budget_total: Number(data.budget_total),
      diametre_region: Number(data.diametre_region),
      max_entrepots: Number(data.max_entrepots),
      priorites: data.priorites,
      centres_regions: data.centres_regions // Assuming this is handled properly in your form
    };
  
    axios
      .post(API_URL, formattedData)
      .then((response) => {
        console.log("Response from API:", response.data);
        alert("Data submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert("Failed to submit data. Please try again.");
      });
  };
  
  
  const handleGlobalInputChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  console.log(data);

  return (
    <>
      <Form className={styles.form}>
        <FormGroup>
          <Label for="budjet">Budget Total :</Label>
          <Input
            id="budjet"
            name="budjet"
            placeholder="Ex: 1600"
            type="number"
            onChange={(e) => handleGlobalInputChange("budget_total", e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="distance">Distance maximale entre les villes (km) :</Label>
          <Input
            id="distance_max"
            name="distance"
            placeholder="Ex: 90"
            type="number"
            onChange={(e) => handleGlobalInputChange("diametre_region", e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelect">Nombre de villes</Label>
          <Input
            id="exampleSelect"
            name="select"
            type="select"
            onChange={handleChange}
          >
            {[...Array(5).keys()].map((i) => (
              <option key={i + 1}>{i + 1}</option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="nb_max">nombre d'entrepot max dans cette region : </Label>
          <Input
            id="nb_max"
            name="nb_max"
            placeholder="Ex: 2"
            type="number"
            onChange={(e) => handleGlobalInputChange("max_entrepots", e.target.value)}
          />
        </FormGroup>

        <div className={styles.wrapper}>
          <Button onClick={handleClick}>Configurer les Villes</Button>
        </div>
      </Form>

      {forms.length > 0 && (
        <div>
          <h3>Configuration des villes</h3>
          <Form>
            {forms.map((_, index) => (
              <div key={index}>
                <h5>Ville {index + 1}</h5>
                <Row className="row-cols-lg-auto g-3 align-items-center">
                  <Col>
                    <FormGroup>
                      <Label for={`nomville_${index}`} className="visually-hidden">
                        Nom de ville
                      </Label>
                      <Input
                        type="text"
                        id={`nom_ville_${index}`}
                        name={`ville_${index}`}
                        placeholder="Nom de ville"
                        onChange={(e) =>
                          handleInputChange(index, "villes", index, e.target.value)
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`cout_usine_${index}`} className="visually-hidden">
                        Coût usine
                      </Label>
                      <Input
                        type="number"
                        id={`cout_usine_${index}`}
                        name={`cout_usine_${index}`}
                        placeholder="Coût usine"
                        onChange={(e) =>
                          handleInputChange(
                            data.villes[index] || `Ville${index + 1}`,
                            "couts_usine",
                            index,
                            e.target.value
                          )
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`cout_entrepot_${index}`} className="visually-hidden">
                        Coût entrepôt
                      </Label>
                      <Input
                        type="number"
                        id={`cout_entrepot_${index}`}
                        name={`cout_entrepot_${index}`}
                        placeholder="Coût entrepôt"
                        onChange={(e) =>
                          handleInputChange(
                            data.villes[index] || `Ville${index + 1}`,
                            "couts_entrepot",
                            index,
                            e.target.value
                          )
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`rentabilite_usine_${index}`} className="visually-hidden">
                        Rentabilité usine
                      </Label>
                      <Input
                        type="number"
                        id={`rentabilite_usine_${index}`}
                        name={`rentabilite_usine_${index}`}
                        placeholder="Rentabilité usine"
                        onChange={(e) =>
                          handleInputChange(
                            data.villes[index] || `Ville${index + 1}`,
                            "rentabilite_usine",
                            index,
                            e.target.value
                          )
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`rentabilite_entrepot_${index}`} className="visually-hidden">
                        Rentabilité entrepôt
                      </Label>
                      <Input
                        type="number"
                        id={`rentabilite_entrepot_${index}`}
                        name={`rentabilite_entrepot_${index}`}
                        placeholder="Rentabilité entrepôt"
                        onChange={(e) =>
                          handleInputChange(
                            data.villes[index] || `Ville${index + 1}`,
                            "rentabilite_entrepot",
                            index,
                            e.target.value
                          )
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Input
                        type="checkbox"
                        id={`priority_${index}`}
                        onChange={(e) =>
                          handleInputChange(
                            data.villes[index] || `Ville${index + 1}`,
                            "priorites",
                            index,
                            e.target.checked
                          )
                        }
                      />
                      <Label check for={`priority_${index}`}>
                        Priorité
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Input
                        type="checkbox"
                        id={`center_${index}`}
                        onChange={(e) =>
                          handleInputChange(
                            data.villes[index] || `Ville${index + 1}`,
                            "centres_regions",
                            index,
                            e.target.checked
                          )
                        }
                      />
                      <Label check for={`center_${index}`}>
                        Centre
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
              </div>
            ))}
          </Form>
        </div>
      )}

      {forms.length > 0 && data.villes.length > 1 && ( <>
        <DistanceMatrix cities={data.villes.filter(Boolean)} onSubmit={handleDistancesSubmit} />
        <div className={styles.wrapper}>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </>)}

      
    </>
  );
}

export default Ville;
