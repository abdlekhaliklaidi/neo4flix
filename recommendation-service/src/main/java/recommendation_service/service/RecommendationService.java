package recommendation_service.service;

import recommendation_service.model.Recommendation;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {

    private final Neo4jClient neo4jClient;

    public RecommendationService(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    public List<Recommendation> getRecommendations(Long userId) {

        return getRecommendations(
                userId,
                null,
                null,
                10
        );
    }

    public List<Recommendation> getRecommendations(
        Long userId,
        String genre,
        Integer releaseYear,
        Integer limit) {

    StringBuilder query = new StringBuilder("""
        MATCH (u:User {id: $userId})

        MATCH (u)-[myRating:RATED]->(liked:Movie)
        WHERE myRating.score >= 4

        MATCH (other:User)-[otherRating:RATED]->(liked)
        WHERE other <> u
          AND otherRating.score >= 4

        MATCH (other)-[recommendation:RATED]->(movie:Movie)

        WHERE recommendation.score >= 4
          AND NOT EXISTS {
              MATCH (u)-[:RATED]->(movie)
          }
        """);

    if (genre != null && !genre.isBlank()) {
        query.append("""
            AND EXISTS {
                MATCH (movie)-[:IN_GENRE]->(g:Genre)
                WHERE toLower(g.name) = toLower($genre)
            }
            """);
    }

    if (releaseYear != null) {
        query.append("""
            AND movie.releaseYear = $releaseYear
            """);
    }

    query.append("""
        WITH movie,
             count(DISTINCT other) AS similarUsers,
             avg(recommendation.score) AS communityScore,
             count(DISTINCT liked) AS commonMovies

        WITH movie,
             similarUsers,
             communityScore,
             commonMovies,
             (
                 similarUsers * 2.0
                 + communityScore
                 + commonMovies
             ) AS recommendationScore

        RETURN
            movie.id AS movieId,
            movie.title AS title,
            movie.releaseYear AS releaseYear,
            movie.description AS description,
            movie.averageRating AS averageRating,
            recommendationScore AS score,
            CASE
                WHEN similarUsers >= 3
                THEN 'Users with similar ratings liked this movie'
                WHEN commonMovies >= 2
                THEN 'Based on movies you liked'
                ELSE 'Recommended from your rating history'
            END AS reason

        ORDER BY recommendationScore DESC,
                 movie.averageRating DESC

        LIMIT $limit
        """);

    var queryObject = neo4jClient.query(query.toString())
            .bind(userId).to("userId")
            .bind(limit).to("limit");

    if (genre != null && !genre.isBlank()) {
        queryObject = queryObject.bind(genre).to("genre");
    }

    if (releaseYear != null) {
        queryObject = queryObject.bind(releaseYear).to("releaseYear");
    }

    List<Recommendation> recommendations = queryObject
            .fetch()
            .all()
            .stream()
            .map(this::mapRecommendation)
            .toList();

    if (!recommendations.isEmpty()) {
        return recommendations;
    }

        return getPopularMovies(userId, genre, releaseYear, limit);
    }

    private Recommendation mapRecommendation(
            Map<String, Object> result) {

        return new Recommendation(
                toLong(result.get("movieId")),
                (String) result.get("title"),
                toInteger(result.get("releaseYear")),
                (String) result.get("description"),
                toDouble(result.get("averageRating")),
                toDouble(result.get("score")),
                (String) result.get("reason")
        );
    }

    private List<Recommendation> getPopularMovies(
        Long userId,
        String genre,
        Integer releaseYear,
        Integer limit) {

    StringBuilder query = new StringBuilder("""
        MATCH (u:User {id: $userId})
        MATCH (movie:Movie)

        WHERE NOT EXISTS {
            MATCH (u)-[:RATED]->(movie)
        }
        """);

    if (genre != null && !genre.isBlank()) {
        query.append("""
            AND EXISTS {
                MATCH (movie)-[:IN_GENRE]->(g:Genre)
                WHERE toLower(g.name) = toLower($genre)
            }
            """);
    }

    if (releaseYear != null) {
        query.append("""
            AND movie.releaseYear = $releaseYear
            """);
    }

    query.append("""
        OPTIONAL MATCH (:User)-[r:RATED]->(movie)

        WITH movie,
             avg(r.score) AS communityRating,
             count(r) AS ratingsCount

        RETURN
            movie.id AS movieId,
            movie.title AS title,
            movie.releaseYear AS releaseYear,
            movie.description AS description,
            movie.averageRating AS averageRating,
            coalesce(communityRating, movie.averageRating, 0.0) AS score,
            'Popular movies you have not rated yet' AS reason

        ORDER BY ratingsCount DESC,
                 score DESC,
                 movie.title ASC

        LIMIT $limit
        """);

    var queryObject = neo4jClient.query(query.toString())
            .bind(userId).to("userId")
            .bind(limit).to("limit");

    if (genre != null && !genre.isBlank()) {
        queryObject = queryObject.bind(genre).to("genre");
    }

    if (releaseYear != null) {
        queryObject = queryObject.bind(releaseYear).to("releaseYear");
    }

    return queryObject
            .fetch()
            .all()
            .stream()
            .map(this::mapRecommendation)
            .toList();
    }


    private Long toLong(Object value) {

        if (value == null) {
            return null;
        }

        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.valueOf(value.toString());
    }

    private Integer toInteger(Object value) {

        if (value == null) {
            return null;
        }

        if (value instanceof Number number) {
            return number.intValue();
        }

        return Integer.valueOf(value.toString());
    }

    private Double toDouble(Object value) {

        if (value == null) {
            return null;
        }

        if (value instanceof Number number) {
            return number.doubleValue();
        }

        return Double.valueOf(value.toString());
    }
}

