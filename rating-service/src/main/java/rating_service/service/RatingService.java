package rating_service.service;

import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import rating_service.event.RatingEvent;

import java.time.Instant;
import java.util.Collection;
import java.util.Map;

@Service
public class RatingService {

    private final Neo4jClient neo4jClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public RatingService(
            Neo4jClient neo4jClient,
            KafkaTemplate<String, Object> kafkaTemplate) {

        this.neo4jClient = neo4jClient;
        this.kafkaTemplate = kafkaTemplate;
    }

    public Map<String, Object> createOrUpdateRating(
            Long userId,
            Long movieId,
            Integer score) {

        if (score == null || score < 1 || score > 5) {
            throw new IllegalArgumentException(
                    "Score must be between 1 and 5"
            );
        }

        Map<String, Object> rating = neo4jClient.query("""
                MATCH (u:User {id: $userId})
                MATCH (m:Movie {id: $movieId})
                MERGE (u)-[r:RATED]->(m)
                SET r.score = $score,
                    r.createdAt = coalesce(
                        r.createdAt,
                        datetime()
                    ),
                    r.updatedAt = datetime()
                RETURN {
                    userId: u.id,
                    movieId: m.id,
                    score: r.score,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt
                } AS rating
                """)
                .bind(userId).to("userId")
                .bind(movieId).to("movieId")
                .bind(score).to("score")
                .fetch()
                .one()
                .orElseThrow(() ->
                        new RuntimeException(
                                "User or Movie not found"
                        ));

        RatingEvent event = new RatingEvent(
                "RATING_CREATED_OR_UPDATED",
                userId,
                movieId,
                score,
                Instant.now().toString()
        );

        kafkaTemplate.send(
                "movie-ratings",
                userId.toString(),
                event
        );

        return rating;
    }

    public Collection<Map<String, Object>> getUserRatings(Long userId) {

        return neo4jClient.query("""
                MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie)
                RETURN {
                    userId: u.id,
                    movieId: m.id,
                    title: m.title,
                    score: r.score,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt
                } AS rating
                ORDER BY r.updatedAt DESC
                """)
                .bind(userId).to("userId")
                .fetch()
                .all();
    }

    public Collection<Map<String, Object>> getMovieRatings(Long movieId) {

        return neo4jClient.query("""
                MATCH (u:User)-[r:RATED]->(m:Movie {id: $movieId})
                RETURN {
                    userId: u.id,
                    username: u.username,
                    movieId: m.id,
                    score: r.score,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt
                } AS rating
                ORDER BY r.score DESC
                """)
                .bind(movieId).to("movieId")
                .fetch()
                .all();
    }

    public void deleteRating(Long userId, Long movieId) {

        neo4jClient.query("""
                MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie {id: $movieId})
                DELETE r
                """)
                .bind(userId).to("userId")
                .bind(movieId).to("movieId")
                .run();
    }
}