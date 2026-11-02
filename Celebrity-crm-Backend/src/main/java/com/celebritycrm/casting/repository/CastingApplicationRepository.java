package com.celebritycrm.casting.repository;

import com.celebritycrm.casting.entity.CastingApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CastingApplicationRepository extends JpaRepository<CastingApplication, Long> {

    List<CastingApplication> findByCastingCallId(Long castingCallId);

    List<CastingApplication> findByStatusIgnoreCase(String status);

    List<CastingApplication> findByCastingCallIdAndStatusIgnoreCase(Long castingCallId, String status);

    List<CastingApplication> findByApplicantNameContainingIgnoreCase(String applicantName);

    long countByCastingCallId(Long castingCallId);
}

