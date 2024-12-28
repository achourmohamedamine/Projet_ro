import React from 'react';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import '/src/Components/Card/Cards.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
function Cards() {
  const navigate = useNavigate();

  // Fonction pour naviguer vers Problem1
  const handleClick = () => {
    navigate('/Problem1');
  };

  // Fonction pour naviguer vers Problem2
  const handleClick2 = () => {
    navigate('/Problem2');
  };

  return (
    <Row className="cards-container">
      {/* Card 1 */}
      <Col sm="6">
        <Card body className="custom-card">
          <CardTitle className="card-title">Planifier Vos Tâches</CardTitle>
          <CardText className="card-text">
            Vous avez un temps limité pour planifier plusieurs tâches, chacune ayant une priorité et une complexité spécifiques. 
            En fonction de vos critères, vous pouvez choisir de prioriser les tâches par leur importance ou leur difficulté. 
            De plus, vous pouvez définir un temps minimal pour l'exécution de toutes les tâches. 
            Le système calculera et attribuera un temps optimal à chaque tâche. Cliquez sur le bouton pour résoudre ce problème et obtenir un plan détaillé adapté à vos besoins.
          </CardText>
          <Button onClick={handleClick}>Resoudre Problem1</Button>
        </Card>
      </Col>

      {/* Card 2 */}
      <Col sm="6">
        <Card body className="custom-card">
          <CardTitle className="card-title">Maximiser La Rentabilité de Votre business</CardTitle>
          <CardText className="card-text">
          Vous avez un budget limité pour établir plusieurs centres régionaux, chacun ayant un rôle précis et des coûts spécifiques.
          En fonction de vos critères, vous pouvez fournir les emplacements stratégiques en tenant compte de leur rentabilité et importance. Le système analysera vos données pour proposer une configuration optimale soumise a des containtes que vous spécifiez. Cliquez sur le bouton pour résoudre ce problème et obtenir une stratégie détaillée qui repond à vos besoins.
          </CardText>
          <Button onClick={handleClick2}>Resoudre Problem 2</Button>
        </Card>
      </Col>
    </Row>
  );
}

export default Cards;