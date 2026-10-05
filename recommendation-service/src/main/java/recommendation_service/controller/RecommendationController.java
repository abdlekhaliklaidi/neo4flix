package recommendation_service.controller;

import recommendation_service.model.Recommendation;
import recommendation_service.service.RecommendationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
// @CrossOrigin(origins = "*")

public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService = recommendationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getRecommendations(
            @PathVariable Long userId,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(defaultValue = "10") Integer limit) {

        if (limit < 1 || limit > 50) {
            limit = 10;
        }

        return ResponseEntity.ok(
                recommendationService.getRecommendations(
                        userId,
                        genre,
                        releaseYear,
                        limit
                )
        );
    }
}
