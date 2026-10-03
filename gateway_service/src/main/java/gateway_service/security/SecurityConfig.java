package gateway_service.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http) {

        ReactiveAuthenticationManager authenticationManager = authentication -> Mono.just(authentication);

        AuthenticationWebFilter jwtFilter = new AuthenticationWebFilter(authenticationManager);

        jwtFilter.setServerAuthenticationConverter(jwtAuthenticationFilter);

        jwtFilter.setSecurityContextRepository(
                NoOpServerSecurityContextRepository.getInstance()
        );

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                .authorizeExchange(exchange -> exchange
                        .pathMatchers(
                                "/api/users/login",
                                "/api/users/register",
                                "/actuator/health"
                        ).permitAll()

                        .anyExchange()
                        .authenticated()
                )

                .addFilterAt(
                        jwtFilter,
                        SecurityWebFiltersOrder.AUTHENTICATION
                )

                .build();
    }
}
