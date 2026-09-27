package rating_service.event;

public class RatingEvent {

    private String eventType;
    private Long userId;
    private Long movieId;
    private Integer score;
    private String timestamp;

    public RatingEvent() {
    }

    public RatingEvent(
            String eventType,
            Long userId,
            Long movieId,
            Integer score,
            String timestamp) {

        this.eventType = eventType;
        this.userId = userId;
        this.movieId = movieId;
        this.score = score;
        this.timestamp = timestamp;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
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

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
