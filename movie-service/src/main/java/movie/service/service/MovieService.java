package movie.service.service;

import movie.service.Repository.MovieRepository;
import movie.service.model.Movie;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAllWithGenres();
    }

    public Optional<Movie> getMovieById(Long id) {

        if (id == null) {
            return Optional.empty();
        }

        Movie movie = movieRepository.findMovieWithGenres(id);

        return Optional.ofNullable(movie);
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

        if (movie.getAverageRating() == null) {
            movie.setAverageRating(0.0);
        }

        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, Movie movie) {

        return movieRepository.findById(id)
                .map(existingMovie -> {

                    existingMovie.setTitle(
                            movie.getTitle()
                    );

                    existingMovie.setReleaseYear(
                            movie.getReleaseYear()
                    );

                    existingMovie.setDescription(
                            movie.getDescription()
                    );

                    existingMovie.setAverageRating(
                            movie.getAverageRating()
                    );

                    existingMovie.setGenres(
                            movie.getGenres()
                    );

                    return movieRepository.save(
                            existingMovie
                    );
                })
                .orElseThrow(() ->
                        new RuntimeException(
                                "Movie not found with id: " + id
                        )
                );
    }

    public void deleteMovie(Long id) {

        if (!movieRepository.existsById(id)) {

            throw new RuntimeException(
                    "Movie not found with id: " + id
            );
        }

        movieRepository.deleteById(id);
    }

    public List<Movie> searchByTitle(String title) {

        if (title == null || title.isBlank()) {
            return List.of();
        }

        return movieRepository.searchByTitle(
                title.trim()
        );
    }

    public List<Movie> searchByGenre(String genre) {

        if (genre == null || genre.isBlank()) {
            return List.of();
        }

        return movieRepository.findByGenre(
                genre.trim()
        );
    }

    public List<Movie> searchByYear(Integer year) {

        return movieRepository.findAllWithGenres()
                .stream()
                .filter(movie ->
                        movie.getReleaseYear() != null &&
                        movie.getReleaseYear().equals(year)
                )
                .toList();
    }
}
