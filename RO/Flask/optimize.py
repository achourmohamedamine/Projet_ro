from flask import Flask, request, jsonify # type: ignore
from gurobipy import Model, GRB, quicksum
import json
app = Flask(__name__)
from gurobipy import Model, GRB, quicksum
M=["RO","Statistiques","Optimisation","Commerce"]
P= [3, 2.5, 3, 1]
C = [3, 2, 2, 2]
TM= 1
TD = 20
w = [P[i] / C[i] for i in range(len(P))]
a = TD/ sum(w)
n=4
model = Model("Optimisation de la révision")
t= [model.addVar(lb=TM, ub=TD, vtype=GRB.CONTINUOUS, name=f"T_{i + 1}") for i in range(n)]
model.setObjective(quicksum((P[i] ) * t[i] for i in range(n)), GRB.MAXIMIZE)
model.addConstr(quicksum(t) <= TD, "Temps Disponible")
for i in range(n):
    model.addConstr(t[i] >= a * (P[i] / C[i]), f"ContrainteTemps neccessaire pour la complexite_{i + 1}")
model.optimize()

if model.status == GRB.OPTIMAL:
    print("\nSolution optimale trouvée :")
    for i in range(n):
        time_in_hours = t[i].x
        full_hours = int(time_in_hours)
        minutes = int((time_in_hours - full_hours) * 60)
        print(f"{M[i]} : Tempsapproximative = {full_hours} heures et {minutes} minutes")
    print(f"Profit total(score)  : {model.objVal:.2f}")
else:
    print("\nAucune solution optimale trouvée.")