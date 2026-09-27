package recommendation_service.model;


public class Recommendation {

    private Long movieId;
    private String title;
    private Integer releaseYear;
    private String description;
    private Double averageRating;
    private Double score;
    private String reason;

    public Recommendation() {
    }

    public Recommendation(
            Long movieId,
            String title,
            Integer releaseYear,
            String description,
            Double averageRating,
            Double score,
            String reason) {

        this.movieId = movieId;
        this.title = title;
        this.releaseYear = releaseYear;
        this.description = description;
        this.averageRating = averageRating;
        this.score = score;
        this.reason = reason;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
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

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
