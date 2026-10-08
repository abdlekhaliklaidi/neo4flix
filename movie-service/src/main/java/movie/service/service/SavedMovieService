package movie.service.service;

import movie.service.Repository.MovieRepository;
import movie.service.Repository.SavedMovieRepository;
import movie.service.model.Movie;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedMovieService {

    private final SavedMovieRepository savedMovieRepository;
    private final MovieRepository movieRepository;

    public SavedMovieService(
            SavedMovieRepository savedMovieRepository,
            MovieRepository movieRepository) {

        this.savedMovieRepository = savedMovieRepository;
        this.movieRepository = movieRepository;
    }

    public List<Movie> getSavedMovies(Long userId) {

        return savedMovieRepository.findSavedMovies(userId);
    }

    public void saveMovie(Long userId, Long movieId) {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        if (movieId == null) {
            throw new IllegalArgumentException("Movie ID is required");
        }

        if (!movieRepository.existsById(movieId)) {
            throw new IllegalArgumentException("Movie not found");
        }

        if (savedMovieRepository.isSaved(userId, movieId)) {
            throw new IllegalArgumentException(
                    "Movie is already saved"
            );
        }

        savedMovieRepository.saveMovie(userId, movieId);
    }

    public void removeMovie(Long userId, Long movieId) {

        savedMovieRepository.deleteSavedMovie(
                userId,
                movieId
        );
    }

    public boolean isSaved(Long userId, Long movieId) {

        return savedMovieRepository.isSaved(
                userId,
                movieId
        );
    }
}