package com.celebritycrm.casting.repository;

import com.celebritycrm.casting.entity.CastingCall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CastingCallRepository extends JpaRepository<CastingCall, Long> {

    List<CastingCall> findByStatusIgnoreCase(String status);

    List<CastingCall> findByProjectTitleContainingIgnoreCase(String projectTitle);

    List<CastingCall> findByRoleNameContainingIgnoreCase(String roleName);

    List<CastingCall> findByLocationContainingIgnoreCase(String location);

    List<CastingCall> findByGenderIgnoreCase(String gender);
}
