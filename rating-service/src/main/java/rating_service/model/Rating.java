package rating_service.model;

import java.time.LocalDateTime;

public class Rating {

    private Long userId;
    private Long movieId;
    private Integer score;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Rating() {
    }

    public Rating(Long userId,
                  Long movieId,
                  Integer score,
                  LocalDateTime createdAt,
                  LocalDateTime updatedAt) {
        this.userId = userId;
        this.movieId = movieId;
        this.score = score;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
