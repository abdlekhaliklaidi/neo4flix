package movie.service.Repository;

import movie.service.model.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;

public interface SavedMovieRepository
        extends Neo4jRepository<Movie, Long> {

    @Query("""
        MATCH (u:User {id: $userId})-[:SAVED]->(m:Movie)
        OPTIONAL MATCH (m)-[:IN_GENRE]->(g:Genre)
        RETURN m, collect(g)
        """)
    List<Movie> findSavedMovies(Long userId);

    @Query("""
        MATCH (u:User {id: $userId})-[:SAVED]->(m:Movie {id: $movieId})
        RETURN count(m) > 0
        """)
    boolean isSaved(Long userId, Long movieId);

    @Query("""
        MATCH (u:User {id: $userId}), (m:Movie {id: $movieId})
        MERGE (u)-[:SAVED]->(m)
        RETURN m
        """)
    Movie saveMovie(Long userId, Long movieId);

    @Query("""
        MATCH (u:User {id: $userId})-[r:SAVED]->(m:Movie {id: $movieId})
        DELETE r
        """)
    void deleteSavedMovie(Long userId, Long movieId);
}
