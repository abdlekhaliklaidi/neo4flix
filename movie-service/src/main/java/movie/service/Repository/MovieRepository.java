package movie.service.Repository;

import movie.service.model.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;

public interface MovieRepository extends Neo4jRepository<Movie, Long> {

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByReleaseYear(Integer releaseYear);

    @Query("""
        MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
        WHERE toLower(g.name) = toLower($genre)
        RETURN m
        """)
    List<Movie> findByGenre(String genre);
}
