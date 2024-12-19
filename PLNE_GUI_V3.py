import tkinter as tk
from tkinter import ttk, messagebox
import gurobipy as gp
from gurobipy import GRB

class OptimisationApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Optimisation PLNE - Version 3")
        self.root.geometry("1000x600")

        # Variables pour stocker les données
        self.villes = []
        self.distances = {}
        self.couts_usine = {}
        self.couts_entrepot = {}
        self.rentabilite_usine = {}
        self.rentabilite_entrepot = {}
        self.priorites = {}
        self.centres_regions = []
        self.diametre_region = 0
        self.max_entrepots = 0
        self.budget_total = 0

        # Création des onglets
        self.notebook = ttk.Notebook(root)
        self.notebook.pack(fill='both', expand=True, padx=10, pady=5)

        # Onglet 1: Configuration des villes
        self.tab_villes = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_villes, text='Villes')
        self.setup_villes_tab()

        # Onglet 2: Paramètres globaux
        self.tab_params = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_params, text='Paramètres')
        self.setup_params_tab()

        # Onglet 3: Distances
        self.tab_distances = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_distances, text='Distances')
        self.setup_distances_tab()

        # Onglet 4: Résultats
        self.tab_resultats = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_resultats, text='Résultats')
        self.setup_resultats_tab()

    def setup_villes_tab(self):
        frame = ttk.LabelFrame(self.tab_villes, text="Configuration des villes", padding=10)
        frame.pack(fill='both', expand=True, padx=10, pady=5)

        # Nombre de villes
        ttk.Label(frame, text="Nombre de villes:").grid(row=0, column=0, padx=5, pady=5)
        self.nb_villes_var = tk.StringVar()
        self.nb_villes_entry = ttk.Entry(frame, textvariable=self.nb_villes_var)
        self.nb_villes_entry.grid(row=0, column=1, padx=5, pady=5)
        ttk.Button(frame, text="Valider", command=self.creer_champs_villes).grid(row=0, column=2, padx=5, pady=5)

        self.villes_frame = ttk.Frame(frame)
        self.villes_frame.grid(row=1, column=0, columnspan=3, padx=5, pady=5)

    def setup_params_tab(self):
        frame = ttk.Frame(self.tab_params)
        frame.pack(fill='both', expand=True, padx=10, pady=5)

        # Budget total
        budget_frame = ttk.LabelFrame(frame, text="Budget", padding=10)
        budget_frame.pack(fill='x', padx=10, pady=5)
        ttk.Label(budget_frame, text="Budget total:").pack(side='left', padx=5)
        self.budget_var = tk.StringVar()
        ttk.Entry(budget_frame, textvariable=self.budget_var).pack(side='left', padx=5)

        # Diamètre maximal des régions
        diametre_frame = ttk.LabelFrame(frame, text="Diamètre des régions", padding=10)
        diametre_frame.pack(fill='x', padx=10, pady=5)
        ttk.Label(diametre_frame, text="Diamètre maximal des régions:").pack(side='left', padx=5)
        self.diametre_var = tk.StringVar()
        ttk.Entry(diametre_frame, textvariable=self.diametre_var).pack(side='left', padx=5)

        # Nombre maximal d'entrepôts par région
        entrepots_frame = ttk.LabelFrame(frame, text="Entrepôts par région", padding=10)
        entrepots_frame.pack(fill='x', padx=10, pady=5)
        ttk.Label(entrepots_frame, text="Nombre maximal d'entrepôts par région:").pack(side='left', padx=5)
        self.max_entrepots_var = tk.StringVar()
        ttk.Entry(entrepots_frame, textvariable=self.max_entrepots_var).pack(side='left', padx=5)

    def setup_distances_tab(self):
        self.distances_frame = ttk.Frame(self.tab_distances)
        self.distances_frame.pack(fill='both', expand=True, padx=10, pady=5)

    def setup_resultats_tab(self):
        frame = ttk.Frame(self.tab_resultats)
        frame.pack(fill='both', expand=True, padx=10, pady=5)

        ttk.Button(frame, text="Lancer l'optimisation", command=self.optimiser).pack(pady=10)
        self.resultats_text = tk.Text(frame, height=20, width=60)
        self.resultats_text.pack(pady=10)

    def creer_champs_villes(self):
        try:
            n = int(self.nb_villes_var.get())
            if n <= 0:
                messagebox.showerror("Erreur", "Le nombre de villes doit être positif")
                return

            # Nettoyer le frame existant
            for widget in self.villes_frame.winfo_children():
                widget.destroy()

            # Créer les champs pour chaque ville
            self.ville_entries = []
            self.cout_usine_entries = []
            self.cout_entrepot_entries = []
            self.rentabilite_usine_entries = []
            self.rentabilite_entrepot_entries = []
            self.priorite_vars = []
            self.centre_vars = []

            # En-têtes
            headers = ["Ville", "Coût Usine", "Coût Entrepôt", 
                      "Rentabilité Usine", "Rentabilité Entrepôt", "Priorité", "Centre"]
            for j, header in enumerate(headers):
                ttk.Label(self.villes_frame, text=header).grid(row=0, column=j, padx=5, pady=5)

            # Champs de saisie
            for i in range(n):
                ville_entry = ttk.Entry(self.villes_frame)
                ville_entry.grid(row=i+1, column=0, padx=5, pady=2)
                self.ville_entries.append(ville_entry)

                cout_u_entry = ttk.Entry(self.villes_frame)
                cout_u_entry.grid(row=i+1, column=1, padx=5, pady=2)
                self.cout_usine_entries.append(cout_u_entry)

                cout_e_entry = ttk.Entry(self.villes_frame)
                cout_e_entry.grid(row=i+1, column=2, padx=5, pady=2)
                self.cout_entrepot_entries.append(cout_e_entry)

                rent_u_entry = ttk.Entry(self.villes_frame)
                rent_u_entry.grid(row=i+1, column=3, padx=5, pady=2)
                self.rentabilite_usine_entries.append(rent_u_entry)

                rent_e_entry = ttk.Entry(self.villes_frame)
                rent_e_entry.grid(row=i+1, column=4, padx=5, pady=2)
                self.rentabilite_entrepot_entries.append(rent_e_entry)

                prio_var = tk.BooleanVar()
                ttk.Checkbutton(self.villes_frame, variable=prio_var).grid(row=i+1, column=5, padx=5, pady=2)
                self.priorite_vars.append(prio_var)

                centre_var = tk.BooleanVar()
                ttk.Checkbutton(self.villes_frame, variable=centre_var).grid(row=i+1, column=6, padx=5, pady=2)
                self.centre_vars.append(centre_var)

            ttk.Button(self.villes_frame, text="Valider les villes", 
                      command=self.valider_villes).grid(row=n+1, column=0, columnspan=7, pady=10)

        except ValueError:
            messagebox.showerror("Erreur", "Veuillez entrer un nombre valide")

    def valider_villes(self):
        try:
            self.villes = []
            for entry in self.ville_entries:
                ville = entry.get().strip()
                if not ville:
                    raise ValueError("Tous les noms de villes doivent être remplis")
                self.villes.append(ville)

            # Vérifier les doublons
            if len(self.villes) != len(set(self.villes)):
                raise ValueError("Les noms de villes doivent être uniques")

            # Récupérer les autres données
            self.couts_usine = {ville: float(entry.get()) 
                              for ville, entry in zip(self.villes, self.cout_usine_entries)}
            self.couts_entrepot = {ville: float(entry.get()) 
                                 for ville, entry in zip(self.villes, self.cout_entrepot_entries)}
            self.rentabilite_usine = {ville: float(entry.get()) 
                                    for ville, entry in zip(self.villes, self.rentabilite_usine_entries)}
            self.rentabilite_entrepot = {ville: float(entry.get()) 
                                       for ville, entry in zip(self.villes, self.rentabilite_entrepot_entries)}
            self.priorites = {ville: int(var.get()) 
                            for ville, var in zip(self.villes, self.priorite_vars)}
            
            # Récupérer les centres de régions
            self.centres_regions = [ville for ville, var in zip(self.villes, self.centre_vars) if var.get()]

            # Créer la matrice des distances
            self.creer_matrice_distances()
            
            messagebox.showinfo("Succès", "Données des villes enregistrées avec succès")
            self.notebook.select(2)  # Aller à l'onglet des distances

        except ValueError as e:
            messagebox.showerror("Erreur", str(e))

    def creer_matrice_distances(self):
        # Nettoyer le frame des distances
        for widget in self.distances_frame.winfo_children():
            widget.destroy()

        n = len(self.villes)
        self.distance_entries = {}

        # Créer la matrice des distances
        ttk.Label(self.distances_frame, text="Matrice des distances").grid(row=0, column=0, columnspan=n+1, pady=10)

        # En-têtes des colonnes
        for j, ville in enumerate(self.villes):
            ttk.Label(self.distances_frame, text=ville).grid(row=1, column=j+1, padx=5, pady=5)

        # En-têtes des lignes et champs de saisie
        for i, ville1 in enumerate(self.villes):
            ttk.Label(self.distances_frame, text=ville1).grid(row=i+2, column=0, padx=5, pady=5)
            for j, ville2 in enumerate(self.villes):
                if i < j:  # Seulement la moitié supérieure de la matrice
                    entry = ttk.Entry(self.distances_frame, width=8)
                    entry.grid(row=i+2, column=j+1, padx=5, pady=2)
                    self.distance_entries[(ville1, ville2)] = entry

        ttk.Button(self.distances_frame, text="Valider les distances", 
                  command=self.valider_distances).grid(row=n+2, column=0, columnspan=n+1, pady=10)

    def valider_distances(self):
        try:
            self.distances = {}
            for (ville1, ville2), entry in self.distance_entries.items():
                distance = float(entry.get())
                if distance < 0:
                    raise ValueError(f"La distance entre {ville1} et {ville2} doit être positive")
                self.distances[(ville1, ville2)] = distance

            messagebox.showinfo("Succès", "Distances enregistrées avec succès")
            self.notebook.select(3)  # Aller à l'onglet des résultats

        except ValueError as e:
            messagebox.showerror("Erreur", str(e))

    def optimiser(self):
        try:
            # Vérifier que toutes les données sont présentes
            if not self.villes or not self.distances:
                raise ValueError("Veuillez d'abord saisir toutes les données nécessaires")

            if not self.centres_regions:
                raise ValueError("Veuillez sélectionner au moins un centre de région")

            # Récupérer les paramètres globaux
            try:
                self.budget_total = float(self.budget_var.get())
                self.diametre_region = float(self.diametre_var.get())
                self.max_entrepots = int(self.max_entrepots_var.get())
                if self.budget_total <= 0 or self.diametre_region <= 0 or self.max_entrepots <= 0:
                    raise ValueError()
            except ValueError:
                raise ValueError("Les paramètres doivent être des nombres positifs")

            # Créer le modèle
            m = gp.Model("Selection d'usines et entrepôts")

            # Variables binaires pour les usines
            x = m.addVars(self.villes, vtype=GRB.BINARY, name="usine")

            # Variables binaires pour les entrepôts dans les villes
            y = m.addVars(self.villes, vtype=GRB.BINARY, name="entrepot_ville")

            # Fonction objectif : maximiser la rentabilité
            m.setObjective(
                gp.quicksum(self.rentabilite_usine[i] * x[i] for i in self.villes) +
                gp.quicksum(self.rentabilite_entrepot[i] * y[i] for i in self.villes),
                GRB.MAXIMIZE
            )

            # Contrainte de budget total
            m.addConstr(
                gp.quicksum(self.couts_usine[i] * x[i] for i in self.villes) +
                gp.quicksum(self.couts_entrepot[i] * y[i] for i in self.villes) <= self.budget_total,
                "Budget"
            )

            # Contrainte de liaison entre entrepôt et usine
            for i in self.villes:
                m.addConstr(y[i] <= x[i], name=f"Entrepot_Liaison_{i}")

            # Contrainte de priorité des villes
            for i in self.villes:
                m.addConstr(x[i] + y[i] >= self.priorites[i], name=f"Priorite_{i}")

            # Contrainte de limitation des entrepôts par région
            for centre in self.centres_regions:
                region = [ville for ville in self.villes 
                         if ville == centre or 
                         self.distances.get(tuple(sorted((ville, centre))), float('inf')) <= self.diametre_region]
                m.addConstr(
                    gp.quicksum(y[i] for i in region) <= self.max_entrepots,
                    name=f"Region_Limite_{centre}"
                )

            # Résolution
            m.optimize()

            # Affichage des résultats
            self.resultats_text.delete(1.0, tk.END)
            if m.status == GRB.OPTIMAL:
                self.resultats_text.insert(tk.END, "=== Solution optimale trouvée ===\n\n")

                # Afficher les usines et entrepôts
                for i in self.villes:
                    if x[i].x > 0.5:
                        self.resultats_text.insert(tk.END, f"Une usine est construite à {i}.\n")
                    if y[i].x > 0.5:
                        self.resultats_text.insert(tk.END, f"Un entrepôt est construit à {i}.\n")
                self.resultats_text.insert(tk.END, f"\nRentabilité maximale : {m.objVal:.2f}")
            else:
                self.resultats_text.insert(tk.END, "Aucune solution optimale trouvée.\n")
                self.resultats_text.insert(tk.END, "Vérifiez les contraintes du problème.")

        except ValueError as e:
            messagebox.showerror("Erreur", str(e))
        except Exception as e:
            messagebox.showerror("Erreur", f"Une erreur est survenue : {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = OptimisationApp(root)
    root.mainloop()