package com.celebritycrm.settings.repository;

import com.celebritycrm.settings.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {

    Optional<UserSettings> findByUserId(Long userId);

    Optional<UserSettings> findByUser_Username(String username);

    Optional<UserSettings> findByUser_Email(String email);

    boolean existsByUserId(Long userId);
}

