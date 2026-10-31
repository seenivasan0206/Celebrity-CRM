package com.celebritycrm.celebrity.repository;

import com.celebritycrm.celebrity.entity.Celebrity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CelebrityRepository extends JpaRepository<Celebrity, Long> {

    List<Celebrity> findByCategoryIgnoreCase(String category);

    List<Celebrity> findByStatusIgnoreCase(String status);

    List<Celebrity> findByCategoryIgnoreCaseAndStatusIgnoreCase(String category, String status);

    List<Celebrity> findByManagerId(Long managerId);

    Optional<Celebrity> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Celebrity> findByNameContainingIgnoreCaseOrStageNameContainingIgnoreCase(String name, String stageName);
}

