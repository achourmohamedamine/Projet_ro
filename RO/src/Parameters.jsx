import React,{useState,useEffect} from "react"; 
import {Form,FormGroup,FormFeedback,Label,Input,FormText,Button,Card,CardBody,CardColumns,CardDeck} from 'reactstrap'
function Parameters(){
    const [nbretype,setNbretype]=useState(0);
    const [forms,setForms]=useState([]);
    const handleChange =(event)=> {
        setNbretype(event.target.value);
    }
    const handleClick =()=> {
        const newForms= [];
        for (let i=0;i<nbretype;i++){
            newForms.push(i+1);
        }
        setForms(newForms);
    }
   
       

    return(<>
    
    <Form>
    <FormGroup>
        <Label for="nbre_passagers">
        Nombre Total des passagers :
        </Label><br></br>
        <Input
        id="nbre_passagers"
        name="email"
        placeholder="Ex: 1600"
        type="text"
        />
    </FormGroup>
    <FormGroup>
        <Label for="bagages">
        Poids total des bagages (tonnes) :
        </Label> <br></br>
        <Input
        id="bagages"
        name="bag"
        placeholder="ex: 90"
        type="text"
        />
    </FormGroup>
    <FormGroup>
        <Label for="exampleSelect">
        nombre de types d'avions
        </Label> <br />
        <Input
        id="exampleSelect" name="select" type="select" onChange={handleChange} >
        <option>
            1
        </option>
        <option>
            2
        </option>
        <option>
            3
        </option>
        <option>
            4
        </option>
        <option>
            5
        </option>
        </Input>
    </FormGroup>
    
    
    
        
        
       
    <Button onClick={handleClick }>
        Configurer les types d'avions
    </Button>
    
</Form>
{forms.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Configuration des types d'avions</h3>
          {forms.map((type, index) => (
            <Card key={index} style={{ marginBottom: "10px" }}>
              <CardBody>
                <h5>Avion Type {type}</h5>
                <FormGroup>
                  <Label for={`capacity-${type}`}>Capacité passagers :</Label>
                  <Input
                    id={`capacity-${type}`}
                    name={`capacity-${type}`}
                    placeholder="Ex: 200"
                    type="text"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for={`baggage-${type}`}>
                    Capacité bagages (tonnes) :
                  </Label>
                  <Input
                    id={`baggage-${type}`}
                    name={`baggage-${type}`}
                    placeholder="Ex: 6"
                    type="text"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for={`cost-${type}`}>Coût de location :</Label>
                  <Input
                    id={`cost-${type}`}
                    name={`cost-${type}`}
                    placeholder="Ex: 800000"
                    type="text"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for={`max-${type}`}>
                    Nombre maximum d'avions disponibles :
                  </Label>
                  <Input
                    id={`max-${type}`}
                    name={`max-${type}`}
                    placeholder="Ex: 12"
                    type="text"
                  />
                </FormGroup>
              </CardBody>
            </Card>
          ))}
          <Button>Submit</Button>
        </div>
      )}
    
    </>);
}
export default Parameters;