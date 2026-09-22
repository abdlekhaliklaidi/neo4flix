package user_service.service;

import user_service.Repository.UserRepository;
import user_service.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (user.getRole() == null) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    public User updateUser(Long id, User user) {

        return userRepository.findById(id)
                .map(existingUser -> {

                    existingUser.setUsername(user.getUsername());
                    existingUser.setEmail(user.getEmail());

                    if (user.getPassword() != null &&
                            !user.getPassword().isBlank()) {
                        existingUser.setPassword(user.getPassword());
                    }

                    return userRepository.save(existingUser);
                })
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
