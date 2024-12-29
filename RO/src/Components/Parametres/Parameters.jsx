import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import styles from "/src/Components/Parametres/Parametres.module.css";


ChartJS.register(ArcElement, Tooltip, Legend);

function TaskPlanning() {
  const [critere,setCritere]=useState("");
  const [nbretaches, setNbretaches] = useState(1);
  const [forms, setForms] = useState([]);
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [formdata, setFormdata] = useState({
    critere: "Tache_Continue",
    tasks: [],
    priorités: [1],
    max_period: [1],
    Tmin : [],
    total_time: "",
  });
  const [schedule, setSchedule] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

 
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}h`;
          }
        }
      }
    }
  };


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
    setFormdata((f) => ({
      ...f,
      total_time: event.target.value,
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

  const handleTempsMax = (index, value) => {
    setFormdata((f) => {
      const updatedTempsMax = [...f.max_period];
      updatedTempsMax[index] = value;
      return { ...f, max_period: updatedTempsMax };
    });
  };

  const handleselect = (event) => {
    setFormdata((f) => ({
      ...f,
      critere: event.target.value,
    }));
    setCritere(event.target.value);
  };
  const handleTempsMin=(index,value)=> {
    setFormdata((f)=> {
      const updatedTempsMin =[...f.Tmin]
      updatedTempsMin[index]=value;
      return {...f,Tmin: updatedTempsMin};
    });
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSubmit = () => {
    const API_URL = "http://127.0.0.1:5000/solve";
    
    console.log('Submitting formdata:', formdata);

    axios
      .post(API_URL, formdata)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "optimal") {
          const scheduleData = response.data.schedule;
          setSchedule(scheduleData);
          
          if (critere === "Tache_Continue") {
            const newChartData = {
              labels: scheduleData.map(item => item.task),
              datasets: [{
                data: scheduleData.map(item => item.allocated_time),
                backgroundColor: [
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(255, 159, 64, 0.8)',
                  'rgba(199, 199, 199, 0.8)',
                  'rgba(83, 102, 255, 0.8)',
                  'rgba(40, 159, 64, 0.8)',
                  'rgba(210, 99, 132, 0.8)',
                ],
                borderColor: [
                  'rgb(54, 162, 235)',
                  'rgb(255, 99, 132)',
                  'rgb(255, 206, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(153, 102, 255)',
                  'rgb(255, 159, 64)',
                  'rgb(199, 199, 199)',
                  'rgb(83, 102, 255)',
                  'rgb(40, 159, 64)',
                  'rgb(210, 99, 132)',
                ],
                borderWidth: 1,
              }],
            };
            setChartData(newChartData);
          } else {
            // For Tache_Repartie, create chart data from total allocated time
            const newChartData = {
              labels: scheduleData.map(item => item.task),
              datasets: [{
                data: scheduleData.map(item => item.allocated_time),
                backgroundColor: [
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                  'rgb(54, 162, 235)',
                  'rgb(255, 99, 132)',
                  'rgb(255, 206, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(153, 102, 255)',
                ],
                borderWidth: 1,
              }],
            };
            setChartData(newChartData);
          }
          setModalMessage("");
        } else {
          setModalMessage("Aucune solution trouvée pour ces paramètres");
          setSchedule([]);
          setChartData(null);
        }
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        setModalMessage(
          "Une erreur s'est produite lors du traitement de votre demande"
        );
        setIsModalOpen(true);
        
      });
      
  };
  const renderPeriodicTaskDetails = (task) => {
    // Add safety check for periods
    if (!task || !task.periods || !Array.isArray(task.periods)) {
      return null;
    }

    // Only show periods that have non-zero time allocation
    const nonZeroPeriods = task.periods.filter(period => period.time_allocated > 0);

    if (nonZeroPeriods.length === 0) {
      return null;
    }

    return (
      <div className="mt-2">
        <h6 className="font-weight-bold">Répartition par période:</h6>
        <div className="table-responsive">
          <table className={`${styles.table} table-sm styles.table-bordere`}>
            <thead>
              <tr>
                <th >Période</th>
                <th >Temps alloué (h)</th>
              </tr>
            </thead>
            <tbody>
              {nonZeroPeriods.map((period, idx) => (
                <tr key={idx}>
                  <td>{period.period}</td>
                  <td>{Number(period.time_allocated).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Form>
        <FormGroup>
          <Label for="OPTION">Choisir le critère de planification:</Label>
          <Input
            id="critère"
            name="critère"
            placeholder="------"
            type="select" 
            onChange={handleselect}
          >
            <option value="Tache_Continue">Tache Continue</option>
            <option value="Tache_Repartie">Tache Repartie</option>
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
          <Input
            id="temps_total"
            name="temps_total"
            placeholder="Ex: 90"
            type="number"
            required
            onChange={handletimeTotal}
          />
        </FormGroup>

        <div className={styles.wrapper}>
          <Button onClick={handleClick}>
            Caractériser vos tâches !
          </Button>
        </div>
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
                      <Label for={`nom_tache_${index}`}>Nom de la tâche :</Label>
                      <Input
                        id={`nom_tache_${index}`}
                        name={`nom_tache_${index}`}
                        placeholder="Ex: Étudier la biologie"
                        type="text"
                        onChange={(e) => handlenomtask(index, e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`priorité-${type}`}>
                        Priorité de la tâche :
                      </Label>
                      <Input
                        id={`priorité-${type}`}
                        name={`priorité-${type}`}
                        placeholder="1"
                        type="select"
                        onChange={(e) =>
                          handlePrioritéChange(index, e.target.value)
                        }
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
                      <Label for={`Temps Min-${type}`}>
                        Temps min:
                      </Label>
                      <Input
                        id={`Temps_min-${type}`}
                        name={`Temps_min-${type}`}
                        placeholder="1"
                        type="number"
                        onChange={(e)=> handleTempsMin(index,e.target.value)}>
                        
                      
                      </Input>
                    </FormGroup>
                  </Col>
                  {critere !="Tache_Continue" && 
                  <Col>
                    <FormGroup>
                      <Label for={`Temps Max-${type}`}>
                        Temps_max :
                      </Label>
                      <Input
                        id={`Temps_max-${type}`}
                        name={`Temps_max-${type}`}
                        placeholder="1"
                        type="number"
                        onChange={(e) =>
                          handleTempsMax(index, e.target.value)
                        }
                      >
                      </Input>
                    </FormGroup>
                  </Col>}
                </Row>
                <hr />
              </React.Fragment>
            ))}
            <div className={styles.wrapper}>
              <Button onClick={handleSubmit} >
                Optimiser la planification
              </Button>
            </div>
          </Form>
        </div>
      )}

<Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          Résultat de la planification
        </ModalHeader>
        <ModalBody>
          {modalMessage ? (
            <div className="text-center p-3">{modalMessage}</div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                {schedule.map((item, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <div className="font-weight-bold mb-2">
                      Tâche: {item.task}
                    </div>
                    <div>Durée totale: {item.allocated_time}h</div>
                    {critere === "Tache_Repartie" && renderPeriodicTaskDetails(item)}
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                {chartData && (
                  <div style={{ height: '400px', width: '100%', position: 'relative' }}>
                    <h5 className="text-center mb-3">
                      {critere === "Tache_Continue" ? 
                        "Répartition du temps total" : 
                        "Répartition du temps total par tâche"}
                    </h5>
                    <Doughnut 
                      data={chartData}
                      options={chartOptions}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default TaskPlanning;