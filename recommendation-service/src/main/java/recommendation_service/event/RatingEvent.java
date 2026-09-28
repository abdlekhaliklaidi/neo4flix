package recommendation_service.event;

public class RatingEvent {

    private String eventType;
    private Long userId;
    private Long movieId;
    private Integer score;
    private String timestamp;

    public RatingEvent() {
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

    @Override
    public String toString() {
        return "RatingEvent{" +
                "eventType='" + eventType + '\'' +
                ", userId=" + userId +
                ", movieId=" + movieId +
                ", score=" + score +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}
