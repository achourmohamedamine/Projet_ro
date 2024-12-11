import gurobipy as gp
from gurobipy import GRB

def saisir_villes():
    while True:
        try:
            n = int(input("Entrez le nombre de villes : "))
            if n <= 0:
                print("Le nombre de villes doit être positif.")
                continue
            villes = []
            for i in range(n):
                ville = input(f"Entrez le nom de la ville {i+1} : ")
                villes.append(ville)
            return villes
        except ValueError:
            print("Veuillez entrer un nombre valide.")

def saisir_donnees_ville(villes, message):
    donnees = {}
    for ville in villes:
        while True:
            try:
                valeur = float(input(f"{message} pour {ville} : "))
                donnees[ville] = valeur
                break
            except ValueError:
                print("Veuillez entrer un nombre valide.")
    return donnees

def saisir_distances(villes):
    distances = {}
    print("\nEntrez les distances entre les villes :")
    for i in range(len(villes)):
        for j in range(i+1, len(villes)):
            while True:
                try:
                    dist = float(input(f"Distance entre {villes[i]} et {villes[j]} : "))
                    if dist < 0:
                        print("La distance doit être positive.")
                        continue
                    distances[tuple(sorted((villes[i], villes[j])))] = dist
                    break
                except ValueError:
                    print("Veuillez entrer un nombre valide.")
    return distances

def saisir_priorites(villes):
    priorites = {}
    print("\nEntrez les priorités des villes (1 pour prioritaire, 0 sinon) :")
    for ville in villes:
        while True:
            try:
                prio = int(input(f"Priorité pour {ville} (0 ou 1) : "))
                if prio not in [0, 1]:
                    print("La priorité doit être 0 ou 1.")
                    continue
                priorites[ville] = prio
                break
            except ValueError:
                print("Veuillez entrer 0 ou 1.")
    return priorites

# Saisie des données
print("=== Configuration du problème d'optimisation ===")
villes = saisir_villes()

print("\nSaisie des coûts des usines")
couts_usine = saisir_donnees_ville(villes, "Coût de l'usine")

print("\nSaisie des coûts des entrepôts")
couts_entrepot = saisir_donnees_ville(villes, "Coût de l'entrepôt")

print("\nSaisie des rentabilités des usines")
rentabilite_usine = saisir_donnees_ville(villes, "Rentabilité de l'usine")

print("\nSaisie des rentabilités des entrepôts")
rentabilite_entrepot = saisir_donnees_ville(villes, "Rentabilité de l'entrepôt")

while True:
    try:
        budget_total = float(input("\nEntrez le budget total : "))
        if budget_total <= 0:
            print("Le budget doit être positif.")
            continue
        break
    except ValueError:
        print("Veuillez entrer un nombre valide.")

distances = saisir_distances(villes)

while True:
    try:
        distance_max = float(input("\nEntrez la distance maximale entre villes : "))
        if distance_max <= 0:
            print("La distance maximale doit être positive.")
            continue
        break
    except ValueError:
        print("Veuillez entrer un nombre valide.")

priorites = saisir_priorites(villes)

# Création du modèle
m = gp.Model("Selection d'usines et entrepôts")

# Variables binaires pour les usines
x_U = m.addVars(villes, vtype=GRB.BINARY, name="usine")

# Variables binaires pour les entrepôts dans les villes
y = m.addVars(villes, vtype=GRB.BINARY, name="entrepot_ville")

# Variables binaires pour les entrepôts entre les paires de villes
x_E = m.addVars(distances.keys(), vtype=GRB.BINARY, name="entrepot_pair")

# Fonction objectif : maximiser la rentabilité
m.setObjective(
    gp.quicksum(rentabilite_usine[i] * x_U[i] for i in villes) +
    gp.quicksum(rentabilite_entrepot[i] * y[i] for i in villes) +
    gp.quicksum(rentabilite_entrepot[i] * x_E[i, j] for i, j in distances.keys()),
    GRB.MAXIMIZE
)

# Contrainte de budget total
m.addConstr(
    gp.quicksum(couts_usine[i] * x_U[i] for i in villes) +
    gp.quicksum(couts_entrepot[i] * y[i] for i in villes) +
    gp.quicksum(couts_entrepot[i] * x_E[i, j] for i, j in distances.keys()) <= budget_total,
    "Budget"
)

# Contrainte de liaison entre entrepôt et usine
for i in villes:
    m.addConstr(y[i] <= x_U[i], name=f"Entrepot_Liaison_{i}")

# Contrainte sur les entrepôts entre les villes proches
for (i, j) in distances.keys():
    if distances[i, j] <= distance_max:
        m.addConstr(x_E[i, j] <= y[i] + y[j], name=f"Entrepot_Pair_{i}_{j}")

# Contrainte de priorité des villes
for i in villes:
    m.addConstr(x_U[i] + y[i] >= priorites[i], name=f"Priorite_{i}")

# Résolution du modèle
m.optimize()

# Affichage des résultats
print("\n=== Résultats de l'optimisation ===")
if m.status == GRB.OPTIMAL:
    print("\nSolution optimale trouvée :")
    for i in villes:
        if x_U[i].x > 0.5:
            print(f"Une usine est construite à {i}.")
        if y[i].x > 0.5:
            print(f"Un entrepôt est construit à {i}.")
        for j in villes:
            if (i, j) in distances.keys() and x_E[i, j].x > 0.5:
                print(f"Un entrepôt est construit entre {i} et {j}.")
    print(f"\nRentabilité maximale : {m.objVal:.2f}")
else:
    print("Aucune solution optimale trouvée.")
    print("Vérifiez les contraintes du problème.")
