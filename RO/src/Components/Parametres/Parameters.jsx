import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import styles from "/src/Components/Parametres/Parametres.module.css";
import axios from 'axios';

function TaskPlanning() {
    const [nbretaches, setNbretaches] = useState(1);
    const [forms, setForms] = useState([]);
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [formdata, setFormdata] = useState({
        "critere": "",
        "tasks": [],
        "priorités": [],
        "complexités": [],
        "min_time": "",
        "total_time": ""
    });

    const handleNbreChange = (event) => {
        setNbretaches(event.target.value);
    };

    const handleClick = () => {
        const newForms = [];
        for (let i = 0; i < nbretaches; i++) {
            newForms.push(i + 1);
        }
        setForms(newForms);
    };
    
    const handletimeTotal = (event) => {
        setFormdata(f => ({
            ...f,
            total_time: event.target.value
        }));
    };

    const handletimeminimal = (event) => {
        setFormdata(f => ({
            ...f,
            min_time: event.target.value
        }));
    };

    const handlenomtask = (index, value) => {
        setFormdata((f) => {
            const updatedTasks = [...f.tasks];
            updatedTasks[index] = value;
            return { ...f, tasks: updatedTasks };
        });
    };

    const handlePrioritéChange = (index, value) => {
        setFormdata((f) => {
            const updatedPriorités = [...f.priorités];
            updatedPriorités[index] = value;
            return { ...f, priorités: updatedPriorités };
        });
    };

    const handleComplexité = (index, value) => {
        setFormdata((f) => {
            const updatedComplexités = [...f.complexités];
            updatedComplexités[index] = value;
            return { ...f, complexités: updatedComplexités };
        });
    };

    const handleselect = (event) => {
        setFormdata((f) => ({
            ...f,
            critere: event.target.value
        }));
    };

    const handleSubmit = () => {
        const API_URL = "http://127.0.0.1:5000/solve";
      
        axios
            .post(API_URL, formdata)
            .then((response) => {
                console.log("Response from API:", response.data);
                alert("Data submitted successfully!");
            })
            .catch((error) => {
                console.error("Error submitting data:", error);
                alert("Failed to submit data. Please try again.");
            });
    };
    console.log(formdata);
    return (
        <>
            <Form>
                <FormGroup >
                    <Label for="OPTION">Choisir le critère de planification:</Label>
                    <Input
                        id="critère"
                        name="critère"
                        placeholder="------"
                        type="select"
                        onChange={handleselect}
                    >
                        <option value="Priorite">Priorité</option>
                        <option value="Complexite">Complexité</option>
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="nbre_taches">Nombre de tâches à planifier :</Label>
                    <Input
                        id="nbre_taches"
                        name="nbre_taches"
                        placeholder="Ex: 3"
                        type="select"
                        onChange={handleNbreChange}
                    >
                        {array.map((nbre, index) => (
                            <option key={index} value={nbre}>
                                {nbre}
                            </option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="temps_total">Temps total estimé (en h):</Label>
                    <Input id="temps_total" name="temps_total" placeholder="Ex: 90" type="number" required onChange={handletimeTotal} />
                </FormGroup>

                <FormGroup>
                    <Label for="temps_minimal">Temps minimal de la tâche :</Label>
                    <Input
                        id="temps_minimal"
                        name="temps_minimal"
                        type="number"
                        placeholder="Ex: 5"
                        onChange={handletimeminimal}
                    />
                </FormGroup>

                <div className={styles.wrapper}><Button onClick={handleClick}>Caractériser vos tâches !</Button></div>
            </Form>

            {forms.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Configuration des tâches</h3>
                    <Form>
                        {forms.map((type, index) => (
                            <React.Fragment key={index}>
                                <h5>Tâche {type}</h5>
                                <Row className="row-cols-lg g-3" id={styles.row}>
                                    <Col className={styles.col}>
                                        <FormGroup>
                                            <Label for="nom_tache">Nom de la tâche :</Label>
                                            <Input
                                                id="nom_tache"
                                                name="nom_tache"
                                                placeholder="Ex: Étudier la biologie"
                                                type="text"
                                                onChange={(e) => handlenomtask(index, e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <Label for={`priorité-${type}`}>Priorité de la tâche :</Label>
                                            <Input
                                                id={`priorité-${type}`}
                                                name={`priorité-${type}`}
                                                placeholder="1"
                                                type="select"
                                                onChange={(e) => handlePrioritéChange(index, e.target.value)}
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <Label for={`complexité-${type}`}>Complexité de la tâche :</Label>
                                            <Input
                                                id={`complexité-${type}`}
                                                name={`complexité-${type}`}
                                                placeholder="1"
                                                type="select"
                                                onChange={(e) => handleComplexité(index, e.target.value)}
                                            >
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
                        <div className={styles.wrapper}><Button onClick={handleSubmit}>Optimiser la planification</Button></div>
                    </Form>
                </div>
            )}
        </>
    );
}

export default TaskPlanning;
