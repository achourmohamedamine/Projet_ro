import React from 'react';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import '/src/Components/Card/Cards.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function Cards  ()  {
  return ( <>
    
    <Row>
      <Col className="sm=6">
        <Card body>
          <CardTitle>Special Title Treatment</CardTitle>
          <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
          <Button>Go somewhere</Button>
        </Card>
      </Col>
      <Col className="sm=6">
        <Card body>
          <CardTitle>Special Title Treatment</CardTitle>
          <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
          <Button>Go somewhere</Button>
        </Card>
      </Col>
    </Row>
    
    </>
  );
};

export default Cards;