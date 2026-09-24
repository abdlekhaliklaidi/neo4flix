package movie.service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.HashSet;
import java.util.Set;

@Node("Movie")
public class Movie {

    @Id
    private Long id;

    private String title;
    private Integer releaseYear;
    private String description;
    private Double averageRating;

    @Relationship(type = "IN_GENRE")
    private Set<Genre> genres = new HashSet<>();

    public Movie() {
    }

    public Movie(Long id,
                 String title,
                 Integer releaseYear,
                 String description,
                 Double averageRating) {
        this.id = id;
        this.title = title;
        this.releaseYear = releaseYear;
        this.description = description;
        this.averageRating = averageRating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Set<Genre> getGenres() {
        return genres;
    }

    public void setGenres(Set<Genre> genres) {
        this.genres = genres;
    }
}
