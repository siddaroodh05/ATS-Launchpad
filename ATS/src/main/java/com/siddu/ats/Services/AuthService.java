package com.siddu.ats.Services;

import com.siddu.ats.DTO.Requests.LoginRequest;
import com.siddu.ats.DTO.Requests.RegisterRequest;
import com.siddu.ats.DTO.Response.AuthResult;
import com.siddu.ats.Entities.UserEntity;
import com.siddu.ats.Exception.ConflictException;
import com.siddu.ats.Exception.InvalidCredentialException;
import com.siddu.ats.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResult register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Username or email already exists");
        }

        UserEntity user = UserEntity.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();

        UserEntity savedUser = userRepository.save(user);

        String token=jwtService.createToken(savedUser.getId(),savedUser.getEmail());

        return new AuthResult(savedUser.getUsername(),
                savedUser.getEmail(),
                token
            );
    }


    public AuthResult login(LoginRequest request) {

        UserEntity user = userRepository.findByEmail(request.Email()).orElseThrow(
                () -> new InvalidCredentialException("Invalid credentials")
        );
        if(!passwordEncoder.matches(request.password(),user.getPasswordHash())){
            throw new InvalidCredentialException("Invalid credentials");
        }
        String token=jwtService.createToken(user.getId(),user.getEmail());

        return new AuthResult(user.getUsername(),
                user.getEmail(),
                token);
    }
}