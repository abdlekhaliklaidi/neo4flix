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
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, Movie movie) {

        return movieRepository.findById(id)
                .map(existingMovie -> {

                    existingMovie.setTitle(movie.getTitle());
                    existingMovie.setGenre(movie.getGenre());
                    existingMovie.setReleaseYear(movie.getReleaseYear());
                    existingMovie.setDescription(movie.getDescription());
                    existingMovie.setAverageRating(movie.getAverageRating());

                    return movieRepository.save(existingMovie);
                })
                .orElseThrow(() ->
                        new RuntimeException("Movie not found with id: " + id));
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    public List<Movie> searchByTitle(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Movie> searchByGenre(String genre) {
        return movieRepository.findByGenreIgnoreCase(genre);
    }

    public List<Movie> searchByYear(Integer year) {
        return movieRepository.findByReleaseYear(year);
    }
}
