package recommendation_service.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import recommendation_service.event.RatingEvent;

@Component
public class RatingEventConsumer {

    @KafkaListener(
            topics = "movie-ratings",
            groupId = "recommendation-service"
    )
    public void consumeRatingEvent(RatingEvent event) {

        System.out.println(
                "Received rating event: " + event
        );

        System.out.println(
                "User " + event.getUserId()
                        + " rated movie "
                        + event.getMovieId()
                        + " with score "
                        + event.getScore()
        );
    }
}