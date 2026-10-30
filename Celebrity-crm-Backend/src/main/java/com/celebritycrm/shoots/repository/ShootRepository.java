package com.celebritycrm.shoots.repository;

import com.celebritycrm.shoots.entity.Shoot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShootRepository extends JpaRepository<Shoot, Long> {

    List<Shoot> findByCelebrityId(Long celebrityId);

    List<Shoot> findByCampaignId(Long campaignId);

    List<Shoot> findByStatusIgnoreCase(String status);

    List<Shoot> findByShootTypeIgnoreCase(String shootType);

    List<Shoot> findByShootDate(LocalDate shootDate);

    List<Shoot> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);

    long countByStatusIgnoreCase(String status);

    long countByShootTypeIgnoreCase(String shootType);
}

