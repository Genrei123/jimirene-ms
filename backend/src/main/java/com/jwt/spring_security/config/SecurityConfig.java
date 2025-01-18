package com.jwt.spring_security.config;


import com.jwt.spring_security.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class  SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/register").permitAll()
                        .requestMatchers("/clock-in","/branches","/unarchivePatient/","/archivePatient/{id}","/users","/service/**","/getPatientLogs", "/purchaseItems", "/searchPatients", "/deletePatient/{id}", "/generateqr", "/scanqr", "/addPatientLog", "/generatepdf/{patientId}", "/api/upload-profile-picture", "/addPatient", "/getPatient","/getPatient/{id}", "/home", "/getPatient", "/employees/me", "/items").hasAnyAuthority("ROLE_EMPLOYEE", "ROLE_OWNER") // Using hasAuthority instead of hasRole
                        .requestMatchers("/update/","/delete/{id}","/addBranch", "/branches", "/deleteBranch/", "/readBranch/", "/items", "/items/", "/addItems", "/deleteItems/{id}", "/addItem", "/addItems", "/updateItems/{id}", "/items","/inventory", "/employees", "/reports", "/branches", "/readBranch/", "/deleteBranch/", "/addBranch", "/addItems").hasAuthority("ROLE_OWNER") // Using hasAuthority instead of hasRole
                        .anyRequest().authenticated()

                )
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }




    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

        // Password encoded with BCrypt
        provider.setPasswordEncoder(new BCryptPasswordEncoder(Constants.BCRYPT_STRENGTH));
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // This is a user in the database!
        UserDetails user1 = User
                .withDefaultPasswordEncoder()
                .username("Genrey")
                .password("Cristobal")
                .roles("Owner")
                .build();


        // Implements UserDetailsService
        return new InMemoryUserDetailsManager(user1);

    }
}
