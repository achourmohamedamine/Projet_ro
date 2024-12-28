'''from flask import Flask, request, jsonify
import gurobipy as gp
from gurobipy import GRB
from flask_cors import CORS
app = Flask(__name__)
CORS(app) 

@app.route('/optimiser', methods=['POST'])
def optimiser():
    try:
            data = request.json
            villes = data['villes'] 
            distances = data['distances'] 
            centres_regions = data['centres_regions']  
            rentabilite_usine = {k: float(v) for k, v in data['rentabilite_usine'].items()}  
            rentabilite_entrepot = {k: float(v) for k, v in data['rentabilite_entrepot'].items()}  
            couts_usine = {k: float(v) for k, v in data['couts_usine'].items()}  
            couts_entrepot = {k: float(v) for k, v in data['couts_entrepot'].items()}  
            priorites = {k: int(v) for k, v in data['priorites'].items()}  
            budget_total = float(data['budget_total'])  
            diametre_region = float(data['diametre_region'])  
            max_entrepots = int(data['max_entrepots'])  


        
            if not villes or not distances:
                raise ValueError("Veuillez d'abord saisir toutes les données nécessaires")
            if not centres_regions:
                raise ValueError("Veuillez sélectionner au moins un centre de région")
            if budget_total <= 0 or diametre_region <= 0 or max_entrepots <= 0:
                raise ValueError("Les paramètres doivent être des nombres positifs")

            
            m = gp.Model("Selection d'usines et entrepôts")
            x = m.addVars(villes, vtype=GRB.BINARY, name="usine")
            y = m.addVars(villes, vtype=GRB.BINARY, name="entrepot_ville")
            m.setObjective(
                gp.quicksum(rentabilite_usine[i] * x[i] for i in villes) +
                gp.quicksum(rentabilite_entrepot[i] * y[i] for i in villes),
                GRB.MAXIMIZE
            )
            
            m.addConstr(
                gp.quicksum(couts_usine[i] * x[i] for i in villes) +
                gp.quicksum(couts_entrepot[i] * y[i] for i in villes) <= budget_total,
                "Budget"
            )
            for i in villes:
                m.addConstr(y[i] <= x[i], name=f"Entrepot_Liaison_{i}")

        
            for i in villes:
                m.addConstr(x[i] + y[i] >= priorites[i], name=f"Priorite_{i}")

            for centre in centres_regions:
                region = [ville for ville in villes 
                        if ville == centre or 
                        distances.get(tuple(sorted((ville, centre))), float('inf')) <= diametre_region]
                m.addConstr(
                    gp.quicksum(y[i] for i in region) <= max_entrepots,
                    name=f"Region_Limite_{centre}"
                )
            m.optimize()

            result = {}

            if m.status == GRB.OPTIMAL:
                result["status"] = "optimal"
                result["usines"] = [i for i in villes if x[i].x > 0.5]
                result["entrepots"] = [i for i in villes if y[i].x > 0.5]
                result["rentabilite_maximale"] = m.objVal
            else:
                result["status"] = "no_solution"
                result["message"] = "Aucune solution optimale trouvée."

            return jsonify(result)

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Une erreur est survenue : {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)'''
