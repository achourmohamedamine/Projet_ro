import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col
} from "reactstrap"; // Added missing imports for Row and Col
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./Ville.module.css";

function Ville() {
  const [nbreville, setNbreville] = useState(1);
  const [forms, setForms] = useState([]);

  const handleChange = (event) => {
    setNbreville(event.target.value);
  };

  const handleClick = () => {
    const newForms = [];
    for (let i = 0; i < nbreville; i++) {
      newForms.push(i + 1);
    }
    setForms(newForms);
  };

  return (
    <>
      <Form className={styles.form}>
        <FormGroup>
          <Label for="budjet">Budget Total :</Label>
          <Input
            id="budjet"
            name="budjet"
            placeholder="Ex: 1600"
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <Label for="distance">Distance maximale entre les villes (km) :</Label>
          <Input
            id="distance_max"
            name="distance"
            placeholder="Ex: 90"
            type="text"
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
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Input>
        </FormGroup>

        <div>
          <Button onClick={handleClick}>Configurer les types d'avions</Button>
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
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`cout_usine_${index}`} className="visually-hidden">
                        Coût usine
                      </Label>
                      <Input
                        type="text"
                        id={`cout_usine_${index}`}
                        name={`cout_usine_${index}`}
                        placeholder="Coût usine"
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`cout_entrepot_${index}`} className="visually-hidden">
                        Coût entrepôt
                      </Label>
                      <Input
                        type="text"
                        id={`cout_entrepot_${index}`}
                        name={`cout_entrepot_${index}`}
                        placeholder="Coût entrepôt"
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`rentabilite_usine_${index}`} className="visually-hidden">
                        Rentabilité usine
                      </Label>
                      <Input
                        type="text"
                        id={`rentabilite_usine_${index}`}
                        name={`rentabilite_usine_${index}`}
                        placeholder="Rentabilité usine"
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`rentabilite_entrepot_${index}`} className="visually-hidden">
                        Rentabilité entrepôt
                      </Label>
                      <Input
                        type="text"
                        id={`rentabilite_entrepot_${index}`}
                        name={`rentabilite_entrepot_${index}`}
                        placeholder="Rentabilité entrepôt"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
              </div>
            ))}
          </Form>
        </div>
      )}
    </>
  );
}

export default Ville;
