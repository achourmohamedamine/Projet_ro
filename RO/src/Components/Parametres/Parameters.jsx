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
import styles from "/src/Components/Parametres/Parametres.module.css";



function Parameters() {
    const [nbrematieres, setNbrematieres] = useState(1);
    const [forms, setForms] = useState([]);
    const array=[1,2,3,4,5,6,7,8,9,10];

    const handleChange = (event) => {
      setNbrematieres(event.target.value);
    };

    const handleClick = () => {
      const newForms = [];
      for (let i = 0; i < nbrematieres; i++) {
        newForms.push(i + 1);
      }
      setForms(newForms);
    };

  return (
    <>
    
      <Form>
        <FormGroup>
        <Label for="nbre_matieres">Nombre de matières à réviser :</Label>
        <Input
          id="nbre_passagers"
          name="nbre_passagers"
          placeholder="Ex: 3"
          type="select"
          onChange={handleChange}
        >
          {array.map((nbre, index) => (
            <option key={index} value={nbre}>
              {nbre}  
            </option>
          ))}
        </Input>

          
        </FormGroup>
        <FormGroup>
          <Label for="temps_total">Temps total (en h):</Label>
          <Input id="temps_total" name="temps_total" placeholder="Ex: 90" type="number" required />
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelect">Temps minimal de revison </Label>
          <Input
            id="exampleSelect"
            name="select"
            type="number"
            placeholder="ex : 5"
            
          >
            
          </Input>
        </FormGroup>

        <div className={styles.wrapper}><Button onClick={handleClick}>Configurer les matieres</Button></div>
      </Form>

      {forms.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Configuration matieres</h3>
          <Form>
            {forms.map((type, index) => (
              
              <React.Fragment key={index}>
                <h5>matiere {type}</h5>
                <Row className="row-cols-lg g-3 " id={styles.row}>
                  <Col className={styles.col}>
                    <FormGroup>
                    <Label for="nom_matieres">Nom de la matière :</Label>
                    <Input
                      id={styles.nom_matieres}
                      name="nom_matieres"
                      placeholder="Ex: physique"
                      type="text"
                      
                    /></FormGroup>
                
                </Col>
                <Col>
                  <FormGroup>
                  <Label for={`priorité-${type}`}>Priorité de la matiere :</Label>
                  <Input
                    id={`priorité-${type}`}
                    name={`priorité-${type}`}
                    placeholder="1"
                    type="select" >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </Input>
                    </FormGroup>
                    
                    
                    
                  
                
                </Col>
                <Col>
                <FormGroup>
                
                  <Label for={`complexité-${type}`}>complexité de la matieres :</Label>
                  <Input
                    id={`complexité-${type}`}
                    name={`complexité-${type}`}
                    placeholder="1"
                    type="select" >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </Input>
                  
                    </FormGroup>
                </Col>
                </Row>
               <hr />
              </React.Fragment>
              
            ))}
             <div className={styles.wrapper} ><Button>Submit</Button></div>
          </Form>
        </div>
      )}
    </>
  );
}

export default Parameters;
