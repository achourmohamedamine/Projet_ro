import Parameters from "../Components/Parametres/Parameters";
import styles from "/src/Components/Parametres/Parametres.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';





function PageParam(){
    return (<>
            <div className={styles.Container}>
                <h2>Pont Aerien : Calcul Optimale</h2>
                <Parameters></Parameters>
            </div>
    
    </>);
} 
export default PageParam;