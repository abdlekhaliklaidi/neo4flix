package movie.service.Repository;

import movie.service.model.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;

import java.util.List;

public interface MovieRepository extends Neo4jRepository<Movie, Long> {

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByGenreIgnoreCase(String genre);

    List<Movie> findByReleaseYear(Integer releaseYear);
}
