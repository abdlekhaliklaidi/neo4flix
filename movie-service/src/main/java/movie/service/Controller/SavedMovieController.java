package movie.service.Controller;

import movie.service.model.Movie;
import movie.service.service.SavedMovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-movies")
public class SavedMovieController {

    private final SavedMovieService savedMovieService;

    public SavedMovieController(
            SavedMovieService savedMovieService) {

        this.savedMovieService = savedMovieService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Movie>> getSavedMovies(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                savedMovieService.getSavedMovies(userId)
        );
    }

    @PostMapping("/{userId}/{movieId}")
    public ResponseEntity<?> saveMovie(
            @PathVariable Long userId,
            @PathVariable Long movieId) {

        try {

            savedMovieService.saveMovie(
                    userId,
                    movieId
            );

            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/{movieId}")
    public ResponseEntity<Void> removeMovie(
            @PathVariable Long userId,
            @PathVariable Long movieId) {

        savedMovieService.removeMovie(
                userId,
                movieId
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/{movieId}")
    public ResponseEntity<Boolean> isSaved(
            @PathVariable Long userId,
            @PathVariable Long movieId) {

        return ResponseEntity.ok(
                savedMovieService.isSaved(
                        userId,
                        movieId
                )
        );
    }
}