🎬 Neo4flix

Neo4flix est une plateforme de recommandation de films développée avec une architecture microservices.
Le projet utilise Neo4j pour représenter les relations entre utilisateurs, films, genres et évaluations, Spring Boot pour les services backend, Angular pour l'interface frontend et Docker pour la conteneurisation.

L'objectif est de proposer des recommandations personnalisées en fonction des interactions et des préférences des utilisateurs.


🎯 Présentation
🏗 Architecture

L'application suit une architecture basée sur plusieurs microservices.

                    ┌──────────────────────┐
                    │     Angular App      │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST / HTTPS
                               ▼
                    ┌──────────────────────┐
                    │    API / Security    │
                    │      JWT/OAuth2      │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
     ┌──────────────┐  ┌──────────────┐  ┌────────────────┐
     │    Movie     │  │     User     │  │     Rating     │
     │  Service     │  │   Service    │  │    Service     │
     └──────┬───────┘  └──────┬───────┘  └───────┬────────┘
            │                 │                   │
            └─────────────────┼───────────────────┘
                              ▼
                    ┌──────────────────────┐
                    │        Neo4j         │
                    │    Graph Database    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Recommendation       │
                    │      Service         │
                    └──────────────────────┘


🗄 Modèle de données Neo4j

Neo4j représente les données sous forme de nœuds et de relations.

Nœuds principaux
(:User)
(:Movie)
(:Genre)
(:Rating)

Relations
(:User)-[:RATED]->(:Movie)
(:Movie)-[:HAS_GENRE]->(:Genre)
(:User)-[:WATCHLIST]->(:Movie)
(:Movie)-[:SIMILAR_TO]->(:Movie)

Exemple
(User)
  │
  │ RATED
  ▼
(Movie)
  │
  │ HAS_GENRE
  ▼
(Genre)

Exemple de requête Cypher

Trouver les films notés par un utilisateur :

MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie)
RETURN m, r
ORDER BY r.createdAt DESC;


Trouver les films appartenant à un genre donné :

MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre)
WHERE g.name = $genre
RETURN m;



🔧 Microservices
Movie Service

Responsable de la gestion du catalogue.

Responsabilités

CRUD des films

Recherche

Gestion des genres

Informations de sortie

Note moyenne

Consultation des détails

Exemples d'endpoints :

GET    /api/movies
GET    /api/movies/{id}
POST   /api/movies
PUT    /api/movies/{id}
DELETE /api/movies/{id}
GET    /api/movies/search


🐳 Docker

Chaque microservice est conteneurisé afin de faciliter le déploiement.

Exemple d'architecture Docker :

neo4flix
│
├── frontend
├── movie-service
├── user-service
├── rating-service
├── recommendation-service
│
├── neo4j
│
└── docker-compose.yml


L'ensemble peut être lancé avec :

docker compose up --build


Arrêter les services :

docker compose down


📁 Structure du projet

Une organisation possible :

neo4flix/
│
├── frontend/
│   └── neo4flix-angular/
│
├── backend/
│   │
│   ├── movie-service/
│   │   ├── src/
│   │   └── pom.xml
│   │
│   ├── user-service/
│   │   ├── src/
│   │   └── pom.xml
│   │
│   ├── rating-service/
│   │   ├── src/
│   │   └── pom.xml
│   │
│   └── recommendation-service/
│       ├── src/
│       └── pom.xml
│
├── neo4j/
│   └── scripts/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md