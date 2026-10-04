package gateway_service.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import reactor.core.publisher.Mono;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        ReactiveAuthenticationManager authenticationManager = authentication -> Mono.just(authentication);

        AuthenticationWebFilter jwtFilter = new AuthenticationWebFilter(authenticationManager);

        jwtFilter.setServerAuthenticationConverter(jwtAuthenticationFilter);

        jwtFilter.setSecurityContextRepository( NoOpServerSecurityContextRepository.getInstance() );

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                .cors(cors -> cors
                        .configurationSource(corsConfigurationSource())
                )

                .authorizeExchange(exchange -> exchange
                        .pathMatchers(
                                "/api/users/login",
                                "/api/users/register",
                                "/actuator/health"
                        ).permitAll()

                        // CORS preflight
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()

                        .anyExchange().authenticated()
                )

                .addFilterAt(
                        jwtFilter,
                        SecurityWebFiltersOrder.AUTHENTICATION
                )

                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

       
        config.setAllowedOrigins(List.of( "http://localhost:3000" ));

        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        
        config.setAllowedHeaders(List.of(
                HttpHeaders.AUTHORIZATION,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.ACCEPT
        ));

        
        config.setAllowCredentials(false);

        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
