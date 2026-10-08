package movie.service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node("SavedMovie")
public class SavedMovie {

    @Id
    private Long id;

    private Long userId;
    private Long movieId;

    public SavedMovie() {
    }

    public SavedMovie(Long id, Long userId, Long movieId) {
        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }
}