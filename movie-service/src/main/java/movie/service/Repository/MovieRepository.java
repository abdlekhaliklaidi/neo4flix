package movie.service.Repository;

import movie.service.model.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;

public interface MovieRepository extends Neo4jRepository<Movie, Long> {

    @Query("""
        MATCH (m:Movie)
        WHERE toLower(m.title) CONTAINS toLower($title)
        OPTIONAL MATCH (m)-[:IN_GENRE]->(g:Genre)
        RETURN m, collect(g)
        """)
    List<Movie> searchByTitle(String title);

    @Query("""
        MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
        WHERE toLower(g.name) = toLower($genre)
        OPTIONAL MATCH (m)-[:IN_GENRE]->(allGenres:Genre)
        RETURN m, collect(allGenres)
        """)
    List<Movie> findByGenre(String genre);

    @Query("""
        MATCH (m:Movie)
        OPTIONAL MATCH (m)-[:IN_GENRE]->(g:Genre)
        RETURN m, collect(g)
        """)
    List<Movie> findAllWithGenres();

    @Query("""
        MATCH (m:Movie)
        WHERE m.id = $id
        OPTIONAL MATCH (m)-[:IN_GENRE]->(g:Genre)
        RETURN m, collect(g)
        """)
    Movie findMovieWithGenres(Long id);

    @Query("""
    MATCH (m:Movie)
    RETURN coalesce(max(m.id), 0) + 1
    """)
    Long findNextMovieId();
}
