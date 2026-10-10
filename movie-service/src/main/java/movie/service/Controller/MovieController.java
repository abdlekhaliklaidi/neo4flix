package movie.service.Controller;

import movie.service.model.Movie;
import movie.service.service.MovieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import movie.service.Repository.MovieRepository;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
// @CrossOrigin(origins = "http://localhost:4200")
public class MovieController {

    private final MovieService movieService;
    public final MovieRepository movieRepository;

    public MovieController(MovieService movieService, MovieRepository movieRepository) {
        this.movieService = movieService;
        this.movieRepository = movieRepository;
    }

    
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {

        return ResponseEntity.ok(
                movieService.getAllMovies()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(
            @PathVariable Long id
    ) {

        if (id == null || id <= 0) {
           return ResponseEntity.badRequest().build();
        }

        return movieService.getMovieById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    @GetMapping("/search/title")
    public ResponseEntity<List<Movie>> searchByTitle(
            @RequestParam String title
    ) {

        return ResponseEntity.ok(
                movieService.searchByTitle(title)
        );
    }


    @GetMapping("/search/genre")
    public ResponseEntity<List<Movie>> searchByGenre(
            @RequestParam String genre
    ) {

        return ResponseEntity.ok(
                movieService.searchByGenre(genre)
        );
    }


    @GetMapping("/search/year")
    public ResponseEntity<List<Movie>> searchByYear(
            @RequestParam Integer year
    ) {

        return ResponseEntity.ok(
                movieService.searchByYear(year)
        );
    }


    @PostMapping
    public ResponseEntity<Movie> createMovie(
        @RequestBody Movie movie) {

    try {
        Movie createdMovie = movieService.createMovie(movie);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdMovie);

    } catch (IllegalArgumentException e) {
        return ResponseEntity
                .badRequest()
                .build();
    }
}


    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(
            @PathVariable Long id,
            @RequestBody Movie movie
    ) {

        try {

            return ResponseEntity.ok(
                    movieService.updateMovie(
                            id,
                            movie
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(
            @PathVariable Long id
    ) {

        try {

            movieService.deleteMovie(id);

            return ResponseEntity.noContent().build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }
}
