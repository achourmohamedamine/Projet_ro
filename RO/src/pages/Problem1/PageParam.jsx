import Parameters from "../../Components/Parametres/Parameters";

import styles from "/src/pages/Problem1/Problem1.module.css";





function PageParam(){
    return (
            <div className={styles.ContainerProblem}>
                <h2>Plan de revison</h2>
                <Parameters></Parameters>
            </div>
    
    );
} 
export default PageParam;