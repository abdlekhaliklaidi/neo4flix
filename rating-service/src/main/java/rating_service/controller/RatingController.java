package rating_service.controller;

import rating_service.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<?> rateMovie(
            @RequestParam Long userId,
            @RequestParam Long movieId,
            @RequestParam Integer score) {

        try {
            return ResponseEntity.ok(
                    ratingService.createOrUpdateRating(
                            userId,
                            movieId,
                            score
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public Collection<Map<String, Object>> getUserRatings(
            @PathVariable Long userId) {

        return ratingService.getUserRatings(userId);
    }

    @GetMapping("/movie/{movieId}")
    public Collection<Map<String, Object>> getMovieRatings(
            @PathVariable Long movieId) {

        return ratingService.getMovieRatings(movieId);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteRating(
            @RequestParam Long userId,
            @RequestParam Long movieId) {

        ratingService.deleteRating(userId, movieId);

        return ResponseEntity.noContent().build();
    }
}
