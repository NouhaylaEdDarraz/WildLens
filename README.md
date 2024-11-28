## Configuration du projet

1. **Backend :**

   - Allez dans le répertoire `backend` :
     ```bash
     cd backend
     ```
   - Installez les dépendances :
     ```bash
     npm install
     ```
   - Lancez le serveur backend :
     ```bash
     npm start
     ```

2. **Frontend :**

   - Allez dans le répertoire `frontend` :
     ```bash
     cd frontend
     ```
   - Installez les dépendances :
     ```bash
     npm install
     ```
   - Lancez le serveur frontend :
     ```bash
     npm start
     ```

3. **Keras (Python) :**

   - Allez dans le répertoire contenant votre script Keras :
     ```bash
     cd keras
     ```
   - Exécutez le script Python `app.py` :
     ```bash
     python app.py
     ```

## Configuration de l'environnement

Créez un fichier `.env` dans le répertoire `backend` et ajoutez les variables suivantes :

JWT_SECRET=<votre-clé-secrète>
MONGODB_URI=<votre-première-uri-mongodb>
SEND_GRID=<votre-clé-sendgrid>
BASE_URL=<votre-url-de-base>
