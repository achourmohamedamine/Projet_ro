from flask import Flask, request, jsonify
from flask_cors import CORS
from gurobipy import Model, GRB, quicksum

app = Flask(__name__)
CORS(app) 

# Function to solve the complete scheduling optimization problem
def solve_complete_scheduling(n,M, T, tmin, v):
    try:
        model = Model("Task_Scheduling_Complete")
        
        # Variables de décision : Temps alloué à chaque tâche
        t = model.addVars(n, vtype=GRB.CONTINUOUS, name="x")
        
        # Fonction objectif : Maximiser la valeur totale des tâches accomplies
        model.setObjective(sum(v[i] * t[i] for i in range(n)), GRB.MAXIMIZE)
        
        # Contraintes
        model.addConstr(sum(t[i] for i in range(n)) <= T, "Total_Time")
        for i in range(n):
            model.addConstr(t[i] >= tmin[i], f"tempsmin_{i}")
        
        # Optimisation
        model.optimize()
        
        # Vérification de la solution optimale
        if model.status == GRB.OPTIMAL:
            solution = []
            for i in range(n):
                solution.append({
                    "task": M[i],
                    "allocated_time": round(t[i].x, 2)
                })
            return {
                "status": "optimal",
                "total_value": round(model.objVal, 2),
                "schedule": solution
            }
        else:
            return {"status": "no_solution", "message": "No optimal solution found."}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Function to solve the periodic scheduling optimization problem
def solve_periodic_scheduling(n, M,Max,T,tmin, v):
    try:
        model = Model("Task_Scheduling_Periodic")
        
        # Variables de décision
        t = model.addVars(n, vtype=GRB.CONTINUOUS, name="x")
        y = model.addVars(n, n, vtype=GRB.CONTINUOUS, name="y")
        z = model.addVars(n, vtype=GRB.INTEGER, name="z")
        b = model.addVars(n, n, vtype=GRB.BINARY, name="b")
        
        # Fonction objectif
        model.setObjective(sum(v[i] *t [i] for i in range(n)), GRB.MAXIMIZE)
        
        # Contraintes
        model.addConstr(sum(t[i] for i in range(n)) <= T, "Total_Time")
        for i in range(n):
            model.addConstr(z[i] >= t[i] / Max[i], f"Periods_Task_{i}")
        for i in range(n):
            model.addConstr(sum(y[i, k] for k in range(n)) == t[i], f"Task_{i}_Time_Allocation")
        for i in range(n):
            model.addConstr(t[i]>=tmin[i], f"Tmin")
        for i in range(n):
            for k in range(n):
                model.addConstr(y[i, k] <= Max[i]* b[i, k], f"Max_Period_Time_{i}_{k}")
                model.addConstr(k + 1 <= z[i] + (1 - b[i, k]) * n, f"Activation_{i}_{k}")
        
        # Optimisation
        model.optimize()
        
        # Vérification de la solution optimale
        if model.status == GRB.OPTIMAL:
            solution = []
            for i in range(n):
                task_schedule = {
                    "task": M[i],
                    "allocated_time": round(t[i].x, 2),
                    "periods": []
                }
                for k in range(n):
                    task_schedule["periods"].append({
                        "period": k + 1,
                        "time_allocated": round(y[i, k].x, 2)
                        })
                solution.append(task_schedule)
            return {
                "status": "optimal",
                "total_value": round(model.objVal, 2),
                "schedule": solution
            }
        else:
            return {"status": "no_solution", "message": "No optimal solution found."}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Flask route to solve the optimization
@app.route('/solve', methods=['POST'])
def solve():
    try:
        # Get input data from request
        data = request.json
        Cr = data.get("critere")  # "PlanificationComplete" or "PlanificationPériodique"
        M = data.get("tasks", [])  # List of task names or identifiers
        P = [float(p) for p in data.get("priorités", [])]  # List of priorities
        Tmin = [float(c) for c in data.get("Tmin", [])]  # List of tm
        TD = float(data.get("total_time", 0))  # Total available time

        # Input validation
        if not all([M, P,Tmin, TD, Cr]):
            return jsonify({"status": "error", "message": "Invalid input data."}), 400
        
        n = len(M)
        
        if Cr == "Tache_Continue":
            v = P  # Valeur des tâches est donnée par les priorités
            result = solve_complete_scheduling(n, M,TD, Tmin, v)
        
        else :  
            Max = [float(c) for c in data.get("max_period",[])] 
            result = solve_periodic_scheduling(n, M,Max, TD,Tmin, P)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
