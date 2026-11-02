package com.celebritycrm.agencies.repository;

import com.celebritycrm.agencies.entity.Agency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgencyRepository extends JpaRepository<Agency, Long> {

    Optional<Agency> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Agency> findByStatusIgnoreCase(String status);

    List<Agency> findByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(String name, String country);
}

