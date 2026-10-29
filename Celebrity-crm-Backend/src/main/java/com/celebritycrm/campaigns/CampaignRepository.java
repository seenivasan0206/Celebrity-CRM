package com.celebritycrm.campaigns;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    List<Campaign> findByManagerId(Long managerId);

    List<Campaign> findByStatusIgnoreCase(String status);
}

