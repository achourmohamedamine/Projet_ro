from flask import Flask, request, jsonify
import gurobipy as gp
from gurobipy import GRB
from flask_cors import CORS
app = Flask(__name__)
CORS(app) 

@app.route('/optimiser', methods=['POST'])
def optimiser():
    try:
        # Get the data from the POST request
            data = request.json
            
        # Extract values from the request data
            villes = data['villes']  # No casting needed, should already be a list of strings.

            distances = data['distances']  # Assuming it remains a dictionary with proper city pairs as keys.

            centres_regions = data['centres_regions']  # No casting needed, should be a list of strings matching 'villes'.

            rentabilite_usine = {k: float(v) for k, v in data['rentabilite_usine'].items()}  # Cast values to float.

            rentabilite_entrepot = {k: float(v) for k, v in data['rentabilite_entrepot'].items()}  # Cast values to float.

            couts_usine = {k: float(v) for k, v in data['couts_usine'].items()}  # Cast values to float.

            couts_entrepot = {k: float(v) for k, v in data['couts_entrepot'].items()}  # Ensure it is a dictionary with float values.

            priorites = {k: int(v) for k, v in data['priorites'].items()}  # Cast values to integers.

            budget_total = float(data['budget_total'])  # Convert to float.

            diametre_region = float(data['diametre_region'])  # Convert to float.

            max_entrepots = int(data['max_entrepots'])  # Convert to integer.


        # Check the validity of the input data
            if not villes or not distances:
                raise ValueError("Veuillez d'abord saisir toutes les données nécessaires")
            if not centres_regions:
                raise ValueError("Veuillez sélectionner au moins un centre de région")
            if budget_total <= 0 or diametre_region <= 0 or max_entrepots <= 0:
                raise ValueError("Les paramètres doivent être des nombres positifs")

            # Create the model
            m = gp.Model("Selection d'usines et entrepôts")

            # Binary variables for factories
            x = m.addVars(villes, vtype=GRB.BINARY, name="usine")

            # Binary variables for warehouses in the cities
            y = m.addVars(villes, vtype=GRB.BINARY, name="entrepot_ville")

            # Objective: maximize profitability
            m.setObjective(
                gp.quicksum(rentabilite_usine[i] * x[i] for i in villes) +
                gp.quicksum(rentabilite_entrepot[i] * y[i] for i in villes),
                GRB.MAXIMIZE
            )

            # Total budget constraint
            m.addConstr(
                gp.quicksum(couts_usine[i] * x[i] for i in villes) +
                gp.quicksum(couts_entrepot[i] * y[i] for i in villes) <= budget_total,
                "Budget"
            )

            # Linking warehouses and factories
            for i in villes:
                m.addConstr(y[i] <= x[i], name=f"Entrepot_Liaison_{i}")

            # Priority constraints
            for i in villes:
                m.addConstr(x[i] + y[i] >= priorites[i], name=f"Priorite_{i}")

            # Region warehouse limit constraints
            for centre in centres_regions:
                region = [ville for ville in villes 
                        if ville == centre or 
                        distances.get(tuple(sorted((ville, centre))), float('inf')) <= diametre_region]
                m.addConstr(
                    gp.quicksum(y[i] for i in region) <= max_entrepots,
                    name=f"Region_Limite_{centre}"
                )

            # Solve the model
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
    app.run(debug=True)
