package com.celebritycrm.settings.repository;

import com.celebritycrm.settings.entity.CrmSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<CrmSubscription, Long> {

    Optional<CrmSubscription> findByUserId(Long userId);

    Optional<CrmSubscription> findByUser_Username(String username);

    boolean existsByUserId(Long userId);
}

