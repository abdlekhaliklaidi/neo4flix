package gateway_service.security;

import io.jsonwebtoken.Claims;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtAuthenticationFilter implements ServerAuthenticationConverter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Mono<Authentication> convert(ServerWebExchange exchange) {

        String header = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith("Bearer ")) {
            return Mono.empty();
        }

        String token = header.substring(7).trim();

        if (token.isEmpty()) {
            return Mono.empty();
        }

        try {
            Claims claims = jwtService.extractClaims(token);

            String username = claims.getSubject();

            if (username == null || username.isBlank()) {
                return Mono.empty();
            }

            var authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_USER")
            );

            return Mono.just(
                    new UsernamePasswordAuthenticationToken(
                            username,
                            token,
                            authorities
                    )
            );

        } catch (Exception e) {
            return Mono.empty();
        }
    }
}
