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


    public Movie createMovie(Movie movie) {

    if (movie.getTitle() == null ||
            movie.getTitle().trim().isEmpty()) {

        throw new IllegalArgumentException(
                "Movie title is required"
        );
    }

    if (movie.getReleaseYear() == null) {

        throw new IllegalArgumentException(
                "Release year is required"
        );
    }

    if (movie.getReleaseYear() < 1888 ||
            movie.getReleaseYear() > 2100) {

        throw new IllegalArgumentException(
                "Invalid release year"
        );
    }

    movie.setTitle(movie.getTitle().trim());

    if (movie.getDescription() == null) {
        movie.setDescription("");
    }

    movie.setAverageRating(0.0);

    return movieRepository.save(movie);
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
